"""HTTP route smoke tests (startup mocked)."""

from __future__ import annotations

import ast
from pathlib import Path

import zeus_client


def test_index_renders(flask_client):
    response = flask_client.get("/")
    assert response.status_code == 200
    assert b"TravelPlan" in response.data or b"travel" in response.data.lower()
    assert b"/static/app.css" in response.data
    assert b"/static/app.js" in response.data
    assert b'<textarea' in response.data
    assert b'id="searchInput"' in response.data
    assert b"Shift+Enter" in response.data
    assert b'id="search-btn-cancel"' in response.data
    assert b"search-btn-ring" in response.data
    assert b"search-btn-stop" in response.data
    assert b"search-btn-spinner" not in response.data
    assert f"v{zeus_client.__version__}".encode() in response.data


def test_search_script_wires_in_flight_cancel():
    script = Path(__file__).resolve().parents[1] / "src" / "travel_planner" / "static" / "app.js"
    src = script.read_text(encoding="utf-8")
    assert "AbortController" in src
    assert "Cancel search" in src
    assert "cancelSearch" in src
    assert 'toggle("btn-error", busy)' in src
    assert "search-btn-spinner" not in src


def test_search_rejects_empty_query(flask_client):
    response = flask_client.post("/api/search", json={"query": "  "})
    assert response.status_code == 400
    assert response.get_json()["error"] == "empty query"


def test_search_script_forwards_page_debug_query():
    script = Path(__file__).resolve().parents[1] / "src" / "travel_planner" / "static" / "app.js"
    src = script.read_text(encoding="utf-8")
    assert "pageDebugEnabled" in src
    assert "searchApiUrl" in src
    assert "/api/search?debug=true" in src
    assert 'new URLSearchParams(window.location.search).get("debug")' in src


def test_debug_query_enabled_truthy_set():
    from travel_planner.app import debug_query_enabled

    assert debug_query_enabled("true") is True
    assert debug_query_enabled("TRUE") is True
    assert debug_query_enabled("1") is True
    assert debug_query_enabled("yes") is True
    assert debug_query_enabled("on") is True
    assert debug_query_enabled(True) is True
    assert debug_query_enabled("false") is False
    assert debug_query_enabled("0") is False
    assert debug_query_enabled("") is False
    assert debug_query_enabled(None) is False


def test_search_debug_query_enables_rewind(flask_client, monkeypatch):
    seen: dict[str, object] = {}

    def fake_run_search(query, chat_id=None, *, rewind=False):
        seen["query"] = query
        seen["chat_id"] = chat_id
        seen["rewind"] = rewind
        return {"chat_id": chat_id or "c1", "query": query, "rewind": rewind}

    monkeypatch.setattr("travel_planner.app.run_search", fake_run_search)
    response = flask_client.post(
        "/api/search?debug=true", json={"query": "beaches", "chat_id": "c1"}
    )
    assert response.status_code == 200
    assert seen["rewind"] is True
    assert seen["query"] == "beaches"
    assert response.get_json()["rewind"] is True


def test_search_without_debug_does_not_enable_rewind(flask_client, monkeypatch):
    seen: dict[str, object] = {}

    def fake_run_search(query, chat_id=None, *, rewind=False):
        seen["rewind"] = rewind
        return {"chat_id": "c1", "query": query, "rewind": rewind}

    monkeypatch.setattr("travel_planner.app.run_search", fake_run_search)
    response = flask_client.post("/api/search", json={"query": "beaches"})
    assert response.status_code == 200
    assert seen["rewind"] is False
    assert response.get_json()["rewind"] is False


def test_search_debug_false_does_not_enable_rewind(flask_client, monkeypatch):
    seen: dict[str, object] = {}

    def fake_run_search(query, chat_id=None, *, rewind=False):
        seen["rewind"] = rewind
        return {"chat_id": "c1", "query": query, "rewind": rewind}

    monkeypatch.setattr("travel_planner.app.run_search", fake_run_search)
    response = flask_client.post("/api/search?debug=false", json={"query": "beaches"})
    assert response.status_code == 200
    assert seen["rewind"] is False


def test_tool_order_returns_versions(flask_client):
    response = flask_client.get("/api/tool-order")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert "v1" in data
    assert "v2" in data
    assert isinstance(data["v2"], list)
    assert len(data["v2"]) > 0
    assert "pipeline" not in data["v2"]


def test_index_injects_tool_order(flask_client):
    response = flask_client.get("/")
    assert response.status_code == 200
    assert b"toolOrder" in response.data
    assert b'"v2"' in response.data


def test_health_zeus_client_version(flask_client):
    response = flask_client.get("/api/health")
    assert response.status_code == 200
    body = response.get_json()
    assert body["status"] == "ok"
    assert body["app_version"]
    assert body["zeus_client_version"] == zeus_client.__version__
    assert str(body["zeus_client_version"]).startswith("2.4")
    assert body["client_import"] == "zeus_client"
    assert body["pipeline_envelope_recovery"] is True


_FORBIDDEN_ROOT_NAMES = {
    "run_agent",
    "load_config",
    "init_http",
    "close_http",
    "sync_chat_requests",
    "build_tool_order",
    "StructuredAgentResponse",
    "normalize_api_version",
    "resolve_llm_provider_config",
    "resolve_zeus_config",
}

_FORBIDDEN_MODULE_PREFIXES = (
    "zeus_client.compat",
    "zeus_client.agent",
    "zeus_client.zeus",
    "zeus_client_v2",
)


def test_no_v1_agent_import_in_travel_planner_package():
    """BFF package must not import V1 free functions or the zeus_client_v2 alias."""
    root = Path(__file__).resolve().parents[1] / "src" / "travel_planner"
    offenders: list[str] = []
    for path in root.rglob("*.py"):
        src = path.read_text(encoding="utf-8")
        tree = ast.parse(src, filename=str(path))
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    name = alias.name
                    if name == "zeus_client_v2" or name.startswith("zeus_client_v2."):
                        offenders.append(f"{path.name}: import {name}")
                    for prefix in _FORBIDDEN_MODULE_PREFIXES:
                        if name == prefix or name.startswith(prefix + "."):
                            offenders.append(f"{path.name}: import {name}")
            elif isinstance(node, ast.ImportFrom):
                mod = node.module or ""
                if mod == "zeus_client_v2" or mod.startswith("zeus_client_v2."):
                    offenders.append(f"{path.name}: from {mod} import ...")
                    continue
                for prefix in _FORBIDDEN_MODULE_PREFIXES:
                    if mod == prefix or mod.startswith(prefix + "."):
                        offenders.append(f"{path.name}: from {mod} import ...")
                if mod == "zeus_client":
                    for alias in node.names:
                        if alias.name in _FORBIDDEN_ROOT_NAMES:
                            offenders.append(
                                f"{path.name}: from zeus_client import {alias.name}"
                            )
    assert offenders == [], "Forbidden Zeus client imports remain:\n" + "\n".join(offenders)
