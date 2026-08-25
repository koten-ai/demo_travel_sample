"""Trace-panel tool axes — demo-owned (kit API_CONTRACT). Not a Zeus client API."""

from __future__ import annotations

# Direct V2 surface (pipeline is not on Direct). Agent may still use pipeline internally.
V2_TOOLS: list[str] = [
    "describe",
    "explain",
    "get",
    "find",
    "set",
    "order",
    "enrich",
    "project",
    "traverse",
    "search",
    "analyze",
    "return",
]

V1_TOOLS: list[str] = [
    "text_search",
    "get_by_keys",
    "find_nodes",
    "return_result",
]


def build_tool_order(_chats: dict | None = None) -> dict[str, list[str]]:
    """Return static {v1, v2} tool-order axes for the trace panel."""
    return {"v1": list(V1_TOOLS), "v2": list(V2_TOOLS)}
