"""Configure paths/env for TravelPlan + zeus_client before runtime bind."""

from __future__ import annotations

import os

from dotenv import load_dotenv

from travel_planner.paths import PROJECT_ROOT


def configure_paths() -> None:
    """Load project .env without overriding existing vars, then set path defaults.

    Compose injects ZEUS_URL before the process starts. override=False keeps
    that value ahead of the file. interpolate=False leaves a password that
    contains ``$`` unchanged (Compose env_file would expand it).
    """
    load_dotenv(PROJECT_ROOT / ".env", override=False, interpolate=False)
    os.environ.setdefault("ZEUS_CLIENT_CONFIG_DIR", str(PROJECT_ROOT))
    chat_dir = str(PROJECT_ROOT / "data" / "chat_requests")
    os.environ.setdefault("ZEUS_CHAT_REQUESTS_DIR", chat_dir)
    os.environ.setdefault("ZEUS_CLIENT_CHAT_REQUESTS_DIR", chat_dir)
    os.environ.setdefault("CHAT_LOG_PATH", str(PROJECT_ROOT / "data" / "chats.jsonl"))


# Back-compat alias used by older call sites / package __init__.
configure_zeus_client = configure_paths
