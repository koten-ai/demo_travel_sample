"""Setup wizard completeness checks."""
import re
from pathlib import Path

from python3.config import resolve_zeus_config
from python3.constants import CHAT_REQ_DIR
from python3.zeus.catalog import list_chat_requests

_BUCKET_NAME_RE = re.compile(r"^[a-zA-Z0-9._-]+$")


def sanitize_bucket_name(name: str) -> str | None:
    base = (name or "").strip()
    if not base or not _BUCKET_NAME_RE.match(base):
        return None
    return base


def sanitize_scope_name(name: str) -> str | None:
    return sanitize_bucket_name(name)


def catalog_dir_name(bucket: str, scope: str) -> str | None:
    b = sanitize_bucket_name(bucket)
    s = sanitize_scope_name(scope)
    if not b or not s:
        return None
    return f"{b}_{s}"


def _safe_catalog_dir(dir_name: str) -> Path | None:
    d = sanitize_bucket_name(dir_name)
    if not d:
        return None
    return CHAT_REQ_DIR / "V2" / d


# Backward-compatible alias.
_safe_bucket_dir = _safe_catalog_dir


def count_bucket_catalogs(bucket: str) -> int:
    d = _safe_catalog_dir(bucket)
    if not d or not d.is_dir():
        return 0
    return len(list(d.glob("*.json")))


# Backward-compatible alias for callers still using the old name.
count_batch_catalogs = count_bucket_catalogs


def default_catalog_bucket(cfg: dict) -> str:
    sample = cfg.get("default_sample", "beer-sample")
    triple = cfg.get("samples", {}).get(sample, {})
    return triple.get("bucket", sample)


def default_catalog_scope(cfg: dict) -> str:
    sample = cfg.get("default_sample", "beer-sample")
    triple = cfg.get("samples", {}).get(sample, {})
    return triple.get("scope", "_default")


def resolve_catalog_bucket(cfg: dict) -> str:
    return (cfg.get("catalog_bucket") or cfg.get("catalog_batch_hash") or "").strip()


def resolve_catalog_dir(
    bucket: str | None,
    cfg: dict | None = None,
    *,
    scope: str | None = None,
) -> tuple[str, Path]:
    raw = (bucket or "").strip()
    if raw:
        candidate = sanitize_bucket_name(raw)
        if not candidate:
            raise ValueError("valid bucket name is required")
        dest = CHAT_REQ_DIR / "V2" / candidate
        if dest.is_dir() and not scope:
            return candidate, dest
        zeus_bucket = candidate
        resolved_scope = sanitize_scope_name((scope or "").strip()) if scope else None
        if not resolved_scope and cfg:
            resolved_scope = sanitize_scope_name(default_catalog_scope(cfg))
        if not resolved_scope:
            raise ValueError("valid scope name is required")
        dir_name = catalog_dir_name(zeus_bucket, resolved_scope)
        if not dir_name:
            raise ValueError("valid bucket and scope names are required")
    elif cfg:
        zeus_bucket = sanitize_bucket_name(default_catalog_bucket(cfg))
        resolved_scope = sanitize_scope_name(default_catalog_scope(cfg))
        dir_name = catalog_dir_name(zeus_bucket, resolved_scope) if zeus_bucket and resolved_scope else None
        if not dir_name:
            raise ValueError("valid bucket name is required")
    else:
        raise ValueError("valid bucket name is required")
    dest = CHAT_REQ_DIR / "V2" / dir_name
    dest.mkdir(parents=True, exist_ok=True)
    return dir_name, dest


def _zeus_auth_complete(entry: dict) -> list[str]:
    issues = []
    mode = (entry.get("auth_mode") or "none").strip().lower()
    if mode == "bearer" and not (entry.get("bearer_token") or "").strip():
        issues.append("bearer_token is required for bearer auth")
    elif mode == "session" and not (entry.get("session_id") or "").strip():
        issues.append("session_id is required for session auth")
    elif mode == "basic":
        user = (entry.get("username") or "").strip()
        pwd = (entry.get("password") or "").strip()
        if user and pwd:
            return issues
        scope_creds = entry.get("scope_credentials") or {}
        has_scope = any(
            (c.get("username") or "").strip() and (c.get("password") or "").strip()
            for c in scope_creds.values()
            if isinstance(c, dict)
        )
        if not has_scope:
            issues.append("username/password required for basic auth")
    return issues


def _provider_complete(cfg: dict, provider_id: str) -> list[str]:
    issues = []
    provider = (cfg.get("providers") or {}).get(provider_id) or {}
    if not (provider.get("base_url") or "").strip():
        issues.append(f"provider '{provider_id}' has no base_url")
    if not (provider.get("api_key") or "").strip():
        issues.append(f"provider '{provider_id}' has no api_key")
    return issues


def evaluate_catalog_status(cfg: dict) -> dict:
    issues = []
    downloaded = bool(cfg.get("setup_chat_requests_downloaded"))
    if not downloaded:
        issues.append(
            "chat requests not downloaded (complete the Catalog step in setup wizard)",
        )

    catalog_bucket = resolve_catalog_bucket(cfg)
    count = 0
    if catalog_bucket:
        count = count_bucket_catalogs(catalog_bucket)
        if count < 1:
            issues.append(f"no catalogs in V2/{catalog_bucket}/")
    else:
        entries = list_chat_requests()
        count = len(entries)
        if count < 1:
            issues.append("no V2 chat_request catalogs found")

    return {
        "ok": len(issues) == 0,
        "count": count,
        "bucket": catalog_bucket,
        "batch_hash": catalog_bucket,
        "downloaded": downloaded,
        "issues": issues,
    }


def evaluate_zeus_status(cfg: dict) -> dict:
    issues = []
    connections = cfg.get("zeus_connections")
    if not isinstance(connections, list) or not connections:
        return {"ok": False, "issues": ["no zeus_connections configured"]}

    entry = resolve_zeus_config(cfg)
    if not (entry.get("url") or "").strip():
        issues.append("default Zeus connection has no url")

    issues.extend(_zeus_auth_complete(entry))

    if not cfg.get("setup_zeus_verified"):
        issues.append("Zeus connection not verified (run Test Connection in setup wizard)")

    return {"ok": len(issues) == 0, "issues": issues}


def evaluate_provider_status(cfg: dict) -> dict:
    issues = []
    pool = [p for p in (cfg.get("provider_pool") or []) if p in (cfg.get("providers") or {})]
    if not pool:
        issues.append("provider_pool is empty")

    default_id = (cfg.get("default_provider") or "").strip()
    if not default_id:
        issues.append("default_provider is not set")
    elif default_id not in pool:
        issues.append(f"default_provider '{default_id}' is not in provider_pool")

    if default_id:
        issues.extend(_provider_complete(cfg, default_id))

    if not cfg.get("setup_provider_verified"):
        issues.append("LLM provider not verified (run Verify Credentials in setup wizard)")

    return {"ok": len(issues) == 0, "issues": issues}


def evaluate_setup_status(cfg: dict) -> dict:
    catalogs = evaluate_catalog_status(cfg)
    zeus = evaluate_zeus_status(cfg)
    providers = evaluate_provider_status(cfg)
    complete = catalogs["ok"] and zeus["ok"] and providers["ok"]
    return {
        "complete": complete,
        "catalogs": catalogs,
        "zeus": zeus,
        "providers": providers,
    }