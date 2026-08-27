"""Vendored analytics base-6.1 pin is present on the client load path."""

from __future__ import annotations

import json
from pathlib import Path

from travel_planner.paths import PROJECT_ROOT

CHAT_DIR = PROJECT_ROOT / "data" / "chat_requests"
PIN = CHAT_DIR / "chat_request_analytics_base-6.1.json"
LOAD_PATH = CHAT_DIR / "travel-sample__inventory" / "chat_request_analytics_v2.json"
CONTRACT_HASH = "md5:5aacbf1d7a4d9d5de9436cdffbce050f"


def _load(path: Path) -> dict:
    assert path.is_file(), f"missing vendored catalog {path}"
    doc = json.loads(path.read_text(encoding="utf-8"))
    assert isinstance(doc, dict)
    return doc


def test_analytics_base_6_1_pin_is_vendored():
    doc = _load(PIN)
    lineage = doc.get("_lineage") or {}
    contract = doc.get("contract") or {}
    assert lineage.get("base_id") == "base-6.1"
    assert lineage.get("file_stem") == "chat_request_analytics_base-6.1.json"
    assert contract.get("id") == "analytics_base5_2"
    assert contract.get("hash") == CONTRACT_HASH
    assert doc.get("_hash") == CONTRACT_HASH
    assert len(doc.get("verbs") or []) == 13


def test_inventory_load_path_matches_pin():
    pin = _load(PIN)
    loaded = _load(LOAD_PATH)
    assert loaded.get("_hash") == pin.get("_hash")
    assert (loaded.get("_lineage") or {}).get("base_id") == "base-6.1"
    top = CHAT_DIR / "chat_request_analytics_v2.json"
    assert _load(top).get("_hash") == pin.get("_hash")
