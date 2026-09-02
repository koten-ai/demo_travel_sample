"""V2 BFF search mapping tests (mocked ZeusRuntime)."""

from __future__ import annotations

from types import SimpleNamespace

from zeus_client import DebugBundle, SessionHandle, TurnResult, TurnStatus


def _fake_turn_result(**kwargs) -> TurnResult:
    defaults = dict(
        answer="Here are some great beach destinations.",
        status=TurnStatus.OK,
        structured=None,
        session=SessionHandle(session_id="sess_test", round=2, contract_status="match"),
        debug=DebugBundle(
            turn_id="turn_1",
            rounds=1,
            public_trace={
                "turn_id": "turn_1",
                "hops": [
                    {
                        "verb": "find",
                        "result_json": {
                            "rows": [
                                {
                                    "id": "dest_1",
                                    "name": "Nice",
                                    "description": "French Riviera",
                                    "entity_type": "Destination",
                                    "job_fingerprint": "drop-me",
                                }
                            ]
                        },
                    }
                ],
            },
            detective={"version": 1, "overview": {"headline": "ok"}},
            preferred_req_id="req-abc",
        ),
        error=None,
        messages=(),
    )
    defaults.update(kwargs)
    return TurnResult(**defaults)


def test_api_search_maps_turn_result(flask_client, monkeypatch):
    from travel_planner.turn_mapper import (
        results_waterfall,
        structured_response_payload,
        trace_payload,
        user_answer,
    )

    result = _fake_turn_result()
    answer = user_answer(result)
    trace = trace_payload(result)
    results = results_waterfall(result, trace, answer)

    payload = {
        "chat_id": "travel_test",
        "query": "warm beaches",
        "answer": answer,
        "structured_answer": {},
        "structured_response": structured_response_payload(result, zeus_data=[], answer=answer),
        "results": results,
        "trace": trace,
        "tool_order": {"v1": [], "v2": ["find", "search"]},
        "target": "travel-sample/_default/_default",
        "api_version": "v2",
        "mode": "travel_booking",
        "model": "test-model",
        "provider": "xai",
        "zeus_connection": "default",
        "zeus_url": "http://127.0.0.1:8080",
        "session_id": "sess_test",
        "session_round": 2,
        "contract_status": "match",
    }

    monkeypatch.setattr("travel_planner.app.run_search", lambda q, c=None, *, rewind=False: payload)

    response = flask_client.post("/api/search", json={"query": "warm beaches"})
    assert response.status_code == 200
    body = response.get_json()
    for key in (
        "chat_id",
        "query",
        "answer",
        "structured_answer",
        "structured_response",
        "results",
        "trace",
        "tool_order",
        "target",
        "api_version",
        "mode",
        "model",
        "provider",
        "zeus_connection",
        "zeus_url",
        "session_id",
        "session_round",
        "contract_status",
    ):
        assert key in body, f"missing {key}"
    assert body["mode"] == "travel_booking"
    assert body["session_id"] == "sess_test"
    assert body["trace"]["detective"]["version"] == 1
    assert body["trace"]["session"]["preferred_req_id"] == "req-abc"
    assert body["results"]
    assert body["results"][0]["name"] == "Nice"
    assert "job_fingerprint" not in body["results"][0]


def test_trace_payload_attaches_detective_not_in_answer():
    from travel_planner.turn_mapper import trace_payload, user_answer

    result = _fake_turn_result(answer="Beaches look great.")
    assert "wish_i_knew" not in user_answer(result)
    assert "detective" in trace_payload(result)


def test_run_search_async_uses_runtime(monkeypatch):
    """_search_async calls agent.run_turn and omits chat_request (load_for_turn)."""
    import asyncio

    from travel_planner import search as search_mod

    calls: dict[str, object] = {}

    async def fake_run_turn(message, **kwargs):
        calls["message"] = message
        calls["kwargs"] = kwargs
        return _fake_turn_result()

    fake_rt = SimpleNamespace(
        config=SimpleNamespace(
            target=SimpleNamespace(bucket="travel-sample", scope="_default", collection="_default"),
            settings=SimpleNamespace(mode="travel_booking", durable_sessions=True),
            llm=SimpleNamespace(model="m", provider="xai"),
            zeus=SimpleNamespace(url="http://127.0.0.1:8080"),
        ),
        agent=SimpleNamespace(run_turn=fake_run_turn),
    )

    monkeypatch.setattr(search_mod, "get_runtime", lambda: fake_rt)

    async def fake_persist(chat_id):
        return None

    monkeypatch.setattr(search_mod, "persist_chat", fake_persist)

    out = asyncio.run(search_mod._search_async("warm beaches", None))
    assert out["mode"] == "travel_booking"
    assert "warm beaches" in str(calls["message"])
    assert str(calls["message"]).startswith("Find travel destinations")
    assert calls["kwargs"]["enable_sessions"] is True
    assert calls["kwargs"]["rewind"] is False
    assert "chat_request" not in calls["kwargs"]
    assert out["rewind"] is False
    assert out["results"][0]["name"] == "Nice"


def test_run_search_async_passes_rewind(monkeypatch):
    """debug=true turns pass rewind=True into AgentAPI.run_turn."""
    import asyncio

    from travel_planner import search as search_mod

    calls: dict[str, object] = {}

    async def fake_run_turn(message, **kwargs):
        calls["kwargs"] = kwargs
        return _fake_turn_result()

    fake_rt = SimpleNamespace(
        config=SimpleNamespace(
            target=SimpleNamespace(bucket="travel-sample", scope="_default", collection="_default"),
            settings=SimpleNamespace(mode="analytics", durable_sessions=True),
            llm=SimpleNamespace(model="m", provider="xai"),
            zeus=SimpleNamespace(url="http://127.0.0.1:8080"),
        ),
        agent=SimpleNamespace(run_turn=fake_run_turn),
    )

    monkeypatch.setattr(search_mod, "get_runtime", lambda: fake_rt)

    async def fake_persist(chat_id):
        return None

    monkeypatch.setattr(search_mod, "persist_chat", fake_persist)

    out = asyncio.run(search_mod._search_async("airports in US", None, rewind=True))
    assert calls["kwargs"]["rewind"] is True
    assert out["rewind"] is True
    assert out["mode"] == "analytics"


def test_analytics_user_message_is_raw_query():
    from travel_planner.search import TRAVEL_PROMPT_PREFIX, user_message_for_mode

    raw = "give the list of airports in US"
    assert user_message_for_mode(raw, "analytics") == raw
    assert user_message_for_mode(raw, "travel_booking").startswith(TRAVEL_PROMPT_PREFIX)
    assert raw in user_message_for_mode(raw, "travel_booking")


def test_g2_not_in_ui_answer_or_cards():
    """API_LAYER_A / conformance g2_not_in_ui: detective and wish_i_knew stay off chat UI."""
    from zeus_client.domain.layer_a import LayerA

    from travel_planner.turn_mapper import (
        filter_row_by_schema,
        results_waterfall,
        trace_payload,
        user_answer,
    )

    dump = (
        '{"summary": "Nice beaches", "wish_i_knew": [{"q": "internal"}], '
        '"confidence": "high", "query_decomposition": {}, "decomposition": {}}'
    )
    result = _fake_turn_result(
        answer=dump,
        layer_a=LayerA(summary="Nice beaches", wish_i_knew=[{"q": "internal"}]),
        debug=DebugBundle(
            turn_id="turn_g2",
            rounds=1,
            public_trace={
                "hops": [
                    {
                        "verb": "find",
                        "result_json": {
                            "rows": [
                                {
                                    "id": "dest_1",
                                    "name": "Nice",
                                    "description": "French Riviera",
                                    "entity_type": "Destination",
                                    "wish_i_knew": [{"q": "internal"}],
                                    "jail_break_attempt": 0.9,
                                }
                            ]
                        },
                    }
                ],
            },
            detective={"version": 1, "overview": {"headline": "operator only"}},
            preferred_req_id="req-g2",
        ),
    )
    answer = user_answer(result)
    assert "wish_i_knew" not in answer
    assert "jail_break_attempt" not in answer
    assert "Nice beaches" in answer
    trace = trace_payload(result)
    assert "detective" in trace
    cards = results_waterfall(result, trace, answer)
    assert cards
    assert "wish_i_knew" not in cards[0]
    assert "jail_break_attempt" not in cards[0]
    filtered = filter_row_by_schema(
        {"name": "Nice", "wish_i_knew": [], "entity_type": "Destination"}
    )
    assert "wish_i_knew" not in filtered
