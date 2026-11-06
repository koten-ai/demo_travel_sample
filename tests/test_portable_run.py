"""ZD-27: beer-shaped env contract, secret-free config, and Compose file rules."""

from __future__ import annotations

import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

_SECRET_KEYS = frozenset({"password", "api_key", "bearer_token", "session_id"})


def _text(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8")


def _walk_no_inline_secrets(obj: object) -> None:
    if isinstance(obj, dict):
        for key, value in obj.items():
            assert key not in _SECRET_KEYS
            if isinstance(value, str):
                assert not value.startswith("xai-")
                assert not value.startswith("sk-")
            _walk_no_inline_secrets(value)
    elif isinstance(obj, list):
        for item in obj:
            _walk_no_inline_secrets(item)


def test_run_layout_mounts_env_readonly_and_bakes_config() -> None:
    dockerfile = _text("Dockerfile")
    compose = _text("docker-compose.yml")
    ignore = _text(".dockerignore")
    copy_lines = [line.strip() for line in dockerfile.splitlines() if line.strip().startswith("COPY")]
    assert any("config.json" in line for line in copy_lines)
    assert all(".env" not in line for line in copy_lines)
    assert "COPY .env" not in dockerfile
    assert "./.env:/app/.env:ro" in compose
    assert "env_file:" not in compose
    assert "./config.json:/app/config.json" not in compose
    assert "5050:5000" in compose
    assert "http://host.docker.internal:8080" in compose
    assert ".env" in ignore.splitlines()
    assert "config.json" not in ignore.splitlines()


def test_env_contract_keeps_secrets_out_of_committed_json() -> None:
    example = _text(".env.example")
    gitignore = _text(".gitignore")
    config = json.loads(_text("config.json"))
    assert _text("config.json") == _text("config.example.json")
    assert "ZEUS_URL=http://localhost:8080" in example
    assert "ZEUS_BUCKET=travel-sample" in example
    assert "ZEUS_SCOPE=inventory" in example
    assert "ZEUS_COLLECTION=hotel" in example
    assert "ZEUS_MODE=analytics" in example
    assert "ZEUS_AUTH_MODE=basic" in example
    assert "ZEUS_USERNAME=demo_1" in example
    assert "HOST=0.0.0.0" in example
    assert "PORT=5000" in example
    assert "LLM_BASE_URL=https://api.x.ai/v1" in example
    assert "LLM_MODEL=grok-4-1-fast-non-reasoning" in example
    assert "\nZEUS_PASSWORD=\n" in example or example.endswith("ZEUS_PASSWORD=\n") or "ZEUS_PASSWORD=\n" in example
    assert "LLM_API_KEY=\n" in example or example.endswith("LLM_API_KEY=")
    for line in example.splitlines():
        if line.startswith("ZEUS_PASSWORD="):
            assert line == "ZEUS_PASSWORD="
        if line.startswith("LLM_API_KEY="):
            assert line == "LLM_API_KEY="
    assert not any(line.startswith("ZEUS_BEARER_TOKEN=") for line in example.splitlines())
    assert "# ZEUS_BEARER_TOKEN=" in example
    ignore_lines = gitignore.splitlines()
    assert ".env" in ignore_lines
    assert "config.dev.json" in ignore_lines
    assert "config.json" not in ignore_lines
    assert config["zeus"]["password_env"] == "ZEUS_PASSWORD"
    assert config["zeus"]["auth_mode"] == "ZEUS_AUTH_MODE"
    assert config["zeus"]["username"] == "demo_1"
    assert config["llm"]["base_url"] == "LLM_BASE_URL"
    assert config["llm"]["model"] == "LLM_MODEL"
    assert config["llm"]["api_key_env"] == "LLM_API_KEY"
    assert config["settings"]["mode"] == "ZEUS_MODE"
    assert config["settings"]["durable_sessions"] is True
    assert config["session"]["semantic_cache"]["enabled"] is False
    assert config["client_floor"] == "client-floor-6.1"
    assert config["target"] == {
        "bucket": "travel-sample",
        "scope": "inventory",
        "collection": "hotel",
    }
    creds = config["zeus"]["scope_credentials"]["travel-sample/inventory"]
    assert creds["username"] == "demo_1"
    assert creds["password_env"] == "ZEUS_PASSWORD"
    assert "password" not in creds
    assert config["zeus"]["scope_contracts"]["travel-sample/inventory"]["analytics"]["contract_id"]
    assert config["chat_requests_sync"]["on_startup"] is True
    _walk_no_inline_secrets(config)


def test_dotenv_loads_key_and_password_and_keeps_preset_zeus_url(tmp_path, monkeypatch) -> None:
    (tmp_path / ".env").write_text(
        "ZEUS_URL=http://localhost:8080\nZEUS_PASSWORD=zeus-test-pw\nLLM_API_KEY=llm-test-key\n",
        encoding="utf-8",
    )
    monkeypatch.setattr("travel_planner.zeus_config.PROJECT_ROOT", tmp_path)
    monkeypatch.setenv("ZEUS_URL", "http://preset.example:8080")
    monkeypatch.delenv("ZEUS_PASSWORD", raising=False)
    monkeypatch.delenv("LLM_API_KEY", raising=False)

    from travel_planner.zeus_config import configure_paths

    configure_paths()
    assert os.environ["ZEUS_URL"] == "http://preset.example:8080"
    assert os.environ["ZEUS_PASSWORD"] == "zeus-test-pw"
    assert os.environ["LLM_API_KEY"] == "llm-test-key"


def test_password_containing_dollar_is_unchanged_after_load_dotenv(tmp_path, monkeypatch) -> None:
    password = "pa$$w0rd${DOLLAR}"
    (tmp_path / ".env").write_text(f"ZEUS_PASSWORD={password}\n", encoding="utf-8")
    monkeypatch.setattr("travel_planner.zeus_config.PROJECT_ROOT", tmp_path)
    monkeypatch.delenv("ZEUS_PASSWORD", raising=False)
    monkeypatch.delenv("DOLLAR", raising=False)

    from travel_planner.zeus_config import configure_paths

    configure_paths()
    assert os.environ["ZEUS_PASSWORD"] == password
