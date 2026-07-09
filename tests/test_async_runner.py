"""Tests for async_runner startup sync."""
import asyncio

import pytest

from travel_planner.async_runner import _sync_chat_requests_on_startup


@pytest.mark.parametrize(
    "on_startup",
    [False, None, 0, ""],
)
def test_sync_on_startup_skipped_when_disabled(monkeypatch, on_startup):
    called: list[object] = []

    def fake_run_coro(coro, timeout=600):
        called.append(coro)
        return asyncio.run(coro)

    monkeypatch.setattr("travel_planner.async_runner.run_coro", fake_run_coro)

    cfg = {"chat_requests_sync": {"on_startup": on_startup}}
    _sync_chat_requests_on_startup(cfg)

    assert called == []


def test_sync_on_startup_runs_when_enabled(monkeypatch):
    captured: list[dict] = []

    async def fake_sync(cfg):
        captured.append(cfg)
        from zeus_client.zeus.sync import SyncResult

        return SyncResult(synced=[{"mode": "travel_booking"}])

    monkeypatch.setattr("zeus_client.sync_chat_requests", fake_sync)

    def fake_run_coro(coro, timeout=600):
        return asyncio.run(coro)

    monkeypatch.setattr("travel_planner.async_runner.run_coro", fake_run_coro)

    cfg = {"chat_requests_sync": {"on_startup": True}}
    _sync_chat_requests_on_startup(cfg)

    assert captured == [cfg]


def test_sync_on_startup_logs_and_continues_on_failure(monkeypatch):
    async def failing_sync(cfg):
        raise RuntimeError("zeus unreachable")

    monkeypatch.setattr("zeus_client.sync_chat_requests", failing_sync)

    def fake_run_coro(coro, timeout=600):
        return asyncio.run(coro)

    monkeypatch.setattr("travel_planner.async_runner.run_coro", fake_run_coro)

    cfg = {"chat_requests_sync": {"on_startup": True}}
    _sync_chat_requests_on_startup(cfg)