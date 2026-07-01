"""Zeus Python sample client package."""
from python3.agent.hooks import AgentDecision, AgentHooks
from python3.agent.loop import run_agent
from python3.config import load_config, save_config
from python3.zeus.catalog import load_chat_request
from python3.zeus.contracts import resolve_contract_for_scope


def __getattr__(name: str):
    if name == "app":
        from python3.main import app

        return app
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


__all__ = [
    "app",
    "run_agent",
    "AgentHooks",
    "AgentDecision",
    "load_config",
    "save_config",
    "load_chat_request",
    "resolve_contract_for_scope",
]