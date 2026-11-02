"""Zeus /healthz probe and the navbar indicator."""

from __future__ import annotations

from pathlib import Path

import httpx

from travel_planner.zeus_health import probe_zeus_online


def _client(handler) -> httpx.Client:
    return httpx.Client(transport=httpx.MockTransport(handler))


def test_probe_online_on_healthz_ok():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/healthz"
        return httpx.Response(200, json={"status": "ok"})

    assert probe_zeus_online("http://zeus.example", client=_client(handler)) is True


def test_probe_offline_when_status_is_not_ok():
    def handler(_request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json={"status": "degraded"})

    assert probe_zeus_online("http://zeus.example", client=_client(handler)) is False


def test_probe_offline_on_connection_error():
    def handler(_request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("refused")

    assert probe_zeus_online("http://zeus.example", client=_client(handler)) is False


def test_probe_offline_on_http_error_status():
    def handler(_request: httpx.Request) -> httpx.Response:
        return httpx.Response(503, json={"status": "ok"})

    assert probe_zeus_online("http://zeus.example", client=_client(handler)) is False


def test_zeus_health_route_reports_probe(flask_client, monkeypatch):
    monkeypatch.setattr("travel_planner.app.probe_zeus_online", lambda: True)
    online = flask_client.get("/api/zeus/health")
    assert online.status_code == 200
    assert online.get_json() == {"online": True, "label": "Online"}

    monkeypatch.setattr("travel_planner.app.probe_zeus_online", lambda: False)
    offline = flask_client.get("/api/zeus/health")
    assert offline.status_code == 200
    assert offline.get_json() == {"online": False, "label": "Offline"}


def test_index_shows_zeus_health_indicator(flask_client):
    response = flask_client.get("/")
    assert response.status_code == 200
    assert b'id="zeus-health"' in response.data
    assert b"Zeus: Offline" in response.data
    assert b"zeus-health-dot" in response.data


def test_page_polls_zeus_health_every_three_seconds():
    src = (
        Path(__file__).resolve().parents[1]
        / "src"
        / "travel_planner"
        / "static"
        / "app.js"
    ).read_text(encoding="utf-8")
    assert "const ZEUS_HEALTH_INTERVAL_MS = 3000;" in src
    assert 'fetch("/api/zeus/health"' in src
    assert "setInterval(refreshZeusHealth, ZEUS_HEALTH_INTERVAL_MS);" in src
    assert 'label.textContent = online ? "Zeus: Online" : "Zeus: Offline";' in src
