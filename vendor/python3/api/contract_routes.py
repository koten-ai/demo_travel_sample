"""Contract and catalog API routes."""
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from contract_hash import compute_contract_hash, extract_stamped_hash
from python3.api.util import json_body as _json_body
from python3.config import load_config, resolve_zeus_config
from python3.constants import normalize_api_version
from python3.http_client import client
from python3.logging_setup import logger
from python3.zeus.auth import resolve_zeus_auth
from python3.zeus.catalog import load_chat_request
from python3.zeus.contracts import resolve_contract_for_scope

router = APIRouter()


def _admin_api_base(zeus_url: str, raw_zeus_url: str) -> str:
    """Map public Zeus URL to admin API base (:9091 or trailing-slash host)."""
    if ":8080" in zeus_url:
        return zeus_url.replace(":8080", ":9091")
    if raw_zeus_url.endswith("/"):
        return zeus_url + ":9091"
    return zeus_url


@router.get("/api/chat_request")
async def chat_request(request: Request):
    """Return the chat_request catalog for a mode — the exact
    `messages` + `tools` an LLM client receives. Prefers the live
    catalog from Zeus (with SCOPE BRIEF), falls back to the bundled
    snapshot. Mirrors the admin GUI's AI Catalog page."""
    cfg = await load_config()
    qp = request.query_params
    api_version = normalize_api_version(qp.get("api_version") or cfg.get("default_api_version", "v2"))
    mode = qp.get("mode") or cfg.get("default_mode", "analytics")
    sample = qp.get("sample") or cfg.get("default_sample", "beer-sample")
    triple = cfg.get("samples", {}).get(sample, {})
    bucket = triple.get("bucket", sample)
    scope = triple.get("scope", "_default")

    logger.debug(f"/api/chat_request called: api={api_version} mode={mode} sample={sample}")

    zcfg = resolve_zeus_config(cfg)
    zeus_url = (zcfg.get("url") or "").rstrip("/")
    try:
        zeus_headers, _ = await resolve_zeus_auth(zeus_url, zcfg, bucket, scope)
    except Exception:
        zeus_headers = {}
    try:
        data, source = await load_chat_request(zeus_url, api_version, mode, bucket, scope, zeus_headers)
    except Exception as e:  # noqa: BLE001 — surface any load failure to the UI
        logger.exception("/api/chat_request load failed")
        return JSONResponse({"error": str(e)}, status_code=500)

    # Check if the loaded catalog file itself contains a *real* stamped contract (reject placeholders)
    embedded_h = extract_stamped_hash(data) if isinstance(data, dict) else ""
    has_embedded_contract = bool(embedded_h)
    logger.info(f"/api/chat_request: source={source} has_embedded_contract={has_embedded_contract}")

    # Surface the contract binding (if any) for this scope/mode so the Catalog UI can show/edit it
    z = resolve_zeus_config(cfg) or {}
    scope_key = f"{bucket}/{scope}"
    cid, ch = resolve_contract_for_scope(z, bucket, scope, mode)
    contract_binding = {}
    if cid or ch:
        contract_binding = {"contract_id": cid, "contract_hash": ch}
    return JSONResponse({
        "api_version": api_version,
        "mode": mode,
        "source": source,
        "data": data,
        "contract": contract_binding,
        "scope": scope_key
    })


@router.post("/api/publish_contract")
async def publish_contract(request: Request):
    """Proxy for publishing a contract from the middle-man Catalog UI.
    Requires admin rights on the Zeus side (the auth in zeus.* config must
    be sufficient for /admin/api/contracts, e.g. a basic user that is admin,
    or a bearer with admin scope).
    Body: {contract_id, mode, scope: "bucket/scope", api_version: "v2"}
    Returns the publish response (including the computed hash on success).
    """
    body = await _json_body(request)
    cid = (body.get("contract_id") or "").strip()
    api_ver = (body.get("api_version") or "").lower()
    logger.info(f"/api/publish_contract called: contract_id={cid} api={api_ver}")
    if api_ver != "v2":
        return JSONResponse({"error": "Contracts are V2-only. V2 requires the exact same catalog builder for the LLM-visible chat_request and the MASQ/Hot Path execution engine. V1 has no such contract enforcement."}, status_code=400)
    if not cid:
        return JSONResponse({"error": "contract_id is required"}, status_code=400)
    cfg = await load_config()
    zcfg = resolve_zeus_config(cfg) or {}
    raw_zeus_url = (zcfg.get("url") or "")
    zeus_url = raw_zeus_url.rstrip("/")
    if not zeus_url:
        return JSONResponse({"error": "no zeus.url configured"}, status_code=400)

    admin_base = _admin_api_base(zeus_url, raw_zeus_url)

    try:
        # Use the same auth resolver (basic often works for admin if the user has rights)
        # Scope is optional for auth resolution here.
        scope_for_auth = body.get("scope") or ""
        b, s = (scope_for_auth.split("/", 1) + ["_default"])[:2] if "/" in scope_for_auth else ("", "")
        zeus_headers, auth_note = await resolve_zeus_auth(zeus_url, zcfg, b, s)
    except Exception as e:
        zeus_headers = {}
        auth_note = f"auth failed: {e}"

    # If the caller (Catalog Load or Workbench) provided the exact loaded catalog,
    # forward it as "payload" so the published record on Zeus is byte-for-byte
    # what this middle-man will send on /v1/session. This enforces the "same builder"
    # invariant required for contract_status=match.
    #
    # CRITICAL PAIN POINT (documented in READMEs):
    # If you ever let the Go server rebuild the catalog here instead of
    # sending the exact object that load_chat_request just produced,
    # the stored hash will diverge from what the middle-man later computes
    # and sends.  Always send the live loaded data as "payload".
    publish_body = {
        "contract_id": cid,
        "mode": body.get("mode") or cfg.get("default_mode", "analytics"),
        "scope": body.get("scope") or "",
        "api_version": body.get("api_version") or cfg.get("default_api_version", "v2"),
    }
    if "payload" in body and body["payload"]:
        publish_body["payload"] = body["payload"]

    # Try the clean 5TH /contract alias first (if the server exposes it per the 5TH MASTER),
    # then the legacy base /admin/api/contracts route. This keeps us working across the transition.
    tried_urls = [f"{admin_base}/admin/api/contracts/contract", f"{admin_base}/admin/api/contracts"]
    resp = None
    last_err = None
    for admin_url in tried_urls:
        try:
            logger.debug(f"trying publish to {admin_url}")
            r = await client().post(
                admin_url,
                headers={**zeus_headers, "Content-Type": "application/json"},
                json=publish_body,
                timeout=30,
            )
            logger.debug(f"publish response from {admin_url}: status={r.status_code}")
            if r.status_code < 400:
                resp = r.json() if r.headers.get("content-type", "").startswith("application/json") else {"raw": r.text}
                break
            if r.status_code not in (404, 405):
                # Real error (auth, validation, etc.) — surface it
                return JSONResponse(
                    {"error": f"admin publish failed ({r.status_code})", "detail": r.text[:500], "auth_note": auth_note, "tried": admin_url},
                    status_code=r.status_code
                )
            last_err = f"{r.status_code} on {admin_url}"
        except httpx.HTTPError as e:
            last_err = f"{e} on {admin_url}"
    if resp is None:
        return JSONResponse({"error": f"failed to reach admin publish endpoints", "detail": last_err or "", "auth_note": auth_note}, status_code=502)

    # Surface stamped form if the server (publish or /contract) returned one,
    # so the UI can offer "Copy stamped standardized JSON" after publish too.
    if isinstance(resp, dict):
        stamped = resp.get("stamped_chat_request") or resp.get("stamped") or {}
        h = (
            (stamped.get("contract") or {}).get("hash")
            or stamped.get("_hash") or stamped.get("hash")
            or (resp.get("contract") or {}).get("hash")
            or resp.get("_hash") or resp.get("hash")
        )
        if h:
            resp["effective_contract_hash"] = h
        if isinstance(stamped, dict) and stamped.get("_format"):
            resp["stamped_chat_request"] = stamped
        # Always ensure the UI has a ready-to-save stamped version after Publish,
        # constructed from the *exact* payload we forwarded (the live loaded one at
        # publish time) + the hash the server just assigned. This lets "Save stamped"
        # work immediately after Publish without requiring a separate Verify step,
        # and guarantees the saved file has an embedded hash that matches what was
        # just published for that content. The user then replaces the source file
        # for the catalog entry with this stamped one so future loads see a matching
        # embedded hash (avoids the "embedded != current_content" warning and drift).
        sent_payload = publish_body.get("payload")  # the one we actually sent
        if sent_payload and h and not resp.get("stamped_chat_request"):
            try:
                stamped_constructed = dict(sent_payload)  # shallow ok for this
                cb = stamped_constructed.get("contract") or {}
                if not isinstance(cb, dict):
                    cb = {}
                cb["hash"] = h
                cb["computed_at"] = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z') + "Z"
                if cid and not cb.get("id"):
                    cb["id"] = cid
                stamped_constructed["contract"] = cb
                stamped_constructed["_hash"] = h
                resp["stamped_chat_request"] = stamped_constructed
            except Exception:
                pass
    return JSONResponse(resp)


@router.post("/api/contract_hash")
async def api_contract_hash(request: Request):
    """Legacy shim.

    In the current model you should use the Catalog "Verify with Zeus" button
    (which calls /api/server_contract_hash → real /verify on Zeus with embed).
    That gives you the stamped good chat_request*.json with the authoritative
    hash already inside. Save that file and load it.

    This endpoint is kept only for completely offline use or old scripts.
    """
    body = await _json_body(request)
    payload = body.get("chat_request") or body.get("data") or body
    cfg = await load_config()
    zcfg = resolve_zeus_config(cfg) or {}
    raw_zeus_url = (zcfg.get("url") or "")
    zeus_url = raw_zeus_url.rstrip("/")
    if zeus_url:
        try:
            zeus_headers, _ = await resolve_zeus_auth(zeus_url, zcfg, "", "")
            admin_base = _admin_api_base(zeus_url, raw_zeus_url)
            r = await client().post(
                f"{admin_base}/api/server_contract_hash",
                headers={**zeus_headers, "Content-Type": "application/json"},
                json={"payload": payload, "embed": True},
                timeout=15,
            )
            if r.status_code < 400:
                j = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
                h = j.get("effective_contract_hash") or j.get("hash") or ""
                if h:
                    return JSONResponse({"hash": h, "source": "server (via legacy shim)"})
        except Exception:
            pass
    h = compute_contract_hash(payload)
    return JSONResponse({"hash": h, "source": "local_fallback (offline only — prefer stamped file from Verify)"})


@router.post("/api/server_contract_hash")
async def api_server_contract_hash(request: Request):
    """Proxy to Zeus /admin/api/contracts/hash.

    Pass your loaded chat_request*.json (bare object or {payload: ...} or
    {chat_request: ...}). The server computes the hash using the exact
    same code that will validate /v1/session and that was used at publish.

    If you include "embed": true in the body (or ?embed=1), the response
    will contain "stamped_chat_request" which is the rules with "_hash"
    injected at the top level — save this back into your chat_request*.json
    and the middle-man can just read the hash from the file it loads.

    This is the path to completely remove hash calculation from the
    middle-man codebase.
    """
    body = await _json_body(request)
    logger.debug(f"/api/server_contract_hash called with keys={list(body.keys()) if isinstance(body, dict) else 'non-dict'}")
    cfg = await load_config()
    zcfg = resolve_zeus_config(cfg) or {}
    raw_zeus_url = (zcfg.get("url") or "")
    zeus_url = raw_zeus_url.rstrip("/")
    if not zeus_url:
        logger.error("no zeus.url configured in config")
        return JSONResponse({"error": "no zeus.url configured"}, status_code=500)

    admin_base = _admin_api_base(zeus_url, raw_zeus_url)

    try:
        # Reuse the same auth used for publish/lookup (admin capable)
        zeus_headers = {}
        auth_note = ""
        try:
            zeus_headers, auth_note = await resolve_zeus_auth(zeus_url, zcfg, "", "")
        except Exception as auth_err:
            # Admin hash/verify calls may not always have a scope (e.g. basic auth is per-scope).
            # Proceed with no headers; the downstream Zeus admin call will surface a clear error if auth is required.
            auth_note = f"auth note: {auth_err}"
        # Prefer the new /verify for standardized catalogs (the 5TH contract shape).
        # /verify gives richer stamped response and is the canonical dry-run.
        # Always send as { "payload": <the rules>, "contract_id": ..., "embed": true, ... }
        # so the server extraction (getPayloadForHash) always gets the inner rules the same
        # way as in the publish path. The server will clean metadata ("contract", "contract_id", etc.)
        # before hashing, ensuring verify and publish produce the same hash for the same rules content.
        endpoint = "/admin/api/contracts/verify"
        call_body = {
            "payload": body.get("payload") or body,
            "embed": True,
        }
        if body.get("contract_id"):
            call_body["contract_id"] = body["contract_id"]
        if body.get("mode"):
            call_body["mode"] = body["mode"]
        if body.get("api_version"):
            call_body["api_version"] = body["api_version"]

        logger.debug(f"proxying verify to Zeus admin: {admin_base}{endpoint} (payload_keys={list(call_body.keys()) if isinstance(call_body, dict) else type(call_body)})")
        r = await client().post(
            f"{admin_base}{endpoint}",
            headers={**zeus_headers, "Content-Type": "application/json"},
            json=call_body,
            timeout=30,
        )
        logger.debug(f"Zeus verify response status={r.status_code} content-type={r.headers.get('content-type')}")
        if r.status_code >= 400:
            detail = r.text[:600] if r.text else ""
            logger.warning(f"Zeus verify failed: {r.status_code} {detail[:200]}")
            return JSONResponse(
                {"error": f"zeus hash endpoint failed ({r.status_code})", "detail": detail, "auth_note": auth_note},
                status_code=r.status_code,
            )
        j = r.json() if r.headers.get("content-type", "").startswith("application/json") else {"raw": r.text}
        if auth_note:
            if isinstance(j, dict):
                j["auth_note"] = auth_note
        # Extract stamped hash from whatever the current server returns.
        # Support multiple shapes the 5TH work has used / may still emit:
        #   stamped_chat_request (full), or top-level fields, or contract block inside it.
        if isinstance(j, dict):
            stamped = j.get("stamped_chat_request") or j.get("stamped") or {}
            # Try many locations for the authoritative hash
            h = (
                (stamped.get("contract") or {}).get("hash")
                or stamped.get("_hash")
                or stamped.get("hash")
                or (j.get("contract") or {}).get("hash")
                or j.get("_hash")
                or j.get("hash")
                or j.get("effective_contract_hash")
            )
            if h:
                j["effective_contract_hash"] = h
            # Also surface the best stamped object for "Copy stamped standardized JSON"
            best_stamped = stamped if (isinstance(stamped, dict) and stamped.get("_format")) else (j if j.get("_format") else None)
            if best_stamped:
                j["stamped_chat_request"] = best_stamped
            j.setdefault("note", "")
            j["note"] += " | stamped standardized files: prefer extract_stamped_hash(loaded) or contract.hash/_hash over any local compute. Server (/verify) is the sole hash source."
        return JSONResponse(j)
    except httpx.HTTPError as e:
        return JSONResponse({"error": f"failed to reach zeus admin hash at {admin_base}: {e}"}, status_code=502)


@router.get("/api/contract_status")
async def api_contract_status(request: Request):
    """Lightweight report for the simplified contract model.

    Returns:
    - The contract binding currently recorded in this middle-man's config for the scope/mode.
    - Whether the loaded catalog already carries an embedded stamped hash (good sign — user saved a verified file from Zeus).
    - A note pointing at the Catalog "Verify with Zeus → Save stamped" flow.

    We no longer do heavy client-side vs server drift pre-computation here by default.
    The real contract_status (match/drift/none) is always provided by Zeus on /v1/session and /trace.
    """
    cfg = await load_config()
    qp = request.query_params
    api_version = normalize_api_version(qp.get("api_version") or cfg.get("default_api_version", "v2"))
    mode = qp.get("mode") or cfg.get("default_mode", "analytics")
    sample = qp.get("sample") or cfg.get("default_sample", "beer-sample")
    triple = cfg.get("samples", {}).get(sample, {})
    bucket = triple.get("bucket", sample)
    scope = triple.get("scope", "_default")
    logger.debug(f"/api/contract_status called: api={api_version} mode={mode} sample={sample}")

    zcfg = resolve_zeus_config(cfg) or {}
    zeus_url = (zcfg.get("url") or "").rstrip("/")

    # Current load (to see if it already has a stamped hash inside)
    try:
        zeus_headers, _ = await resolve_zeus_auth(zeus_url, zcfg, bucket, scope)
    except Exception:
        zeus_headers = {}
    try:
        data, source = await load_chat_request(zeus_url, api_version, mode, bucket, scope, zeus_headers)
    except Exception as e:
        logger.exception("/api/contract_status load failed")
        return JSONResponse({"error": f"failed to load current chat_request: {e}"}, status_code=500)

    embedded_hash = extract_stamped_hash(data)
    is_std = bool(data and (data.get("_format") or (data.get("instructions") and data.get("masq"))))
    # embedded_hash is already cleaned (TO_BE_FILLED rejected) by the helper

    # Bound from this middle-man's config
    cid, ch = resolve_contract_for_scope(zcfg, bucket, scope, mode)
    logger.debug(f"/api/contract_status: embedded_hash?={bool(embedded_hash)} is_std={is_std} bound_cid={cid}")

    return JSONResponse({
        "scope": f"{bucket}/{scope}",
        "mode": mode,
        "api_version": api_version,
        "source": source,
        "is_standardized": is_std,
        "has_embedded_stamped_hash": bool(embedded_hash),
        "embedded_hash": embedded_hash or None,
        "bound": {"contract_id": cid, "contract_hash": ch} if (cid or ch) else None,
        "note": "Use Catalog → Verify with Zeus → Save the stamped good chat_request*.json. The server is the sole source of the hash. Real contract_status comes from Zeus on session/trace."
    })


