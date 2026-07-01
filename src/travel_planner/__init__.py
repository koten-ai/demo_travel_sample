"""Travel planner application package."""
import sys

from travel_planner.paths import VENDOR_DIR

if VENDOR_DIR.is_dir() and str(VENDOR_DIR) not in sys.path:
    sys.path.insert(0, str(VENDOR_DIR))

__version__ = "0.1.0"