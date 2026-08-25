"""Extract destination cards from Zeus agent trace tool results."""
from __future__ import annotations

import json
from typing import Any

NAME_KEYS = (
    "name",
    "airportname",
    "title",
    "destination",
    "destination_name",
    "city",
    "location",
    "faa",
    "icao",
)
DESC_KEYS = ("description", "summary", "brief", "overview", "body", "snippet")
IMAGE_KEYS = ("image", "image_url", "photo", "thumbnail", "picture", "img", "cover_image")
# Fields that sometimes hold a full hotel/destination document as JSON or nested dict.
BLOB_KEYS = DESC_KEYS + ("content", "document", "payload", "data", "source", "value")
PRICE_KEYS = ("price", "price_range", "rate")
URL_KEYS = ("url", "website", "link", "homepage")
ADDRESS_KEYS = ("address", "location")
IDENTITY_KEYS = (
    "name",
    "airportname",
    "title",
    "destination",
    "destination_name",
    "faa",
    "icao",
    "id",
    "doc_key",
)
_PLACE_ONLY_KEYS = frozenset({"city", "state", "country"})
_FILTER_ONLY_KEYS = frozenset({"where", "predicates", "limit", "offset", "return"})
_SKIP_WALK_KEYS = frozenset(
    {
        "job_fingerprint",
        "meta",
        "decomposition",
        "query_decomposition",
        "provenance",
        "entity_refs",
        "node_refs",
        "step_costs",
        "wish_i_knew",
    }
)
_SPECIAL_LIST_KEYS = (
    "rows",
    "items",
    "results",
    "data",
    "destinations",
    "matches",
    "nodes",
)

MAX_RESULTS = 20


def is_product_row(row: Any) -> bool:
    """True for Hotel/Airport/destination docs — not find-where or predicates."""
    if not isinstance(row, dict) or not row:
        return False
    keys = set(row)
    if keys <= _PLACE_ONLY_KEYS or keys <= _FILTER_ONLY_KEYS:
        return False
    if keys <= (_PLACE_ONLY_KEYS | _FILTER_ONLY_KEYS):
        return False
    if any(row.get(k) not in (None, "") for k in IDENTITY_KEYS):
        return True
    if _first_str(row, ("city", "location")) and _first_str(row, DESC_KEYS):
        return True
    return False


def infer_entity_type(row: Any) -> str:
    """Stamp Hotel/Airport/Destination from explicit type or identifying fields."""
    if not isinstance(row, dict):
        return "Destination"
    explicit = row.get("entity_type") or row.get("type")
    if isinstance(explicit, str) and explicit.strip():
        raw = explicit.strip()
        for known in ("Hotel", "Airport", "Destination"):
            if raw.lower() == known.lower():
                return known
        return raw[:1].upper() + raw[1:]
    if any(row.get(k) not in (None, "") for k in ("airportname", "faa", "icao")):
        return "Airport"
    if any(row.get(k) not in (None, "") for k in ("name", "title")):
        return "Hotel"
    return "Destination"


def prefer_hotel_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Hotel cards first so a mixed airport+hotel pipeline does not cap as airports."""
    hotels: list[dict[str, Any]] = []
    rest: list[dict[str, Any]] = []
    airports: list[dict[str, Any]] = []
    for row in rows:
        et = infer_entity_type(row)
        if et == "Hotel":
            hotels.append(row)
        elif et == "Airport":
            airports.append(row)
        else:
            rest.append(row)
    return hotels + rest + airports


def _first_str(row: dict, keys: tuple[str, ...]) -> str:
    for key in keys:
        val = row.get(key)
        if val is None:
            continue
        if isinstance(val, (dict, list)):
            continue
        text = str(val).strip()
        if text and text.lower() not in {"null", "none"}:
            return text
    return ""


def _try_parse_json_obj(val: Any) -> dict[str, Any] | None:
    """Parse a JSON object from a dict or JSON string; return None otherwise."""
    if isinstance(val, dict):
        return val
    if not isinstance(val, str):
        return None
    text = val.strip()
    if not text or text[0] != "{":
        return None
    try:
        data = json.loads(text)
    except (TypeError, ValueError):
        return None
    return data if isinstance(data, dict) else None


def _looks_like_entity_blob(data: dict[str, Any]) -> bool:
    """Heuristic: full hotel/destination docs carry several identity/geo fields."""
    keys = set(data)
    has_identity = bool(keys & {"name", "title", "description", "type"})
    has_geo_or_meta = bool(keys & {"address", "city", "country", "state", "price", "url", "directions"})
    return has_identity and has_geo_or_meta


def _is_json_blob_text(text: str) -> bool:
    s = (text or "").strip()
    return bool(s) and s[0] == "{" and _try_parse_json_obj(s) is not None


def _merge_blob_into_row(row: dict[str, Any]) -> dict[str, Any]:
    """If a field holds a full hotel JSON blob, promote its fields onto the row.

    Zeus / LLM paths sometimes put the entire document into ``description`` (as a
    JSON string or nested object). Cards then show the raw JSON instead of prose.
    """
    merged: dict[str, Any] = dict(row)
    for key in BLOB_KEYS:
        if key not in merged:
            continue
        blob = _try_parse_json_obj(merged.get(key))
        if not blob or not _looks_like_entity_blob(blob):
            continue

        for bk, bv in blob.items():
            if bv is None or bv == "" or bv == "null":
                continue
            existing = merged.get(bk)
            # Fill missing keys from the blob.
            if existing is None or existing == "" or existing == "null":
                merged[bk] = bv
                continue
            # Replace the field that *was* the blob (e.g. description=JSON string).
            if bk == key and isinstance(existing, str) and _is_json_blob_text(existing):
                merged[bk] = bv
            elif bk == key and isinstance(existing, dict):
                merged[bk] = bv

        # Ensure description is prose, not the re-serialized document.
        desc = merged.get("description")
        if isinstance(desc, dict):
            nested = desc.get("description")
            merged["description"] = nested if isinstance(nested, str) else ""
        elif isinstance(desc, str) and _is_json_blob_text(desc):
            inner = _try_parse_json_obj(desc) or {}
            nested = inner.get("description")
            merged["description"] = nested if isinstance(nested, str) else ""
        break
    return merged


def _build_location(row: dict[str, Any]) -> str:
    address = _first_str(row, ADDRESS_KEYS)
    if address and not _is_json_blob_text(address):
        return address
    parts = [
        _first_str(row, ("city",)),
        _first_str(row, ("state",)),
        _first_str(row, ("country",)),
    ]
    return ", ".join(p for p in parts if p)


def _normalize_row(row: Any) -> dict[str, str] | None:
    if not isinstance(row, dict):
        return None

    row = _merge_blob_into_row(row)
    if not is_product_row(row):
        return None

    # Prefer proper hotel name over geo titles like "Paris/18th arrondissement".
    name = _first_str(row, ("name", "airportname", "destination", "destination_name"))
    if not name:
        name = _first_str(row, ("title", "city", "location", "faa", "icao"))
    if not name or _is_json_blob_text(name):
        return None

    description = _first_str(row, DESC_KEYS)
    if _is_json_blob_text(description):
        inner = _try_parse_json_obj(description) or {}
        nested = inner.get("description")
        description = nested.strip() if isinstance(nested, str) else ""

    card: dict[str, str] = {
        "name": name,
        "description": description,
        "image": _first_str(row, IMAGE_KEYS),
    }

    address = _first_str(row, ("address",))
    location = _build_location(row)
    if location:
        card["location"] = location
    if address:
        card["address"] = address

    for key in ("city", "state", "country", "faa", "icao"):
        val = _first_str(row, (key,))
        if val:
            card[key] = val

    if not description:
        extras = []
        if card.get("faa"):
            extras.append(f"FAA {card['faa']}")
        if card.get("icao"):
            extras.append(f"ICAO {card['icao']}")
        description = ", ".join(extras)
        card["description"] = description

    price = _first_str(row, PRICE_KEYS)
    if price:
        card["price"] = price

    url = _first_str(row, URL_KEYS)
    if url:
        card["url"] = url

    # title on travel-sample hotels is often the arrondissement label.
    title = _first_str(row, ("title",))
    if title and title.lower() != name.lower() and not _is_json_blob_text(title):
        card["area"] = title

    return card


def _collect_arrays(obj: Any, found: list) -> None:
    if isinstance(obj, list):
        for item in obj:
            if isinstance(item, dict) and is_product_row(item):
                found.append(item)
            elif isinstance(item, (dict, list)):
                _collect_arrays(item, found)
        return
    if not isinstance(obj, dict):
        return
    for key in _SPECIAL_LIST_KEYS:
        val = obj.get(key)
        if isinstance(val, list):
            for item in val:
                if isinstance(item, dict) and is_product_row(item):
                    found.append(item)
                elif isinstance(item, (dict, list)):
                    _collect_arrays(item, found)
        elif isinstance(val, dict):
            _collect_arrays(val, found)
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
    # Pipeline `data` holds `as` bindings (hotel_rows, airport_info) beside meta.
    for key, val in obj.items():
        if key in _SKIP_WALK_KEYS or key in _SPECIAL_LIST_KEYS or key in {
            "return",
            "output",
            "steps",
            "status",
        }:
            continue
        if isinstance(val, (dict, list)):
            _collect_arrays(val, found)


def _rows_from_tool_call(rec: dict) -> list[dict]:
    rows: list[dict] = []
    parsed = rec.get("result_json")
    if isinstance(parsed, str):
        parsed = _try_parse_json_obj(parsed)
    if isinstance(parsed, dict):
        _collect_arrays(parsed, rows)
    if rows:
        return rows
    raw = rec.get("result_text") or rec.get("result") or rec.get("snippet") or rec.get("body") or ""
    if isinstance(raw, dict):
        _collect_arrays(raw, rows)
        return rows
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


def _hop_records(trace: dict) -> list[dict]:
    """V1 tool_calls plus V2 public_trace hops/steps."""
    records: list[dict] = []
    for key in ("tool_calls", "hops", "steps"):
        items = trace.get(key)
        if not isinstance(items, list):
            continue
        for rec in items:
            if isinstance(rec, dict):
                records.append(rec)
    return records


def extract_destinations(trace: dict | None) -> list[dict[str, str]]:
    """Walk trace tool_calls/hops/steps and return normalized destination cards."""
    if not trace:
        return []

    seen: set[str] = set()
    results: list[dict[str, str]] = []

    for rec in _hop_records(trace):
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
