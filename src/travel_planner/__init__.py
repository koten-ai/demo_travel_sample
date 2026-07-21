"""Travel planner application package."""
from travel_planner.zeus_config import (
    configure_zeus_client,
    patch_durable_session_v2_routes,
)

configure_zeus_client()
# After env is set; safe before agent imports that call session APIs.
try:
    patch_durable_session_v2_routes()
except Exception:
    pass

__version__ = "0.1.0"