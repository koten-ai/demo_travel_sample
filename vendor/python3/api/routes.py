"""Core API routes (config, health, chat, history)."""
import asyncio
import json
import re
import time
import uuid
from pathlib import Path

import httpx
from fastapi import APIRouter, File, Form, Request, UploadFile
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse

from python3.agent.loop import run_agent
from python3.api.util import json_body as _json_body
from python3.config import load_config, resolve_zeus_config, save_config
from python3.constants import BASE_DIR, CHAT_REQ_DIR, PING_TIMEOUT, normalize_api_version
from python3.setup import (
    count_bucket_catalogs,
    evaluate_setup_status,
    resolve_catalog_dir,
    sanitize_bucket_name,
    sanitize_scope_name,
)
from python3.http_client import client
from python3.logging_setup import logger
from python3.storage.chat_store import CHATS, append_chat_event, chat_lock, persist_chat
from python3.trace.metrics import build_tool_order, summarize_chat_metrics
from python3.zeus.auth import merge_proxy_auth_headers, resolve_zeus_auth
from python3.zeus.proxy_auth import format_auth_failure, validate_zeus_engine_url
from python3.zeus.catalog import (
    chat_request_filename,
    fetch_scope_bootstrap,
    fetch_scope_chat_request,
    list_chat_requests,
    modes_to_bootstrap,
)

router = APIRouter()


async def _ping_zeus_ready(zeus_url: str, headers: dict | None = None, zcfg: dict | None = None) -> dict:
    """Probe Zeus /readyz (and /healthz on degradation) with optional auth headers."""
    zeus_url = zeus_url.rstrip("/")
    probe_headers, proxy_auth = merge_proxy_auth_headers(zcfg or {}, headers)
    try:
        r = await client().get(
            f"{zeus_url}/readyz", headers=probe_headers, auth=proxy_auth, timeout=PING_TIMEOUT)
        if r.status_code == 200:
            logger.debug(f"ping: zeus readyz ok (url={zeus_url})")
            return {"status": "green", "detail": "ready", "code": r.status_code}
        if r.status_code == 401:
            detail = format_auth_failure(
                zeus_url, r.status_code, r.text, response_headers=dict(r.headers))
            logger.info(f"ping: zeus readyz auth failed (url={zeus_url})")
            return {"status": "red", "detail": detail, "code": r.status_code, "auth": "failed"}
        try:
            h = await client().get(
                f"{zeus_url}/healthz", headers=probe_headers, auth=proxy_auth, timeout=PING_TIMEOUT)
            note = f"healthz {h.status_code}, readyz {r.status_code}"
        except httpx.HTTPError:
            note = f"readyz {r.status_code}"
        logger.info(f"ping: zeus degraded (url={zeus_url}) note={note}")
        return {"status": "yellow", "detail": note, "code": r.status_code}
    except httpx.HTTPError as e:
        logger.warning(f"ping: zeus unreachable (url={zeus_url}) err={e}")
        return {"status": "red", "detail": str(e)[:200], "code": 0}


def _scope_for_basic_ping(body: dict, cfg: dict) -> tuple[str | None, str | None]:
    bucket = body.get("bucket")
    scope = body.get("scope")
    if bucket and scope:
        return bucket, scope
    sample = body.get("sample") or cfg.get("default_sample", "beer-sample")
    triple = cfg.get("samples", {}).get(sample, {})
    return triple.get("bucket", sample), triple.get("scope", "_default")

_SAFE_FILENAME = re.compile(r"^[a-zA-Z0-9._-]+\.json$")


def _request_bucket(value: str | None) -> str | None:
    return sanitize_bucket_name(value or "")


def _catalog_bucket_param(request: Request) -> str:
    return (
        request.query_params.get("bucket")
        or request.query_params.get("batch_hash")
        or ""
    ).strip()


def _sanitize_catalog_filename(name: str) -> str | None:
    base = Path(name).name
    if not _SAFE_FILENAME.match(base):
        return None
    return base


@router.get("/api/setup-status")
async def setup_status():
    cfg = await load_config()
    return JSONResponse(evaluate_setup_status(cfg))


@router.get("/setup")
async def setup_page():
    cfg = await load_config()
    if evaluate_setup_status(cfg)["complete"]:
        return RedirectResponse("/", status_code=302)
    return FileResponse(str(BASE_DIR / "templates" / "setup-wizard.html"))


@router.get("/")
async def index():
    cfg = await load_config()
    if not evaluate_setup_status(cfg)["complete"]:
        return RedirectResponse("/setup", status_code=302)
    return FileResponse(str(BASE_DIR / "templates" / "index.html"))


@router.get("/api/catalogs")
async def get_catalogs(request: Request):
    bucket = _catalog_bucket_param(request)
    entries = list_chat_requests()
    if bucket:
        prefix = f"V2/{bucket}/"
        entries = [e for e in entries if (e.get("file") or "").startswith(prefix)]
    return JSONResponse({
        "catalogs": entries,
        "bucket": bucket,
        "batch_hash": bucket,
        "count": len(entries),
    })


@router.post("/api/catalogs/upload")
async def upload_catalogs(
    files: list[UploadFile] = File(...),
    bucket: str = Form(""),
    batch_hash: str = Form(""),
    scope: str = Form(""),
):
    if not files:
        return JSONResponse({"error": "no files provided"}, status_code=400)

    cfg = await load_config()
    resolved_scope = sanitize_scope_name(scope) if scope.strip() else None
    try:
        resolved_bucket, dest_dir = resolve_catalog_dir(
            _request_bucket(bucket) or _request_bucket(batch_hash),
            cfg,
            scope=resolved_scope,
        )
    except ValueError as e:
        return JSONResponse({"error": str(e)}, status_code=400)

    uploaded = []
    errors = []
    warnings = []

    for uf in files:
        safe_name = _sanitize_catalog_filename(uf.filename or "")
        if not safe_name:
            errors.append(f"invalid filename: {uf.filename!r}")
            continue

        target = dest_dir / safe_name
        if target.exists():
            errors.append(f"duplicate: {safe_name}")
            continue

        raw = await uf.read()
        try:
            doc = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as e:
            errors.append(f"{safe_name}: invalid JSON ({e})")
            continue

        if doc.get("_format") != "zeus.chat_request.v2":
            warnings.append(f"{safe_name}: missing _format zeus.chat_request.v2")

        target.write_text(json.dumps(doc, indent=2), encoding="utf-8")
        uploaded.append({"name": safe_name, "path": f"V2/{resolved_bucket}/{safe_name}"})

    if not uploaded and errors:
        return JSONResponse({"error": "; ".join(errors)}, status_code=400)

    return JSONResponse({
        "bucket": resolved_bucket,
        "batch_hash": resolved_bucket,
        "uploaded": uploaded,
        "errors": errors,
        "warnings": warnings,
        "catalogs": list_chat_requests(),
        "batch_count": count_bucket_catalogs(resolved_bucket),
    })


@router.post("/api/catalogs/bootstrap")
async def bootstrap_catalogs(request: Request):
    """Fetch live chat_request JSON files from Zeus into V2/{bucket}_{scope}/."""
    body = await _json_body(request)
    cfg = await load_config()
    zcfg = resolve_zeus_config(cfg)
    zeus_url = (zcfg.get("url") or "").rstrip("/")
    if not zeus_url:
        return JSONResponse({"error": "no Zeus URL configured"}, status_code=400)
    if not cfg.get("setup_zeus_verified"):
        return JSONResponse(
            {"error": "Zeus connection not verified — complete step 1 first"},
            status_code=400,
        )

    sample = cfg.get("default_sample", "beer-sample")
    triple = cfg.get("samples", {}).get(sample, {})
    bucket = triple.get("bucket", sample)
    scope = triple.get("scope", "_default")
    requested_bucket = _request_bucket(body.get("bucket")) or _request_bucket(body.get("batch_hash"))
    if requested_bucket:
        bucket = requested_bucket
    requested_scope = sanitize_scope_name(str(body.get("scope") or "").strip())
    if requested_scope:
        scope = requested_scope
    auth_bucket = auth_scope = None
    if zcfg.get("auth_mode") == "basic":
        auth_bucket, auth_scope = bucket, scope

    try:
        headers, _auth_note = await resolve_zeus_auth(
            zeus_url, zcfg, bucket=auth_bucket, scope=auth_scope,
        )
    except RuntimeError as e:
        return JSONResponse({"error": str(e)}, status_code=400)

    try:
        resolved_bucket, dest_dir = resolve_catalog_dir(bucket, cfg, scope=scope)
    except ValueError as e:
        return JSONResponse({"error": str(e)}, status_code=400)

    modes = modes_to_bootstrap(cfg, bucket, scope)
    downloads: list[dict] = []
    boot: dict = {}

    try:
        boot = await fetch_scope_bootstrap(zeus_url, bucket, scope, headers)
        chat_req = boot.get("chat_request")
        if chat_req:
            fname = chat_request_filename("default")
            target = dest_dir / fname
            target.write_text(json.dumps(chat_req, indent=2), encoding="utf-8")
            downloads.append({
                "name": fname,
                "size": target.stat().st_size,
                "status": "completed",
                "mode": "default",
            })
        else:
            downloads.append({
                "name": chat_request_filename("default"),
                "size": 0,
                "status": "failed",
                "error": "bootstrap response missing chat_request",
                "mode": "default",
            })
    except (RuntimeError, httpx.HTTPError) as e:
        downloads.append({
            "name": chat_request_filename("default"),
            "size": 0,
            "status": "failed",
            "error": str(e),
            "mode": "default",
        })

    for mode in modes:
        if mode == "default":
            continue
        fname = chat_request_filename(mode)
        try:
            doc = await fetch_scope_chat_request(zeus_url, bucket, scope, mode, headers)
            target = dest_dir / fname
            target.write_text(json.dumps(doc, indent=2), encoding="utf-8")
            downloads.append({
                "name": fname,
                "size": target.stat().st_size,
                "status": "completed",
                "mode": mode,
            })
        except (RuntimeError, httpx.HTTPError) as e:
            downloads.append({
                "name": fname,
                "size": 0,
                "status": "failed",
                "error": str(e),
                "mode": mode,
            })

    completed = [d for d in downloads if d.get("status") == "completed"]
    if not completed:
        return JSONResponse(
            {"error": "no chat_request files downloaded", "downloads": downloads},
            status_code=502,
        )

    prefix = f"V2/{resolved_bucket}/"
    return JSONResponse({
        "bucket": resolved_bucket,
        "batch_hash": resolved_bucket,
        "downloads": downloads,
        "catalogs": [e for e in list_chat_requests() if (e.get("file") or "").startswith(prefix)],
        "batch_count": count_bucket_catalogs(resolved_bucket),
    })


@router.post("/api/catalogs/delete")
async def delete_catalogs(request: Request):
    """Remove catalog JSON files from a bucket directory under V2/."""
    body = await _json_body(request)
    bucket = _request_bucket(body.get("bucket")) or _request_bucket(body.get("batch_hash"))
    files = body.get("files") or []

    if not bucket:
        return JSONResponse({"error": "valid bucket is required"}, status_code=400)
    if not isinstance(files, list) or not files:
        return JSONResponse({"error": "files list is required"}, status_code=400)

    dest_dir = CHAT_REQ_DIR / "V2" / bucket
    if not dest_dir.is_dir():
        return JSONResponse({"error": f"bucket V2/{bucket}/ not found"}, status_code=404)

    deleted = []
    errors = []
    for raw_name in files:
        safe_name = _sanitize_catalog_filename(str(raw_name))
        if not safe_name:
            errors.append(f"invalid filename: {raw_name!r}")
            continue
        target = dest_dir / safe_name
        if not target.is_file():
            errors.append(f"not found: {safe_name}")
            continue
        try:
            target.unlink()
            deleted.append(safe_name)
        except OSError as e:
            errors.append(f"{safe_name}: {e}")

    if not deleted and errors:
        return JSONResponse({"error": "; ".join(errors)}, status_code=400)

    if count_bucket_catalogs(bucket) == 0:
        try:
            dest_dir.rmdir()
        except OSError:
            pass

    return JSONResponse({
        "bucket": bucket,
        "batch_hash": bucket,
        "deleted": deleted,
        "errors": errors,
        "batch_count": count_bucket_catalogs(bucket),
        "catalogs": list_chat_requests(),
    })


@router.get("/api/config")
async def get_config():
    cfg = await load_config()
    cfg.setdefault("default_api_version", "v2")
    # Surface the discovered chat_request modes alongside config so the
    # UI can build the mode dropdown from whatever files exist.
    chat_requests = list_chat_requests()
    cfg["_chat_requests"] = chat_requests
    cfg["chat_requests"] = chat_requests
    return JSONResponse(cfg)


@router.post("/api/config")
async def post_config(request: Request):
    incoming = await _json_body(request)
    incoming.pop("_chat_requests", None)
    incoming.pop("chat_requests", None)
    await save_config(incoming)
    return JSONResponse({"ok": True})


@router.get("/api/ping")
async def ping(request: Request):
    """Health-check the default Zeus connection (URL + auth from config)."""
    cfg = await load_config()
    zcfg = resolve_zeus_config(cfg)
    zeus_url = (request.query_params.get("zeus_url") or zcfg.get("url", "")).rstrip("/")
    if not zeus_url:
        return JSONResponse({"status": "red", "detail": "no default zeus connection configured", "code": 0})
    if url_err := validate_zeus_engine_url(zeus_url):
        return JSONResponse({"status": "red", "detail": url_err, "code": 0, "auth": "failed"})

    bucket = scope = None
    if zcfg.get("auth_mode") == "basic":
        bucket, scope = _scope_for_basic_ping({}, cfg)

    try:
        headers, auth_note = await resolve_zeus_auth(
            zeus_url, zcfg, bucket=bucket, scope=scope,
        )
    except RuntimeError as e:
        logger.info(f"ping: auth resolution failed (url={zeus_url}) err={e}")
        return JSONResponse({"status": "red", "detail": str(e), "code": 0, "auth": "failed"})

    result = await _ping_zeus_ready(zeus_url, headers, zcfg)
    if auth_note:
        result["auth"] = auth_note
    result["connection"] = zcfg.get("name") or cfg.get("default_zeus_connection") or ""
    return JSONResponse(result)


@router.post("/api/ping")
async def ping_with_auth(request: Request):
    """Ping Zeus /readyz using optional per-connection auth from the request body."""
    body = await _json_body(request)
    cfg = await load_config()
    zeus_url = (body.get("zeus_url") or resolve_zeus_config(cfg).get("url", "")).rstrip("/")
    if not zeus_url:
        return JSONResponse({"status": "red", "detail": "zeus_url is required", "code": 0})
    if url_err := validate_zeus_engine_url(zeus_url):
        return JSONResponse({"status": "red", "detail": url_err, "code": 0, "auth": "failed"})

    zcfg = body.get("zeus") or resolve_zeus_config(cfg)
    auth_mode = zcfg.get("auth_mode", "none")
    bucket = scope = None
    if auth_mode == "basic":
        bucket, scope = _scope_for_basic_ping(body, cfg)

    try:
        headers, auth_note = await resolve_zeus_auth(
            zeus_url, zcfg, bucket=bucket, scope=scope, force=bool(body.get("force_auth")),
        )
    except RuntimeError as e:
        logger.info(f"ping: auth resolution failed (url={zeus_url}) err={e}")
        return JSONResponse({"status": "red", "detail": str(e), "code": 0, "auth": "failed"})

    result = await _ping_zeus_ready(zeus_url, headers, zcfg)
    if auth_note:
        result["auth"] = auth_note
    return JSONResponse(result)


@router.get("/api/ping_ai")
async def ping_ai(request: Request):
    """Red / yellow / green health badge for the LLM provider.

    green  = provider reachable AND the key works (GET /models → 200)
    yellow = reachable but the request was rejected (bad key 401,
             rate-limited 429, wrong model, …) — the endpoint is up
    red    = unreachable (DNS / connection error) or no key configured
    """
    cfg = await load_config()
    provider_id = request.query_params.get("provider") or cfg.get("default_provider")
    provider = cfg.get("providers", {}).get(provider_id, {})
    base = (provider.get("base_url") or "").rstrip("/")
    key = provider.get("api_key") or ""
    if not base:
        logger.debug(f"ping_ai: no base_url for provider {provider_id}")
        return JSONResponse({"status": "red", "detail": f"provider '{provider_id}' has no base_url", "code": 0})
    if not key:
        logger.debug(f"ping_ai: no api_key for provider {provider_id}")
        return JSONResponse({"status": "yellow", "detail": f"no api key set for '{provider_id}'", "code": 0})
    try:
        r = await client().get(f"{base}/models", headers={"Authorization": f"Bearer {key}"}, timeout=8)
        if r.status_code == 200:
            logger.debug(f"ping_ai: {provider_id} ok")
            return JSONResponse({"status": "green", "detail": f"{provider_id} ok", "code": 200})
        logger.info(f"ping_ai: {provider_id} degraded status={r.status_code}")
        return JSONResponse({"status": "yellow", "detail": f"{provider_id} {r.status_code}: {r.text[:120]}", "code": r.status_code})
    except httpx.HTTPError as e:
        logger.warning(f"ping_ai: {provider_id} unreachable err={e}")
        return JSONResponse({"status": "red", "detail": str(e)[:200], "code": 0})


@router.post("/api/models")
async def models(request: Request):
    """Fetch the live model list from a provider's /models endpoint."""
    body = await _json_body(request)
    base = (body.get("base_url") or "").rstrip("/")
    key = body.get("api_key") or ""
    if not base or not key:
        return JSONResponse({"error": "base_url and api_key are required"}, status_code=400)
    try:
        r = await client().get(f"{base}/models", headers={"Authorization": f"Bearer {key}"}, timeout=15)
        if r.status_code != 200:
            return JSONResponse({"error": f"{r.status_code}: {r.text[:300]}"}, status_code=502)
        data = r.json()
        ids = [m.get("id") for m in data.get("data", []) if m.get("id")]
        return JSONResponse({"models": sorted(ids)})
    except httpx.HTTPError as e:
        return JSONResponse({"error": str(e)}, status_code=502)


@router.post("/api/chat")
async def chat(request: Request):
    cfg = await load_config()
    body = await _json_body(request)

    message = (body.get("message") or "").strip()
    if not message:
        logger.warning("/api/chat: empty message rejected")
        return JSONResponse({"error": "empty message"}, status_code=400)

    zcfg = resolve_zeus_config(cfg)
    zeus_url = (zcfg.get("url") or "").rstrip("/")
    zeus_connection = zcfg.get("name") or cfg.get("default_zeus_connection") or ""
    if not zeus_url:
        logger.error("/api/chat: no zeus.url on default connection")
        return JSONResponse(
            {"error": "no Zeus URL configured on the default connection (edit Settings)"},
            status_code=400,
        )

    # Provider resolution: request may override the configured default.
    provider_id = body.get("provider") or cfg.get("default_provider")
    provider = cfg.get("providers", {}).get(provider_id, {})
    base_url = (provider.get("base_url") or "").rstrip("/")
    api_key = provider.get("api_key") or ""
    if not api_key:
        logger.error(f"/api/chat: no api_key for provider {provider_id}")
        return JSONResponse({"error": f"provider '{provider_id}' has no api_key set (edit Settings)"}, status_code=400)
    model = body.get("model") or (provider.get("models") or ["gpt-4o"])[0]

    api_version = normalize_api_version(body.get("api_version") or cfg.get("default_api_version", "v2"))
    mode = body.get("mode") or cfg.get("default_mode", "analytics")

    sample = body.get("sample") or cfg.get("default_sample", "beer-sample")
    triple = cfg.get("samples", {}).get(sample, {})
    bucket = body.get("bucket") or triple.get("bucket", sample)
    scope = body.get("scope") or triple.get("scope", "_default")
    collection = body.get("collection") or triple.get("collection", "_default")

    chat_id = body.get("chat_id") or ("chat_" + uuid.uuid4().hex[:12])
    optimized = body.get("optimized", True)  # TOON tool results by default

    logger.info(
        f"/api/chat: START chat_id={chat_id} msg_preview={message[:60]}… mode={mode} "
        f"api={api_version} sample={sample} provider={provider_id} optimized={optimized} "
        f"zeus_connection={zeus_connection} zeus_url={zeus_url} "
        f"has_prior_in_state={chat_id in CHATS}"
    )

    # Serialise turns WITHIN this chat so a double-submit can't interleave
    # two agent loops over the same history; OTHER chats run concurrently
    # (each awaits the loop without holding a global lock). The slow agent
    # loop runs inside the per-chat lock but off the event loop's critical
    # path — other requests keep flowing while it awaits the LLM.
    lock = await chat_lock(chat_id)
    async with lock:
        if chat_id not in CHATS:
            CHATS[chat_id] = {"title": message[:48], "created": time.time(), "turns": [], "traces": []}
        prior_turns = CHATS[chat_id]["turns"]

        # Resolve any prior durable session binding (persisted in CHATS + jsonl
        # so a restarted worker or different process can resume the same sid).
        prior_sid = CHATS[chat_id].get("zeus_session_id", "") or ""
        prior_round = int(CHATS[chat_id].get("zeus_round", 0) or 0)
        logger.debug(f"/api/chat: prior state for {chat_id} turns={len(prior_turns)} zeus_sid={(prior_sid or '')[:12]}… zeus_round={prior_round}")

        try:
            answer, trace, new_turns, session_meta = await run_agent(
                zeus_url, zcfg, base_url, api_key, model, api_version, mode,
                bucket, scope, collection, message, prior_turns,
                optimized=optimized, provider_id=provider_id, conv_id=chat_id,
                zeus_session_id=prior_sid, zeus_round=prior_round)
        except RuntimeError as e:
            logger.exception(f"/api/chat: run_agent RuntimeError for {chat_id}")
            return JSONResponse({"error": str(e), "chat_id": chat_id}, status_code=400)
        except httpx.HTTPError as e:
            logger.exception(f"/api/chat: run_agent HTTPError for {chat_id}")
            return JSONResponse({"error": f"network error: {e}", "chat_id": chat_id}, status_code=502)

        CHATS[chat_id]["turns"] = new_turns
        # Persist durable session binding so history replay + future turns
        # on this chat_id continue the *same* Couchbase session (any middleman
        # worker can pick it up via rehydrate).
        if session_meta.get("session_id"):
            CHATS[chat_id]["zeus_session_id"] = session_meta["session_id"]
            CHATS[chat_id]["zeus_round"] = session_meta.get("round") or prior_round
            CHATS[chat_id]["contract_id"] = session_meta.get("contract_id") or ""
            CHATS[chat_id]["contract_hash"] = session_meta.get("contract_hash") or ""
            CHATS[chat_id]["contract_status"] = session_meta.get("contract_status") or trace.get("session", {}).get("contract_status")
            logger.debug(f"/api/chat: updated chat state with zeus_session for {chat_id}")
        CHATS[chat_id].setdefault("traces", []).append({
            "question": message,
            "answer": answer,
            "target": f"{bucket}/{scope}/{collection}",
            "mode": mode,
            "api_version": api_version,
            "model": model,
            "provider": provider_id,
            "trace": trace,
            "created": time.time(),
            "session_id": session_meta.get("session_id") or prior_sid,
            "session_round": session_meta.get("round") or prior_round,
            "contract_status": session_meta.get("contract_status"),
        })
        await persist_chat(chat_id)
        logger.debug(f"/api/chat: persisted chat {chat_id} (now {len(CHATS[chat_id].get('traces', []))} traces)")

    logger.info(f"/api/chat: RETURN chat_id={chat_id} answer_len={len(answer or '')} contract_status={session_meta.get('contract_status')}")
    return JSONResponse({
        "chat_id": chat_id, "answer": answer, "trace": trace,
        "target": f"{bucket}/{scope}/{collection}",
        "api_version": api_version, "mode": mode, "model": model, "provider": provider_id,
        "zeus_connection": zeus_connection,
        "zeus_url": zeus_url,
        "session_id": session_meta.get("session_id") or prior_sid,
        "session_round": session_meta.get("round") or prior_round,
        "contract_status": session_meta.get("contract_status"),
    })


@router.get("/api/test-cases")
async def get_test_cases():
    """Return sanitized test cases from config.json (key: test_cases)."""
    cfg = await load_config()
    raw = cfg.get("test_cases") or []
    if not isinstance(raw, list):
        raw = []
    cases = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        name = (item.get("name") or "").strip()
        description = (item.get("description") or "").strip()
        prompts = item.get("prompts")
        if not name or not description or not isinstance(prompts, list):
            continue
        cleaned = [str(p).strip() for p in prompts if str(p).strip()]
        if not cleaned:
            continue
        cases.append({"name": name, "description": description, "prompts": cleaned})
    return JSONResponse({"test_cases": cases})


@router.get("/api/tool-order")
async def tool_order():
    """X-axis tool/verb order for the trace frequency chart."""
    return JSONResponse(build_tool_order())


@router.get("/api/history")
async def history():
    out = []
    for cid, c in sorted(CHATS.items(), key=lambda kv: -kv[1]["created"]):
        metrics = summarize_chat_metrics(c)
        out.append({
            "chat_id": cid,
            "title": c["title"],
            "created": c["created"],
            "turns": len([t for t in c.get("turns", []) if t.get("role") == "user"]),
            "traces": len(c.get("traces", [])),
            **metrics,
        })
    return JSONResponse({"chats": out})


@router.get("/api/history/{chat_id}")
async def history_one(chat_id: str):
    c = CHATS.get(chat_id)
    if not c:
        return JSONResponse({"error": "not found"}, status_code=404)
    msgs = [
        {"role": t["role"], "content": t.get("content", "")}
        for t in c.get("turns", [])
        if t.get("role") in ("user", "assistant") and t.get("content")
    ]
    return JSONResponse({"chat_id": chat_id, "title": c["title"], "messages": msgs, "traces": c.get("traces", [])})


@router.post("/api/clear")
async def clear(request: Request):
    body = await _json_body(request)
    chat_id = body.get("chat_id")
    if chat_id and chat_id in CHATS:
        del CHATS[chat_id]
        await asyncio.to_thread(append_chat_event, "delete_chat", chat_id=chat_id)
        return JSONResponse({"ok": True})
    if body.get("all"):
        CHATS.clear()
        await asyncio.to_thread(append_chat_event, "clear_all")
        return JSONResponse({"ok": True, "cleared": "all"})
    return JSONResponse({"ok": False}, status_code=404)
