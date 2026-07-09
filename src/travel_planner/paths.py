"""Project layout paths for config and data."""
from pathlib import Path

PACKAGE_DIR = Path(__file__).resolve().parent
SRC_DIR = PACKAGE_DIR.parent
PROJECT_ROOT = SRC_DIR.parent
CHAT_REQUESTS_DIR = PROJECT_ROOT / "data" / "chat_requests"