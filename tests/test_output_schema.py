"""Demo output_schema shapes and BFF-owned row filtering."""
from travel_planner.output_schema import DEMO_OUTPUT_SCHEMA
from travel_planner.results_parser import zeus_data_to_results
from travel_planner.turn_mapper import filter_row_by_schema, results_waterfall
from zeus_client import DebugBundle, TurnResult, TurnStatus


def test_demo_output_schema_covers_travel_entities():
    assert set(DEMO_OUTPUT_SCHEMA) >= {"Hotel", "Destination", "Airport"}
    for fields in DEMO_OUTPUT_SCHEMA.values():
        assert "name" in fields
        assert "description" in fields or "summary" in fields
        assert "id" in fields


def test_demo_output_schema_excludes_internal_noise_fields():
    noise = {"hotel_details", "job_fingerprint", "meta", "status"}
    for entity, fields in DEMO_OUTPUT_SCHEMA.items():
        overlap = noise & set(fields)
        assert not overlap, f"{entity} should not allow internal fields: {overlap}"


def test_filter_row_by_schema_strips_internal_hotel_fields():
    row = {
        "id": "hotel_1",
        "name": "Hotel Plaza",
        "description": "Near CDG",
        "city": "Paris",
        "image_url": "https://example.com/plaza.jpg",
        "entity_type": "Hotel",
        "hotel_details": {"rooms": 120},
        "job_fingerprint": "abc123",
        "meta": {"source": "ingest"},
        "status": "active",
    }
    filtered = filter_row_by_schema(row)
    assert filtered == {
        "id": "hotel_1",
        "name": "Hotel Plaza",
        "description": "Near CDG",
        "city": "Paris",
        "image_url": "https://example.com/plaza.jpg",
        "entity_type": "Hotel",
    }
    cards = zeus_data_to_results([filtered])
    assert cards[0]["name"] == "Hotel Plaza"
    assert cards[0]["description"] == "Near CDG"
    assert cards[0]["image"] == "https://example.com/plaza.jpg"
    assert cards[0]["city"] == "Paris"


def test_results_waterfall_filters_destination_rows():
    result = TurnResult(
        answer="Paris",
        status=TurnStatus.OK,
        structured=None,
        session=None,
        debug=DebugBundle(
            public_trace={
                "hops": [
                    {
                        "verb": "project",
                        "result_json": {
                            "rows": [
                                {
                                    "id": "dest_1",
                                    "name": "Paris",
                                    "type": "city",
                                    "country": "France",
                                    "entity_type": "Destination",
                                    "secret_internal": True,
                                    "job_fingerprint": "nope",
                                }
                            ]
                        },
                    }
                ]
            }
        ),
        error=None,
        messages=(),
    )
    cards = results_waterfall(result, result.debug.public_trace, result.answer or "")
    assert cards[0]["name"] == "Paris"
    assert cards[0]["country"] == "France"
    assert "job_fingerprint" not in cards[0]
    assert "secret_internal" not in cards[0]


def test_results_waterfall_airport_pipeline_hop():
    result = TurnResult(
        answer="Airports in the United States.",
        status=TurnStatus.OK,
        structured=None,
        session=None,
        debug=DebugBundle(
            public_trace={
                "hops": [
                    {
                        "name": "pipeline",
                        "result_json": {
                            "status": "ok",
                            "rows": {
                                "rows": [
                                    {
                                        "airportname": "San Francisco Intl",
                                        "faa": "SFO",
                                        "icao": "KSFO",
                                        "city": "San Francisco",
                                        "country": "United States",
                                        "entity_type": "Airport",
                                    }
                                ]
                            },
                        },
                    }
                ]
            }
        ),
        error=None,
        messages=(),
    )
    cards = results_waterfall(result, result.debug.public_trace, result.answer or "")
    assert cards
    assert cards[0]["name"] == "San Francisco Intl"
    assert cards[0]["faa"] == "SFO"
    assert cards[0]["country"] == "United States"


def _paris_hotel(name: str, key: str) -> dict:
    return {
        "address": "1-5 Passage Ruelle",
        "city": "Paris",
        "country": "France",
        "description": f"{name} near CDG/Orly.",
        "doc_key": key,
        "id": f"file::{key}",
        "name": name,
        "price": "€190-2,500",
        "state": "Île-de-France",
        "title": "Paris/18th arrondissement",
        "type": "hotel",
        "url": "http://www.kubehotel-paris.com/en/page/kube-hotel-paris-18.1.html",
    }


def _terminating_pipeline_body() -> dict:
    """Live Zeus shape for Nearby hotels in paris airport (hotel_rows + fingerprint)."""
    hotels = [
        _paris_hotel("Kube Hotel", "hotel_21679"),
        _paris_hotel("Renaissance Paris Arc de Triomphe", "hotel_21677"),
        _paris_hotel("Hôtel de Crillon", "hotel_21846"),
    ]
    airports = [
        {
            "airportname": "Charles De Gaulle Intl",
            "faa": "CDG",
            "icao": "LFPG",
            "city": "Paris",
            "country": "France",
        },
        {
            "airportname": "Orly",
            "faa": "ORY",
            "icao": "LFPO",
            "city": "Paris",
            "country": "France",
        },
    ]
    return {
        "confidence": "med",
        "data": {
            "airport_info": {"rows": airports},
            "hotel_rows": {"rows": hotels},
            "job_fingerprint": {
                "algorithm": "md5",
                "canonical_bytes": 777,
                "server_md5": "md5:deadbeef",
                "verified": False,
            },
            "meta": {
                "elapsed_ms": 10,
                "step_costs": [
                    {"as": "paris_airports", "result_size": 9, "status": "ok"},
                    {"as": "hotel_rows", "result_size": 50, "status": "ok"},
                ],
                "steps_executed": 4,
                "total_cost": 3.05,
            },
            "status": "ok",
        },
        "decomposition": {
            "targets": ["Hotel", "Airport"],
            "predicates": {"city": "Paris"},
            "fields": ["name", "address", "price", "airportname", "faa"],
        },
        "query_decomposition": {
            "intent": "find nearby hotels at Paris airport",
            "entity": "Hotel",
            "location": "Paris",
        },
        "summary": (
            "Hotels in Paris (near Paris airports such as CDG/Orly). "
            "Listed Paris-area airports and hotels with address, price, and description "
            "where available."
        ),
        "turn_complete": True,
    }


def test_results_waterfall_hotel_rows_beside_job_fingerprint():
    """Regression: pipeline data.hotel_rows must become named hotel cards, not '- Paris'."""
    body = _terminating_pipeline_body()
    result = TurnResult(
        answer=body["summary"],
        status=TurnStatus.OK,
        structured=None,
        session=None,
        debug=DebugBundle(
            public_trace={
                "hops": [
                    {
                        "name": "pipeline",
                        "ok": True,
                        "status": 200,
                        "result_json": body,
                        "snippet": '{"data":{"job_fingerprint":{"algorithm":"md5"}',
                    }
                ]
            }
        ),
        error=None,
        messages=(),
    )
    cards = results_waterfall(result, result.debug.public_trace, result.answer or "")
    names = [c["name"] for c in cards]
    assert "Kube Hotel" in names
    assert "Renaissance Paris Arc de Triomphe" in names
    assert "Hôtel de Crillon" in names
    assert names[0] == "Kube Hotel"
    assert "Paris" not in names
    kube = next(c for c in cards if c["name"] == "Kube Hotel")
    assert kube["city"] == "Paris"
    assert kube["price"] == "€190-2,500"
    assert "job_fingerprint" not in kube


def test_user_answer_peels_fenced_pipeline_xml():
    from travel_planner.turn_mapper import user_answer

    xml = (
        "```html\n"
        "<pipeline>\n"
        '<steps>[{"as": "paris_hotels", "verb": "find", "entity_type": "Hotel", '
        '"where": {"city": "Paris"}, "limit": 30}]</steps>\n'
        '<return>["hotel_rows"]</return>\n'
        "<summary>Hotels in Paris (near Paris airports such as CDG/Orly).</summary>\n"
        '<query_decomposition>{"intent": "find nearby hotels at Paris airport"}'
        "</query_decomposition>\n"
        "<confidence>med</confidence>\n"
        '<decomposition>{"targets": ["Hotel", "Airport"]}</decomposition>\n'
        "</pipeline>\n"
        "```"
    )
    result = TurnResult(
        answer=xml,
        status=TurnStatus.OK,
        structured=None,
        session=None,
        debug=DebugBundle(public_trace={"hops": []}),
        error=None,
        messages=(),
    )
    text = user_answer(result)
    assert "<pipeline>" not in text
    assert "```html" not in text
    assert text == "Hotels in Paris (near Paris airports such as CDG/Orly)."
