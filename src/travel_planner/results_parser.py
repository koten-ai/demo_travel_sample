"""Extract destination cards from Zeus agent trace tool results."""
from __future__ import annotations

import json
from typing import Any

NAME_KEYS = ("name", "title", "destination", "destination_name", "city", "location")
DESC_KEYS = ("description", "summary", "brief", "overview", "body", "snippet")
IMAGE_KEYS = ("image", "image_url", "photo", "thumbnail", "picture", "img", "cover_image")

MAX_RESULTS = 20


def _first_str(row: dict, keys: tuple[str, ...]) -> str:
    for key in keys:
        val = row.get(key)
        if val is not None and str(val).strip():
            return str(val).strip()
    return ""


def _normalize_row(row: Any) -> dict[str, str] | None:
    if not isinstance(row, dict):
        return None
    name = _first_str(row, NAME_KEYS)
    if not name:
        return None
    return {
        "name": name,
        "description": _first_str(row, DESC_KEYS),
        "image": _first_str(row, IMAGE_KEYS),
    }


def _collect_arrays(obj: Any, found: list) -> None:
    if isinstance(obj, list):
        for item in obj:
            if isinstance(item, dict):
                found.append(item)
        return
    if not isinstance(obj, dict):
        return
    for key in ("rows", "items", "results", "data", "destinations", "matches", "nodes"):
        val = obj.get(key)
        if isinstance(val, list):
            for item in val:
                if isinstance(item, dict):
                    found.append(item)
    for key in ("return", "output"):
        val = obj.get(key)
        if isinstance(val, dict):
            _collect_arrays(val, found)
        elif isinstance(val, list):
            _collect_arrays(val, found)
    steps = obj.get("steps")
    if isinstance(steps, dict):
        for step_val in steps.values():
            if isinstance(step_val, dict):
                _collect_arrays(step_val, found)


def _rows_from_tool_call(rec: dict) -> list[dict]:
    rows: list[dict] = []
    parsed = rec.get("result_json")
    if isinstance(parsed, dict):
        _collect_arrays(parsed, rows)
    if rows:
        return rows
    raw = rec.get("result_text") or rec.get("result") or ""
    if not raw:
        return rows
    try:
        data = json.loads(raw)
    except (TypeError, ValueError):
        return rows
    _collect_arrays(data, rows)
    return rows


def zeus_data_to_results(zeus_data: list[dict] | None) -> list[dict[str, str]]:
    """Convert schema-filtered zeus_data rows into destination cards."""
    if not zeus_data:
        return []

    seen: set[str] = set()
    results: list[dict[str, str]] = []
    for row in zeus_data:
        card = _normalize_row(row)
        if not card:
            continue
        key = card["name"].lower()
        if key in seen:
            continue
        seen.add(key)
        results.append(card)
        if len(results) >= MAX_RESULTS:
            break
    return results


def extract_destinations(trace: dict | None) -> list[dict[str, str]]:
    """Walk trace tool_calls and return normalized destination cards."""
    if not trace:
        return []

    seen: set[str] = set()
    results: list[dict[str, str]] = []

    for rec in trace.get("tool_calls") or []:
        for row in _rows_from_tool_call(rec):
            card = _normalize_row(row)
            if not card:
                continue
            key = card["name"].lower()
            if key in seen:
                continue
            seen.add(key)
            results.append(card)
            if len(results) >= MAX_RESULTS:
                return results

    return results