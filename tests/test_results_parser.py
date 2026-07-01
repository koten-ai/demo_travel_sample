from travel_planner.results_parser import extract_destinations


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