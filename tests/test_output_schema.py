"""Demo output_schema shapes and cleans structured zeus_data."""
from travel_planner.output_schema import DEMO_OUTPUT_SCHEMA
from travel_planner.results_parser import zeus_data_to_results
from zeus_client.agent.response import extract_structured_response


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


def test_extract_structured_response_applies_demo_schema():
    """Hotel rows keep card fields; internal keys are stripped from zeus_data."""
    chat_req = {
        "messages": [{"role": "system", "content": "no mini-schema needed when override set"}],
        "guidance": {},
    }
    trace = {
        "steps": [],
        "tool_calls": [
            {
                "name": "find",
                "status": 200,
                "args": {"entity_type": "Hotel"},
                "result_json": {
                    "rows": [
                        {
                            "id": "hotel_1",
                            "name": "Hotel Plaza",
                            "description": "Near CDG",
                            "city": "Paris",
                            "image_url": "https://example.com/plaza.jpg",
                            "hotel_details": {"rooms": 120},
                            "job_fingerprint": "abc123",
                            "meta": {"source": "ingest"},
                            "status": "active",
                        }
                    ]
                },
            }
        ],
    }

    structured = extract_structured_response(
        "Found hotels near Paris.",
        trace,
        chat_req,
        output_schema=DEMO_OUTPUT_SCHEMA,
    )

    assert structured.entity_type == "Hotel"
    assert len(structured.zeus_data) == 1
    row = structured.zeus_data[0]
    assert row == {
        "id": "hotel_1",
        "name": "Hotel Plaza",
        "description": "Near CDG",
        "city": "Paris",
        "image_url": "https://example.com/plaza.jpg",
    }
    assert "hotel_details" not in row
    assert "job_fingerprint" not in row
    assert "meta" not in row
    assert "status" not in row

    # Client still reports drops as soft warnings (allowlist is intentional).
    dropped = " ".join(structured.warnings)
    assert "hotel_details" in dropped
    assert "job_fingerprint" in dropped

    cards = zeus_data_to_results(structured.zeus_data)
    assert cards[0]["name"] == "Hotel Plaza"
    assert cards[0]["description"] == "Near CDG"
    assert cards[0]["image"] == "https://example.com/plaza.jpg"
    assert cards[0]["city"] == "Paris"


def test_extract_structured_response_destination_entity():
    chat_req = {"messages": [{"role": "system", "content": "x"}], "guidance": {}}
    trace = {
        "steps": [],
        "tool_calls": [
            {
                "name": "project",
                "status": 200,
                "args": {"entity_type": "Destination"},
                "result_json": {
                    "rows": [
                        {
                            "id": "dest_1",
                            "name": "Paris",
                            "type": "city",
                            "country": "France",
                            "secret_internal": True,
                        }
                    ]
                },
            }
        ],
    }
    structured = extract_structured_response(
        "Paris",
        trace,
        chat_req,
        output_schema=DEMO_OUTPUT_SCHEMA,
    )
    assert structured.zeus_data == [
        {
            "id": "dest_1",
            "name": "Paris",
            "type": "city",
            "country": "France",
        }
    ]
