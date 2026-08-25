"""Configure paths/env for TravelPlan + zeus_client before runtime bind."""

from __future__ import annotations

import os

from travel_planner.paths import PROJECT_ROOT


def configure_paths() -> None:
    """Set path-related env vars for V2 loader overlays and app chat store."""
    os.environ.setdefault("ZEUS_CLIENT_CONFIG_DIR", str(PROJECT_ROOT))
    chat_dir = str(PROJECT_ROOT / "data" / "chat_requests")
    os.environ.setdefault("ZEUS_CHAT_REQUESTS_DIR", chat_dir)
    os.environ.setdefault("ZEUS_CLIENT_CHAT_REQUESTS_DIR", chat_dir)
    os.environ.setdefault("CHAT_LOG_PATH", str(PROJECT_ROOT / "data" / "chats.jsonl"))


# Back-compat alias used by older call sites / package __init__.
configure_zeus_client = configure_paths
