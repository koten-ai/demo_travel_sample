import json

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


def test_unwrap_json_blob_description_into_hotel_fields():
    """Travel-sample rows sometimes put the whole hotel doc in description as JSON."""
    hotel = {
        "address": "1-5 Passage Ruelle",
        "checkin": None,
        "checkout": None,
        "city": "Paris",
        "country": "France",
        "description": (
            "Stylish and atmospheric, the Kube Hotel exudes a high tech and luxurious decor."
        ),
        "directions": None,
        "name": "Kube Hotel",
        "price": "€190-2,500",
        "state": "Île-de-France",
        "title": "Paris/18th arrondissement",
        "type": "hotel",
        "url": "http://www.kubehotel-paris.com/en/page/kube-hotel-paris-18.1.html",
    }
    zeus_data = [
        {
            "id": "hotel_kube",
            "name": "Kube Hotel",
            "description": json.dumps(hotel, ensure_ascii=False),
        }
    ]
    results = zeus_data_to_results(zeus_data)
    assert len(results) == 1
    card = results[0]
    assert card["name"] == "Kube Hotel"
    assert card["description"].startswith("Stylish and atmospheric")
    assert "{" not in card["description"]
    assert card["address"] == "1-5 Passage Ruelle"
    assert card["location"] == "1-5 Passage Ruelle"
    assert card["city"] == "Paris"
    assert card["state"] == "Île-de-France"
    assert card["country"] == "France"
    assert card["price"] == "€190-2,500"
    assert "kubehotel-paris.com" in card["url"]
    assert card["area"] == "Paris/18th arrondissement"


def test_unwrap_nested_dict_description():
    zeus_data = [
        {
            "description": {
                "name": "Hôtel de Crillon",
                "description": "Legendary hotel overlooking Place de la Concorde.",
                "address": "10, place de la Concorde",
                "city": "Paris",
                "country": "France",
                "price": "€€€€",
                "url": "http://www.hoteldecrillonparis.info",
            }
        }
    ]
    results = zeus_data_to_results(zeus_data)
    assert len(results) == 1
    assert results[0]["name"] == "Hôtel de Crillon"
    assert "Place de la Concorde" in results[0]["description"]
    assert results[0]["price"] == "€€€€"