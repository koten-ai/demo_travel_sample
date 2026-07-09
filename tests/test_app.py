def test_index_renders(flask_client):
    response = flask_client.get("/")
    assert response.status_code == 200
    assert b"TravelPlan" in response.data or b"travel" in response.data.lower()


def test_search_rejects_empty_query(flask_client):
    response = flask_client.post("/api/search", json={"query": "  "})
    assert response.status_code == 400
    assert response.get_json()["error"] == "empty query"


def test_tool_order_returns_versions(flask_client):
    response = flask_client.get("/api/tool-order")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert "v1" in data
    assert "v2" in data
    assert isinstance(data["v2"], list)
    assert len(data["v2"]) > 0


def test_index_injects_tool_order(flask_client):
    response = flask_client.get("/")
    assert response.status_code == 200
    assert b"toolOrder" in response.data
    assert b'"v2"' in response.data