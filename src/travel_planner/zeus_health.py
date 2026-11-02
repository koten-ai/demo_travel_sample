"""Liveness probe for the navbar Zeus indicator.

Zeus ``GET /healthz`` is public and returns ``{"status": "ok"}`` when the
process is up. It does not ping Couchbase.
"""

from __future__ import annotations

import os
from typing import Any

import httpx

from travel_planner.runtime_factory import _rewrite_loopback_host, load_app_config_dict

PROBE_TIMEOUT_S = 2.0


def zeus_base_url() -> str:
    """Zeus origin the runtime would call, without a trailing slash."""
    raw = load_app_config_dict()
    zcfg = raw.get("zeus") if isinstance(raw.get("zeus"), dict) else {}
    url = os.environ.get("ZEUS_URL") or (zcfg or {}).get("url") or "http://127.0.0.1:8080"
    return _rewrite_loopback_host(str(url)).rstrip("/")


def probe_zeus_online(
    url: str | None = None,
    *,
    client: httpx.Client | None = None,
) -> bool:
    """True when ``GET {url}/healthz`` returns HTTP 200 and ``status`` ``ok``."""
    base = (zeus_base_url() if url is None else url).rstrip("/")
    if not base:
        return False
    owns_client = client is None
    http = client or httpx.Client(timeout=PROBE_TIMEOUT_S, follow_redirects=False)
    try:
        response = http.get(f"{base}/healthz")
    except httpx.HTTPError:
        return False
    finally:
        if owns_client:
            http.close()
    if response.status_code != 200:
        return False
    try:
        body: Any = response.json()
    except ValueError:
        return False
    return isinstance(body, dict) and str(body.get("status") or "").strip().lower() == "ok"
