"""Unit tests for runtime_factory (no live Zeus)."""

from __future__ import annotations

import asyncio
import json
import os

from travel_planner.runtime_factory import (
    REQUIRED_CLIENT_VERSION_PREFIX,
    build_runtime,
    build_runtime_config,
    secret_overlay_from_config,
)


def _not_in_docker(monkeypatch):
    orig = os.path.exists

    def exists(path):
        if str(path) == "/.dockerenv":
            return False
        return orig(path)

    monkeypatch.setattr("travel_planner.runtime_factory.os.path.exists", exists)


def _sentinel_travel_config(tmp_path) -> dict:
    """Beer-shaped document. Inline secrets must not be promoted."""
    return {
        "profile": "development",
        "client_floor": "client-floor-6.1",
        "chat_requests_dir": str(tmp_path / "chat_requests"),
        "zeus": {
            "url": "http://host.docker.internal:8080",
            "auth_mode": "ZEUS_AUTH_MODE",
            "username": "demo_1",
            "password_env": "ZEUS_PASSWORD",
            "password": "inline-pass",
            "enable_durable_sessions": True,
            "scope_credentials": {
                "travel-sample/inventory": {
                    "username": "demo_1",
                    "password_env": "ZEUS_PASSWORD",
                    "password": "scope-pass",
                }
            },
            "scope_contracts": {
                "travel-sample/inventory": {
                    "analytics": {
                        "contract_id": "analytics_v2",
                        "contract_hash": "md5:abc",
                    }
                }
            },
        },
        "target": {
            "bucket": "travel-sample",
            "scope": "inventory",
            "collection": "hotel",
        },
        "llm": {
            "provider": "xai",
            "base_url": "LLM_BASE_URL",
            "model": "LLM_MODEL",
            "api_key_env": "LLM_API_KEY",
            "api_key": "test-key",
        },
        "settings": {
            "mode": "ZEUS_MODE",
            "durable_sessions": True,
            "ai_process_result": False,
        },
        "session": {"semantic_cache": {"enabled": False}},
    }


def test_build_runtime_config_resolves_sentinels_and_skips_inline_secrets(tmp_path, monkeypatch):
    cfg = _sentinel_travel_config(tmp_path)
    monkeypatch.delenv("ZEUS_URL", raising=False)
    monkeypatch.setenv("ZEUS_AUTH_MODE", "basic")
    monkeypatch.setenv("ZEUS_MODE", "analytics")
    monkeypatch.setenv("LLM_BASE_URL", "https://llm.example/v1")
    monkeypatch.setenv("LLM_MODEL", "grok-test")
    _not_in_docker(monkeypatch)

    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.settings.mode == "analytics"
    assert rt_cfg.target.bucket == "travel-sample"
    assert rt_cfg.target.scope == "inventory"
    assert rt_cfg.target.collection == "hotel"
    assert rt_cfg.llm.provider == "xai"
    assert rt_cfg.llm.base_url == "https://llm.example/v1"
    assert rt_cfg.llm.model == "grok-test"
    assert rt_cfg.llm.api_key_env == "LLM_API_KEY"
    assert rt_cfg.zeus.password_env == "ZEUS_PASSWORD"
    assert rt_cfg.zeus.auth_mode == "basic"
    assert rt_cfg.zeus.url == "http://127.0.0.1:8080"
    assert rt_cfg.settings.ai_process_result is False
    assert rt_cfg.settings.ignore_user_tool_path_hints is True
    assert rt_cfg.semantic_cache.enabled is False
    assert rt_cfg.zeus.tls_verify is True
    assert rt_cfg.settings.durable_sessions is True
    assert rt_cfg.client_floor == "client-floor-6.1"
    assert rt_cfg.scope_contracts["travel-sample/inventory"]["analytics"]["contract_hash"] == "md5:abc"
    cred = rt_cfg.zeus.scope_credentials["travel-sample/inventory"]
    assert cred["username"] == "demo_1"
    assert cred["password_env"] == "ZEUS_PASSWORD"
    assert "password" not in cred
    overlay = secret_overlay_from_config(cfg)
    assert overlay == {}
    assert "test-key" not in overlay.values()
    assert "inline-pass" not in overlay.values()
    assert "scope-pass" not in overlay.values()


def test_inline_api_key_is_not_in_the_overlay(tmp_path, monkeypatch):
    cfg = _sentinel_travel_config(tmp_path)
    monkeypatch.delenv("ZEUS_URL", raising=False)
    monkeypatch.setenv("LLM_BASE_URL", "https://api.x.ai/v1")
    monkeypatch.setenv("LLM_MODEL", "grok-4-1-fast-non-reasoning")
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.llm.base_url == "https://api.x.ai/v1"
    assert rt_cfg.llm.api_key_env == "LLM_API_KEY"
    overlay = secret_overlay_from_config(cfg)
    assert "test-key" not in overlay.values()
    assert "LLM_API_KEY" not in overlay


def test_build_runtime_from_sentinel_config(tmp_path, monkeypatch):
    cfg = _sentinel_travel_config(tmp_path)
    (tmp_path / "chat_requests").mkdir()
    cfg_path = tmp_path / "config.json"
    cfg_path.write_text(json.dumps(cfg), encoding="utf-8")

    monkeypatch.delenv("ZEUS_URL", raising=False)
    monkeypatch.setenv("ZEUS_AUTH_MODE", "basic")
    monkeypatch.setenv("ZEUS_MODE", "analytics")
    monkeypatch.setenv("LLM_BASE_URL", "https://api.x.ai/v1")
    monkeypatch.setenv("LLM_MODEL", "grok-test")
    monkeypatch.setenv("ZEUS_CLIENT_CONFIG_DIR", str(tmp_path))
    _not_in_docker(monkeypatch)

    import travel_planner.runtime_factory as rf

    monkeypatch.setattr(rf, "config_path", lambda: cfg_path)
    monkeypatch.setattr(rf, "PROJECT_ROOT", tmp_path)

    rt = build_runtime(raw=cfg, profile="development")
    try:
        assert rt.config.settings.mode == "analytics"
        assert rt.config.target.bucket == "travel-sample"
        assert rt.config.llm.api_key_env == "LLM_API_KEY"
        assert rt.services.zeus is not None
        assert rt.services.llm is not None
        assert rt.services.catalog is not None
        assert getattr(rt.services, "catalog_remote", None) is not None
    finally:
        asyncio.run(rt.aclose())


def test_zeus_url_env_overrides_config_and_auth_mode(tmp_path, monkeypatch):
    cfg = _sentinel_travel_config(tmp_path)
    cfg["zeus"]["auth_mode"] = "basic"
    monkeypatch.setenv("ZEUS_URL", "http://zeus.example:8080")
    monkeypatch.setenv("ZEUS_AUTH_MODE", "bearer")
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.zeus.url == "http://zeus.example:8080"
    assert rt_cfg.zeus.auth_mode == "bearer"


def test_auth_mode_file_value_stays_when_zeus_url_unset(tmp_path, monkeypatch):
    cfg = _sentinel_travel_config(tmp_path)
    cfg["zeus"]["auth_mode"] = "basic"
    monkeypatch.delenv("ZEUS_URL", raising=False)
    monkeypatch.setenv("ZEUS_AUTH_MODE", "bearer")
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.zeus.auth_mode == "basic"


def test_client_floor_from_config_and_env(tmp_path, monkeypatch):
    cfg = _sentinel_travel_config(tmp_path)
    cfg["client_floor"] = "client-floor-6"
    monkeypatch.delenv("ZEUS_CLIENT_FLOOR", raising=False)
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.client_floor == "client-floor-6"
    monkeypatch.setenv("ZEUS_CLIENT_FLOOR", "client-floor-6.1")
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.client_floor == "client-floor-6.1"


def test_ai_process_result_can_be_enabled(tmp_path):
    cfg = _sentinel_travel_config(tmp_path)
    cfg["settings"] = {"ai_process_result": True, "mode": "travel_booking"}
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.settings.ai_process_result is True


def test_semantic_cache_opt_in(tmp_path):
    cfg = _sentinel_travel_config(tmp_path)
    cfg["session"] = {"semantic_cache": {"enabled": True}}
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.semantic_cache.enabled is True


def test_require_client_version_accepts_family_prefix():
    from travel_planner.runtime_factory import require_client_version

    ver = require_client_version()
    assert ver.startswith(REQUIRED_CLIENT_VERSION_PREFIX)


def test_require_client_version_needs_pipeline_envelope_recovery():
    from zeus_client.domain import layer_a

    from travel_planner.runtime_factory import require_client_version

    assert hasattr(layer_a, "parse_pipeline_envelope")
    assert require_client_version().startswith(REQUIRED_CLIENT_VERSION_PREFIX)


def test_build_runtime_middleware_is_security_then_observe(tmp_path, monkeypatch):
    from zeus_client.application.middleware import SecurityHooks

    from travel_planner.observe import ObserveMiddleware

    cfg = _sentinel_travel_config(tmp_path)
    (tmp_path / "chat_requests").mkdir()
    cfg_path = tmp_path / "config.json"
    cfg_path.write_text(json.dumps(cfg), encoding="utf-8")

    monkeypatch.delenv("ZEUS_URL", raising=False)
    monkeypatch.setenv("ZEUS_AUTH_MODE", "basic")
    monkeypatch.setenv("ZEUS_MODE", "analytics")
    monkeypatch.setenv("LLM_BASE_URL", "https://api.x.ai/v1")
    monkeypatch.setenv("LLM_MODEL", "grok-test")
    monkeypatch.setenv("ZEUS_CLIENT_CONFIG_DIR", str(tmp_path))
    _not_in_docker(monkeypatch)

    import travel_planner.runtime_factory as rf

    monkeypatch.setattr(rf, "config_path", lambda: cfg_path)
    monkeypatch.setattr(rf, "PROJECT_ROOT", tmp_path)

    rt = build_runtime(raw=cfg, profile="development")
    try:
        first = rt.agent
        second = rt.agent
        assert first is not second
        for api in (first, second):
            assert [item.name for item in api.middleware.items] == ["security", "observe"]
            assert isinstance(api.middleware.items[0], SecurityHooks)
            assert isinstance(api.middleware.items[1], ObserveMiddleware)
            assert api.middleware.items[1].critical is False
    finally:
        asyncio.run(rt.aclose())
