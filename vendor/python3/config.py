"""config.json load/save."""
import asyncio
import json
import os

from python3.constants import CONFIG_PATH, EXAMPLE_CONFIG_PATH

_ZEUS_CONNECTION_FIELDS = (
    "id",
    "name",
    "url",
    "auth_mode",
    "username",
    "password",
    "bearer_token",
    "session_id",
    "proxy_auth",
    "proxy_auth_username",
    "proxy_auth_password",
    "notes",
    "scope_contracts",
    "scope_credentials",
    "enable_durable_sessions",
    "contract_id",
    "contract_hash",
)


def _legacy_zeus_to_connection(legacy: dict) -> dict:
    entry = {k: legacy[k] for k in _ZEUS_CONNECTION_FIELDS if k in legacy}
    entry.setdefault("name", "default")
    entry.setdefault("id", "zeus_default")
    if "url" not in entry:
        entry["url"] = legacy.get("url", "")
    if "auth_mode" not in entry:
        entry["auth_mode"] = legacy.get("auth_mode", "none")
    return entry


def normalize_config(cfg: dict) -> dict:
    """Migrate legacy ``zeus`` to ``zeus_connections`` and remove ``zeus``."""
    legacy = cfg.pop("zeus", None)
    connections = cfg.get("zeus_connections")

    if legacy and (not isinstance(connections, list) or not connections):
        entry = _legacy_zeus_to_connection(legacy)
        cfg["zeus_connections"] = [entry]
        cfg.setdefault("default_zeus_connection", entry["name"])

    cfg.pop("zeus", None)
    return cfg


def resolve_zeus_config(cfg: dict, connection_name: str | None = None) -> dict:
    """Return the active Zeus connection entry for API handlers.

    Resolution order: explicit ``connection_name`` → ``default_zeus_connection``
    → first entry in ``zeus_connections``.
    """
    connections = cfg.get("zeus_connections")
    if not isinstance(connections, list) or not connections:
        return {}

    name = (connection_name or cfg.get("default_zeus_connection") or "").strip()
    entry = None
    if name:
        entry = next((c for c in connections if c.get("name") == name), None)
    if entry is None:
        entry = connections[0]

    resolved = dict(entry)
    resolved.setdefault("name", entry.get("name") or name or "default")

    # Runtime override for Docker — never persist back to config.json.
    zeus_url_env = (os.environ.get("ZEUS_URL") or "").strip()
    if zeus_url_env:
        default_name = (cfg.get("default_zeus_connection") or "").strip()
        default_entry = next(
            (c for c in connections if c.get("name") == default_name),
            connections[0],
        )
        if default_entry and default_entry.get("name") == resolved.get("name"):
            resolved["url"] = zeus_url_env

    return resolved


def _load_config_sync():
    """Read config.json, auto-creating it from config.example.json on
    first run. ZEUS_URL is applied at resolve time (see resolve_zeus_config).

    This touches the disk, so route handlers call it through
    `asyncio.to_thread` to keep the event loop unblocked."""
    if not CONFIG_PATH.exists() and EXAMPLE_CONFIG_PATH.exists():
        CONFIG_PATH.write_text(EXAMPLE_CONFIG_PATH.read_text())
    with open(CONFIG_PATH) as f:
        try:
            cfg = json.load(f)
        except json.JSONDecodeError as e:
            raise RuntimeError(
                f"config.json is not valid JSON at line {e.lineno} column {e.colno} (char {e.pos}). "
                f"Common cause: // style comments (JSON does not allow comments). "
                f"Use a top-level or sibling '_comment' string key instead. "
                f"Original error: {e.msg}"
            ) from e
    return normalize_config(cfg)


def _save_config_sync(cfg):
    cfg.pop("_comment", None)
    normalize_config(cfg)
    with open(CONFIG_PATH, "w") as f:
        json.dump(cfg, f, indent=2)


async def load_config():
    return await asyncio.to_thread(_load_config_sync)


async def save_config(cfg):
    await asyncio.to_thread(_save_config_sync, cfg)