"""Configure kotenai-zeus-client paths for this app's layout."""
from __future__ import annotations

import os
import sys

from travel_planner.paths import PROJECT_ROOT


def configure_zeus_client() -> None:
    """Set env vars before any zeus_client import (constants read env at import time)."""
    os.environ.setdefault("ZEUS_CLIENT_CONFIG_DIR", str(PROJECT_ROOT))
    os.environ.setdefault(
        "ZEUS_CHAT_REQUESTS_DIR",
        str(PROJECT_ROOT / "data" / "chat_requests"),
    )
    os.environ.setdefault("CHAT_LOG_PATH", str(PROJECT_ROOT / "data" / "chats.jsonl"))


def patch_durable_session_v2_routes() -> None:
    """Point durable session APIs at /v2/session* (Zeus ZE-35).

    Older kotenai-zeus-client images still call /v1/session*, which 404s on
    current Zeus. We rewrite both:
    - the shared HTTP client (covers already-bound ``client`` imports)
    - the session helper functions' URL construction when possible

    Upstream zeus_client_python already uses /v2; this is a runtime
    compatibility shim for baked Docker installs without a rebuild.
    """
    try:
        from zeus_client import http_client as hc
    except ImportError:
        return

    if getattr(hc, "_travel_planner_v2_session_patched", False):
        return

    _orig_client_factory = hc.client

    class _V2SessionClient:
        def __init__(self, inner):
            self._inner = inner

        @staticmethod
        def _fix_url(url):
            if isinstance(url, str) and "/v1/session" in url:
                return url.replace("/v1/session", "/v2/session")
            return url

        async def post(self, url, **kwargs):
            return await self._inner.post(self._fix_url(url), **kwargs)

        async def get(self, url, **kwargs):
            return await self._inner.get(self._fix_url(url), **kwargs)

        def __getattr__(self, item):
            return getattr(self._inner, item)

    def _client():
        return _V2SessionClient(_orig_client_factory())

    hc.client = _client  # type: ignore[assignment]

    # Rebind already-imported ``client`` names (``from … import client``).
    for mod_name, mod in list(sys.modules.items()):
        if not mod_name.startswith("zeus_client"):
            continue
        if getattr(mod, "client", None) is _orig_client_factory:
            setattr(mod, "client", _client)

    # Also rewrite URL strings returned/logged by session helpers if present.
    try:
        from zeus_client.zeus import session as sess
    except ImportError:
        sess = None  # type: ignore[assignment]

    if sess is not None:
        for name in (
            "create_zeus_session",
            "continue_session_turn",
            "post_session_trace",
            "rehydrate_session",
        ):
            orig = getattr(sess, name, None)
            if orig is None or getattr(orig, "_travel_planner_v2_wrapped", False):
                continue

            if name == "rehydrate_session":
                async def _wrap_rehydrate(fn=orig, *args, **kwargs):
                    # rehydrate returns a body or None — URL is internal only.
                    # Still ensure its GET uses the patched client above.
                    return await fn(*args, **kwargs)

                _wrap_rehydrate._travel_planner_v2_wrapped = True  # type: ignore[attr-defined]
                setattr(sess, name, _wrap_rehydrate)
                continue

            async def _wrap(fn=orig, *args, **kwargs):
                status, body, url, req_id = await fn(*args, **kwargs)
                if isinstance(url, str) and "/v1/session" in url:
                    url = url.replace("/v1/session", "/v2/session")
                return status, body, url, req_id

            _wrap._travel_planner_v2_wrapped = True  # type: ignore[attr-defined]
            setattr(sess, name, _wrap)

    hc._travel_planner_v2_session_patched = True
