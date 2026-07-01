"""Point vendored python3 constants at this app's config and data paths."""
import os
import sys
from pathlib import Path

from travel_planner.paths import PROJECT_ROOT, VENDOR_DIR

def patch_zeus_paths() -> None:
    import python3.constants as constants

    constants.BASE_DIR = PROJECT_ROOT
    constants.CONFIG_PATH = PROJECT_ROOT / "config.json"
    constants.EXAMPLE_CONFIG_PATH = PROJECT_ROOT / "config.example.json"
    constants.CHAT_REQ_DIR = VENDOR_DIR / "chat_requests"
    constants.CHAT_LOG_PATH = Path(
        os.environ.get("CHAT_LOG_PATH") or (PROJECT_ROOT / "data" / "chats.jsonl")
    )

    for name, attrs in (
        ("python3.config", ("CONFIG_PATH", "EXAMPLE_CONFIG_PATH")),
        ("python3.storage.chat_store", ("CHAT_LOG_PATH",)),
        ("python3.setup", ("CHAT_REQ_DIR",)),
        ("python3.zeus.catalog", ("CHAT_REQ_DIR",)),
    ):
        mod = sys.modules.get(name)
        if mod is None:
            continue
        for attr in attrs:
            setattr(mod, attr, getattr(constants, attr))