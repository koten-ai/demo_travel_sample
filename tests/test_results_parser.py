from travel_planner.results_parser import extract_destinations, zeus_data_to_results


def test_extract_destinations_from_search_tool():
    trace = {
        "tool_calls": [
            {
                "name": "search",
                "result_json": {
                    "rows": [
                        {
                            "name": "Santorini",
                            "description": "Greek island with sunsets",
                            "image_url": "https://example.com/santorini.jpg",
                        },
                        {"title": "Santorini", "summary": "duplicate"},
                        {"city": "Lisbon", "brief": "Coastal capital"},
                    ]
                },
            }
        ]
    }
    results = extract_destinations(trace)
    assert len(results) == 2
    assert results[0]["name"] == "Santorini"
    assert results[0]["image"] == "https://example.com/santorini.jpg"
    assert results[1]["name"] == "Lisbon"


def test_extract_destinations_empty_trace():
    assert extract_destinations(None) == []
    assert extract_destinations({}) == []


def test_zeus_data_to_results_prefers_schema_filtered_rows():
    zeus_data = [
        {
            "id": "n_1",
            "name": "Santorini",
            "description": "Greek island with sunsets",
            "image_url": "https://example.com/santorini.jpg",
        },
        {"id": "n_2", "title": "Lisbon", "summary": "Coastal capital"},
        {"id": "n_3", "name": "Santorini", "description": "duplicate"},
    ]
    results = zeus_data_to_results(zeus_data)
    assert len(results) == 2
    assert results[0]["name"] == "Santorini"
    assert results[0]["image"] == "https://example.com/santorini.jpg"
    assert results[1]["name"] == "Lisbon"


def test_zeus_data_to_results_empty_input():
    assert zeus_data_to_results(None) == []
    assert zeus_data_to_results([]) == []