"""Build a process-scoped ZeusRuntime from TravelPlan's nested config.json."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Mapping
from urllib.parse import urlparse

from zeus_client import ClientSettings, DataTarget, ZeusRuntime
from zeus_client.adapters.catalog_fs.store import FsCatalogStore
from zeus_client.adapters.llm_openai_compatible import OpenAICompatibleLlmClient
from zeus_client.adapters.zeus_http import HttpxZeusPort
from zeus_client.adapters.zeus_http.catalog_remote import HttpxCatalogRemote
from zeus_client.config.loader import _parse_semantic_cache
from zeus_client.config.models import (
    DebugPolicy,
    LlmProviderConfig,
    RuntimeConfig,
    ZeusEndpointConfig,
)

from travel_planner.paths import PROJECT_ROOT

REQUIRED_CLIENT_VERSION_PREFIX = "2.4"

logger = logging.getLogger("travel_planner")


def require_client_version() -> str:
    """Fail closed unless kotenai-zeus-client is the 2.4.x family this BFF targets."""
    import zeus_client
    from zeus_client.domain import layer_a

    ver = str(getattr(zeus_client, "__version__", "") or "")
    if not ver.startswith(REQUIRED_CLIENT_VERSION_PREFIX):
        raise RuntimeError(
            "kotenai-zeus-client "
            f"{REQUIRED_CLIENT_VERSION_PREFIX}.x required; found {ver or 'unknown'}"
        )
    if not hasattr(layer_a, "parse_pipeline_envelope"):
        raise RuntimeError(
            "kotenai-zeus-client 2.4.x with pipeline envelope recovery required; "
            "rebuild so the image installs sibling ../zeus_client_python"
        )
    return ver


def _as_bool(value: Any, default: bool) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


@dataclass
class OverlaySecretStore:
    """Env names first; overlay holds inline secrets from config.json (never logged)."""

    overlay: Mapping[str, str] = field(default_factory=dict)
    environ: Mapping[str, str] = field(default_factory=lambda: os.environ)

    def get(self, name: str) -> str | None:
        if not name:
            return None
        val = self.overlay.get(name)
        if val is not None and val != "":
            return val
        env_val = self.environ.get(name)
        if env_val is None or env_val == "":
            return None
        return env_val

    def __repr__(self) -> str:
        return f"OverlaySecretStore(overlay_keys={len(self.overlay)})"


def config_path() -> Path:
    root = Path(os.environ.get("ZEUS_CLIENT_CONFIG_DIR", str(PROJECT_ROOT)))
    return root / "config.json"


def load_app_config_dict() -> dict[str, Any]:
    """Raw config.json mapping (samples, llm_provider, chat_requests_sync, …)."""
    path = config_path()
    if not path.is_file():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return data if isinstance(data, dict) else {}


def _auth_mode(zcfg: Mapping[str, Any]) -> str:
    mode = str(zcfg.get("auth_mode") or "none").lower()
    if mode in ("none", "basic", "bearer", "session", "certificate"):
        return mode
    return "none"


def _provider_id(provider: Mapping[str, Any]) -> str:
    label = str(provider.get("label") or provider.get("id") or provider.get("provider") or "").strip().lower()
    if label:
        return label.split()[0]
    host = urlparse(str(provider.get("base_url") or "")).netloc
    return host.split(".")[0] if host else "default"


def sample_triple(cfg: Mapping[str, Any] | None = None) -> tuple[str, str, str]:
    """Resolve (bucket, scope, collection) from samples[default_sample] or target."""
    raw = dict(cfg or load_app_config_dict())
    target = raw.get("target") if isinstance(raw.get("target"), dict) else {}
    if target.get("bucket"):
        return (
            str(target.get("bucket") or "travel-sample"),
            str(target.get("scope") or "_default"),
            str(target.get("collection") or "_default"),
        )
    sample_name = str(raw.get("default_sample") or "").strip()
    samples = raw.get("samples") if isinstance(raw.get("samples"), dict) else {}
    triple = samples.get(sample_name) if sample_name else None
    if not isinstance(triple, dict) and samples:
        first = next(iter(samples.values()), None)
        if isinstance(first, dict) and ("bucket" in first or "scope" in first):
            triple = first
        elif sample_name and isinstance(samples.get("bucket"), str):
            triple = samples
    if not isinstance(triple, dict):
        triple = {}
    bucket = str(triple.get("bucket") or sample_name or "travel-sample")
    scope = str(triple.get("scope") or "_default")
    collection = str(triple.get("collection") or "_default")
    return bucket, scope, collection


def _rewrite_loopback_host(url: str) -> str:
    raw = (url or "").rstrip("/")
    if "host.docker.internal" not in raw:
        return raw
    if os.path.exists("/.dockerenv"):
        return raw
    return raw.replace("host.docker.internal", "127.0.0.1")


def _scope_env_name(scope_key: str) -> str:
    slug = scope_key.replace("/", "_").replace("-", "_").upper()
    return f"ZEUS_SCOPE_PASSWORD_{slug}"


def _llm_block(cfg: Mapping[str, Any]) -> dict[str, Any]:
    if isinstance(cfg.get("llm_provider"), dict):
        return dict(cfg["llm_provider"])
    if isinstance(cfg.get("llm"), dict):
        return dict(cfg["llm"])
    return {}


def _api_key_env(provider: Mapping[str, Any], provider_id: str) -> str:
    named = str(provider.get("api_key_env") or "").strip()
    if named:
        return named
    if provider_id in ("grok", "xai", "x"):
        return "XAI_API_KEY"
    return "ZEUS_CLIENT_LLM_API_KEY"


def build_runtime_config(
    *,
    raw: Mapping[str, Any] | None = None,
    profile: str = "development",
) -> RuntimeConfig:
    """Map nested travel samples/llm_provider/zeus → RuntimeConfig."""
    cfg = dict(raw or load_app_config_dict())
    zcfg: dict[str, Any] = dict(cfg["zeus"]) if isinstance(cfg.get("zeus"), dict) else {}
    provider = _llm_block(cfg)
    settings_raw = dict(cfg["settings"]) if isinstance(cfg.get("settings"), dict) else {}

    url = _rewrite_loopback_host(
        str(os.environ.get("ZEUS_URL") or zcfg.get("url") or "http://127.0.0.1:8080")
    )
    auth_mode = _auth_mode(zcfg)
    password_env = zcfg.get("password_env") or (
        "ZEUS_PASSWORD" if auth_mode == "basic" else None
    )
    token_env = zcfg.get("token_env")
    if not token_env:
        if auth_mode == "bearer":
            token_env = "ZEUS_BEARER_TOKEN"
        elif auth_mode == "session":
            token_env = "ZEUS_SESSION_ID"

    bucket, scope, collection = sample_triple(cfg)
    mode = str(
        settings_raw.get("mode")
        or cfg.get("default_mode")
        or "travel_booking"
    )
    provider_id = str(provider.get("provider") or _provider_id(provider))
    models = provider.get("models") if isinstance(provider.get("models"), list) else []
    model = str(provider.get("model") or (models[0] if models else "grok-4-1-fast-non-reasoning"))
    api_key_env = _api_key_env(provider, provider_id)

    default_chat = str(PROJECT_ROOT / "data" / "chat_requests")
    chat_dir = (
        str(cfg.get("chat_requests_dir") or "")
        or os.environ.get("ZEUS_CHAT_REQUESTS_DIR")
        or os.environ.get("ZEUS_CLIENT_CHAT_REQUESTS_DIR")
        or default_chat
    )

    durable = _as_bool(
        settings_raw.get("durable_sessions")
        if "durable_sessions" in settings_raw
        else zcfg.get("enable_durable_sessions", True),
        True,
    )
    # Product-cheap default (2.2.0+ / HOW_TO_USE / API_SESSION). Hub insight = set true.
    ai_flag = (
        _as_bool(settings_raw.get("ai_process_result"), False)
        if "ai_process_result" in settings_raw
        else False
    )
    max_rounds = int(settings_raw.get("max_rounds") or 12)
    ignore_hints = (
        _as_bool(settings_raw.get("ignore_user_tool_path_hints"), True)
        if "ignore_user_tool_path_hints" in settings_raw
        else True
    )
    session_raw = dict(cfg["session"]) if isinstance(cfg.get("session"), dict) else {}
    semantic_cache = _parse_semantic_cache(session_raw.get("semantic_cache"))
    tls_verify = _as_bool(zcfg.get("tls_verify", zcfg.get("verify_tls", True)), True)

    scope_creds: dict[str, dict[str, str]] = {}
    raw_creds = zcfg.get("scope_credentials") if isinstance(zcfg.get("scope_credentials"), dict) else {}
    for key, cred in raw_creds.items():
        if not isinstance(cred, dict):
            continue
        pwd_env = str(cred.get("password_env") or _scope_env_name(str(key)))
        entry: dict[str, str] = {"password_env": pwd_env}
        if cred.get("username"):
            entry["username"] = str(cred["username"])
        scope_creds[str(key)] = entry

    scope_contracts = {}
    if isinstance(cfg.get("scope_contracts"), dict):
        scope_contracts = dict(cfg["scope_contracts"])
    elif isinstance(zcfg.get("scope_contracts"), dict):
        scope_contracts = dict(zcfg["scope_contracts"])

    # Zeus 0.7.x is pinned to chat_request base-6.1; floor-5 fails closed and
    # AgentAPI.run_turn then silently runs with no catalog / no Zeus verbs.
    client_floor = str(
        os.environ.get("ZEUS_CLIENT_FLOOR")
        or cfg.get("client_floor")
        or "client-floor-6.1"
    )
    allow_degraded = _as_bool(cfg.get("allow_degraded_catalog"), False)

    return RuntimeConfig(
        profile=profile or str(cfg.get("profile") or "development"),
        zeus=ZeusEndpointConfig(
            url=url,
            auth_mode=auth_mode,  # type: ignore[arg-type]
            username=(zcfg.get("username") or None) or None,
            password_env=password_env,
            token_env=token_env,
            timeout_s=float(zcfg.get("timeout_s") or 30.0),
            tls_verify=tls_verify,
            scope_credentials=scope_creds,
        ),
        target=DataTarget(bucket=bucket, scope=scope, collection=collection),
        llm=LlmProviderConfig(
            provider=provider_id,
            base_url=_rewrite_loopback_host(
                str(provider.get("base_url") or "https://api.x.ai/v1")
            ),
            model=model,
            api_key_env=api_key_env,
            timeout_s=float(provider.get("timeout_s") or 120.0),
        ),
        settings=ClientSettings(
            mode=mode,
            durable_sessions=durable,
            ai_process_result=ai_flag,
            max_rounds=max_rounds,
            ignore_user_tool_path_hints=ignore_hints,
        ),
        debug=DebugPolicy(detective_briefing=True),
        chat_requests_dir=str(chat_dir),
        client_floor=client_floor,
        allow_degraded_catalog=allow_degraded,
        scope_contracts=scope_contracts,
        semantic_cache=semantic_cache,
    )


def secret_overlay_from_config(raw: Mapping[str, Any] | None = None) -> dict[str, str]:
    """Map inline config secrets onto env-name keys for OverlaySecretStore."""
    cfg = dict(raw or load_app_config_dict())
    zcfg: dict[str, Any] = dict(cfg["zeus"]) if isinstance(cfg.get("zeus"), dict) else {}
    provider = _llm_block(cfg)
    overlay: dict[str, str] = {}

    auth_mode = _auth_mode(zcfg)
    password_env = str(zcfg.get("password_env") or "ZEUS_PASSWORD")
    if auth_mode == "basic" and zcfg.get("password"):
        overlay[password_env] = str(zcfg["password"])

    raw_creds = zcfg.get("scope_credentials") if isinstance(zcfg.get("scope_credentials"), dict) else {}
    for key, cred in raw_creds.items():
        if not isinstance(cred, dict) or not cred.get("password"):
            continue
        pwd_env = str(cred.get("password_env") or _scope_env_name(str(key)))
        overlay[pwd_env] = str(cred["password"])
        if auth_mode == "basic" and not overlay.get(password_env):
            overlay[password_env] = str(cred["password"])

    if auth_mode == "bearer" and zcfg.get("bearer_token"):
        overlay[str(zcfg.get("token_env") or "ZEUS_BEARER_TOKEN")] = str(zcfg["bearer_token"])
    if auth_mode == "session" and zcfg.get("session_id"):
        overlay[str(zcfg.get("token_env") or "ZEUS_SESSION_ID")] = str(zcfg["session_id"])

    provider_id = str(provider.get("provider") or _provider_id(provider))
    api_key_env = _api_key_env(provider, provider_id)
    if provider.get("api_key"):
        overlay[api_key_env] = str(provider["api_key"])
    return overlay


def build_runtime(
    *,
    raw: Mapping[str, Any] | None = None,
    profile: str | None = None,
) -> ZeusRuntime:
    """Construct ZeusRuntime with Zeus + LLM + catalog ports (no process globals)."""
    require_client_version()
    cfg_raw = dict(raw or load_app_config_dict())
    prof = profile or str(cfg_raw.get("profile") or "development")
    cfg = build_runtime_config(raw=cfg_raw, profile=prof)
    overlay = secret_overlay_from_config(cfg_raw)
    secrets = OverlaySecretStore(overlay=overlay)
    chat_dir = cfg.chat_requests_dir or str(PROJECT_ROOT / "data" / "chat_requests")
    catalog = FsCatalogStore(root=str(chat_dir))
    rt = ZeusRuntime(cfg, secrets=secrets, catalog=catalog)
    zeus = HttpxZeusPort(endpoint=rt.config.zeus, secrets=secrets, journal=rt.journal)
    llm = OpenAICompatibleLlmClient(
        config=rt.config.llm,
        secrets=secrets,
        journal=rt.journal,
    )
    remote = HttpxCatalogRemote(endpoint=rt.config.zeus, secrets=secrets)
    rt.services.zeus = zeus
    rt.services.llm = llm
    rt.services.catalog = catalog
    rt.services.catalog_remote = remote
    return rt
