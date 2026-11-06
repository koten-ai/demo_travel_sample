"""Configure paths/env for TravelPlan + zeus_client before runtime bind."""

from __future__ import annotations

import os

from dotenv import load_dotenv

from travel_planner.paths import PROJECT_ROOT

# Beer .env names → client loader names. Copy only when the destination is empty.
_CLIENT_ENV_PAIRS = (
    ("ZEUS_URL", "ZEUS_CLIENT_URL"),
    ("ZEUS_AUTH_MODE", "ZEUS_CLIENT_AUTH_MODE"),
    ("ZEUS_USERNAME", "ZEUS_CLIENT_USERNAME"),
    ("ZEUS_BUCKET", "ZEUS_CLIENT_BUCKET"),
    ("ZEUS_SCOPE", "ZEUS_CLIENT_SCOPE"),
    ("ZEUS_COLLECTION", "ZEUS_CLIENT_COLLECTION"),
    ("ZEUS_MODE", "ZEUS_CLIENT_MODE"),
    ("LLM_BASE_URL", "ZEUS_CLIENT_LLM_BASE_URL"),
    ("LLM_MODEL", "ZEUS_CLIENT_LLM_MODEL"),
)


def _overlay_client_env() -> None:
    """Map beer .env names onto ZEUS_CLIENT_* when the destination is empty."""
    for src, dst in _CLIENT_ENV_PAIRS:
        val = (os.environ.get(src) or "").strip()
        if val and not (os.environ.get(dst) or "").strip():
            os.environ[dst] = val


def configure_paths() -> None:
    """Load project .env without overriding existing vars, then set path defaults.

    Compose injects ZEUS_URL before the process starts. override=False keeps
    that value ahead of the file. interpolate=False leaves a password that
    contains ``$`` unchanged (Compose env_file would expand it).
    """
    load_dotenv(PROJECT_ROOT / ".env", override=False, interpolate=False)
    _overlay_client_env()
    os.environ.setdefault("ZEUS_CLIENT_CONFIG_DIR", str(PROJECT_ROOT))
    chat_dir = str(PROJECT_ROOT / "data" / "chat_requests")
    os.environ.setdefault("ZEUS_CHAT_REQUESTS_DIR", chat_dir)
    os.environ.setdefault("ZEUS_CLIENT_CHAT_REQUESTS_DIR", chat_dir)
    os.environ.setdefault("CHAT_LOG_PATH", str(PROJECT_ROOT / "data" / "chats.jsonl"))


# Back-compat alias used by older call sites / package __init__.
configure_zeus_client = configure_paths
