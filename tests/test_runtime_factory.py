"""Unit tests for runtime_factory (no live Zeus)."""

from __future__ import annotations

import asyncio
import json
import os

from travel_planner.runtime_factory import (
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


def _nested_travel_config(tmp_path) -> dict:
    return {
        "zeus": {
            "url": "http://host.docker.internal:8080",
            "auth_mode": "basic",
            "username": "demo_1",
            "password": "inline-pass",
            "enable_durable_sessions": True,
            "scope_credentials": {
                "travel-sample/_default": {
                    "username": "demo_1",
                    "password": "scope-pass",
                }
            },
            "scope_contracts": {
                "travel-sample/_default": {
                    "travel_booking": {
                        "contract_id": "travel_booking_v2",
                        "contract_hash": "md5:abc",
                    }
                }
            },
        },
        "llm_provider": {
            "label": "xAI Grok",
            "base_url": "https://api.x.ai/v1",
            "api_key": "test-key",
            "models": ["grok-test"],
        },
        "default_mode": "travel_booking",
        "default_sample": "travel-sample",
        "samples": {
            "travel-sample": {
                "bucket": "travel-sample",
                "scope": "_default",
                "collection": "_default",
            }
        },
        "chat_requests_dir": str(tmp_path / "chat_requests"),
    }


def test_build_runtime_config_maps_nested_travel_shape(tmp_path, monkeypatch):
    cfg = _nested_travel_config(tmp_path)
    monkeypatch.delenv("ZEUS_URL", raising=False)
    _not_in_docker(monkeypatch)

    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.settings.mode == "travel_booking"
    assert rt_cfg.target.bucket == "travel-sample"
    assert rt_cfg.llm.provider == "xai"
    assert rt_cfg.llm.model == "grok-test"
    assert rt_cfg.llm.api_key_env == "XAI_API_KEY"
    assert rt_cfg.zeus.password_env == "ZEUS_PASSWORD"
    assert rt_cfg.zeus.url == "http://127.0.0.1:8080"
    assert rt_cfg.settings.ai_process_result is False
    assert rt_cfg.settings.ignore_user_tool_path_hints is True
    assert rt_cfg.semantic_cache.enabled is False
    assert rt_cfg.zeus.tls_verify is True
    assert rt_cfg.settings.durable_sessions is True
    assert rt_cfg.client_floor == "client-floor-6.1"
    overlay = secret_overlay_from_config(cfg)
    assert overlay["XAI_API_KEY"] == "test-key"
    assert overlay["ZEUS_PASSWORD"] == "inline-pass"
    assert overlay["ZEUS_SCOPE_PASSWORD_TRAVEL_SAMPLE__DEFAULT"] == "scope-pass"


def test_build_runtime_from_nested_config(tmp_path, monkeypatch):
    cfg = _nested_travel_config(tmp_path)
    (tmp_path / "chat_requests").mkdir()
    cfg_path = tmp_path / "config.json"
    cfg_path.write_text(json.dumps(cfg), encoding="utf-8")

    monkeypatch.delenv("ZEUS_URL", raising=False)
    monkeypatch.setenv("ZEUS_CLIENT_CONFIG_DIR", str(tmp_path))
    _not_in_docker(monkeypatch)

    import travel_planner.runtime_factory as rf

    monkeypatch.setattr(rf, "config_path", lambda: cfg_path)
    monkeypatch.setattr(rf, "PROJECT_ROOT", tmp_path)

    rt = build_runtime(raw=cfg, profile="development")
    try:
        assert rt.config.settings.mode == "travel_booking"
        assert rt.config.target.bucket == "travel-sample"
        assert rt.config.llm.api_key_env == "XAI_API_KEY"
        assert rt.services.zeus is not None
        assert rt.services.llm is not None
        assert rt.services.catalog is not None
        assert getattr(rt.services, "catalog_remote", None) is not None
    finally:
        asyncio.run(rt.aclose())


def test_zeus_url_env_overrides_config(tmp_path, monkeypatch):
    cfg = _nested_travel_config(tmp_path)
    monkeypatch.setenv("ZEUS_URL", "http://zeus.example:8080")
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.zeus.url == "http://zeus.example:8080"


def test_client_floor_from_config_and_env(tmp_path, monkeypatch):
    cfg = _nested_travel_config(tmp_path)
    cfg["client_floor"] = "client-floor-6"
    monkeypatch.delenv("ZEUS_CLIENT_FLOOR", raising=False)
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.client_floor == "client-floor-6"
    monkeypatch.setenv("ZEUS_CLIENT_FLOOR", "client-floor-6.1")
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.client_floor == "client-floor-6.1"


def test_ai_process_result_can_be_enabled(tmp_path):
    cfg = _nested_travel_config(tmp_path)
    cfg["settings"] = {"ai_process_result": True, "mode": "travel_booking"}
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.settings.ai_process_result is True


def test_semantic_cache_opt_in(tmp_path):
    cfg = _nested_travel_config(tmp_path)
    cfg["session"] = {"semantic_cache": {"enabled": True}}
    rt_cfg = build_runtime_config(raw=cfg, profile="development")
    assert rt_cfg.semantic_cache.enabled is True


def test_require_client_version_accepts_2_4():
    from travel_planner.runtime_factory import require_client_version

    ver = require_client_version()
    assert ver.startswith("2.4")


def test_require_client_version_needs_pipeline_envelope_recovery():
    from zeus_client.domain import layer_a

    from travel_planner.runtime_factory import require_client_version

    assert hasattr(layer_a, "parse_pipeline_envelope")
    assert require_client_version().startswith("2.4")
