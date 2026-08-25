"""Tests for async_runner startup catalog sync (V2)."""

from __future__ import annotations

import asyncio
from types import SimpleNamespace

import pytest

from travel_planner.async_runner import _startup_async


@pytest.mark.parametrize("on_startup", [False, None, 0, ""])
def test_sync_on_startup_skipped_when_disabled(monkeypatch, on_startup):
    called: list[str] = []

    async def fake_sync():
        called.append("sync")
        return SimpleNamespace(synced=[], skipped=[], errors=[])

    monkeypatch.setattr(
        "travel_planner.runtime_factory.load_app_config_dict",
        lambda: {"chat_requests_sync": {"on_startup": on_startup}},
    )
    monkeypatch.setattr(
        "travel_planner.chat_store.load_chats_from_jsonl",
        lambda: None,
    )

    rt = SimpleNamespace(catalog=SimpleNamespace(sync=fake_sync))
    asyncio.run(_startup_async(rt))
    assert called == []


def test_sync_on_startup_runs_when_enabled(monkeypatch):
    called: list[str] = []

    async def fake_sync():
        called.append("sync")
        return SimpleNamespace(synced=[{"mode": "travel_booking"}], skipped=[], errors=[])

    monkeypatch.setattr(
        "travel_planner.runtime_factory.load_app_config_dict",
        lambda: {"chat_requests_sync": {"on_startup": True}},
    )
    monkeypatch.setattr(
        "travel_planner.chat_store.load_chats_from_jsonl",
        lambda: None,
    )

    rt = SimpleNamespace(catalog=SimpleNamespace(sync=fake_sync))
    asyncio.run(_startup_async(rt))
    assert called == ["sync"]


def test_sync_on_startup_logs_and_continues_on_failure(monkeypatch):
    async def failing_sync():
        raise RuntimeError("zeus unreachable")

    monkeypatch.setattr(
        "travel_planner.runtime_factory.load_app_config_dict",
        lambda: {"chat_requests_sync": {"on_startup": True}},
    )
    monkeypatch.setattr(
        "travel_planner.chat_store.load_chats_from_jsonl",
        lambda: None,
    )

    rt = SimpleNamespace(catalog=SimpleNamespace(sync=failing_sync))
    asyncio.run(_startup_async(rt))
