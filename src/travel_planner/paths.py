"""Project layout paths for config, data, and vendored Zeus code."""
from pathlib import Path

PACKAGE_DIR = Path(__file__).resolve().parent
SRC_DIR = PACKAGE_DIR.parent
PROJECT_ROOT = SRC_DIR.parent
VENDOR_DIR = PROJECT_ROOT / "vendor"