"""Concrete zeus_data allowlist for the travel demo.

Passed as ``output_schema`` to ``run_agent`` so structured rows are filtered to
fields this app actually maps into destination cards — not full document dumps
or internal ingest metadata (e.g. ``job_fingerprint``, ``meta``, ``status``).

Precedence in the Zeus client (highest first):
1. This argument to ``run_agent``
2. ``guidance.injections.output_schema`` in the chat_request
3. Live MINI-SCHEMA from the scope brief
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
