"""Concrete zeus_data allowlist for the travel demo.

Applied in ``turn_mapper.filter_row_by_schema`` after ``rt.agent.run_turn`` so
structured rows keep fields this app maps into destination cards — not full
document dumps or internal ingest metadata (e.g. ``job_fingerprint``, ``meta``,
``status``). This is app-owned; it is not a Zeus client ``run_turn`` kwarg.
"""
from __future__ import annotations

# Card-facing + light context fields only. Synonyms match results_parser keys.
_CARD_FIELDS = (
    "id",
    "name",
    "title",
    "destination",
    "destination_name",
    "description",
    "summary",
    "brief",
    "overview",
    "body",
    "snippet",
    "city",
    "location",
    "country",
    "state",
    "address",
    "directions",
    "type",
    "price",
    "price_range",
    "rate",
    "image",
    "image_url",
    "photo",
    "thumbnail",
    "picture",
    "img",
    "cover_image",
    "url",
    "website",
    "link",
)

_AIRPORT_EXTRA = (
    "airportname",
    "faa",
    "icao",
)

DEMO_OUTPUT_SCHEMA: dict[str, list[str]] = {
    "Hotel": list(_CARD_FIELDS),
    "Destination": list(_CARD_FIELDS),
    "Airport": list(_CARD_FIELDS) + list(_AIRPORT_EXTRA),
}
"""Entity-type → allowed field names for structured ``zeus_data`` rows."""
