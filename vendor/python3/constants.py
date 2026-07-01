"""Paths, timeouts, and V2 verb ordering."""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = BASE_DIR / "config.json"
EXAMPLE_CONFIG_PATH = BASE_DIR / "config.example.json"
CHAT_REQ_DIR = BASE_DIR / "chat_requests"
CHAT_LOG_PATH = Path(os.environ.get("CHAT_LOG_PATH") or (BASE_DIR / "chats.jsonl"))
MAX_ROUNDS = 12
MAX_TOOLCALLS_PER_ROUND = 32
UPSTREAM_TIMEOUT = 90  # seconds — LLM round can be slow
TOOL_TIMEOUT = 60      # seconds — Zeus tool dispatch
AUTH_TIMEOUT = 20      # seconds — Zeus login / catalog load
PING_TIMEOUT = 5       # seconds — health probes

def normalize_api_version(v):
    return "v2" if str(v or "").lower() == "v2" else "v1"


# V2 verb x-axis for the trace frequency chart.
# Source: Zeus docs/API/V2/*.md (one page per verb; transforms.md →
# set/order/enrich/project). Left-to-right: cheap / first-contact →
# expensive / analytics (V2 cost model + WORK_DOCS.md §3).
V2_DOCS_VERB_ORDER = (
    "describe", "explain", "get", "find",
    "set", "order", "enrich", "project",
    "traverse", "pipeline", "search", "analyze", "return",
)
V2_DOCS_VERBS = frozenset(V2_DOCS_VERB_ORDER)
ZEUS_V2_DOCS_DIR = Path(
    os.environ.get("ZEUS_V2_DOCS") or (BASE_DIR.parent / "Zeus" / "docs" / "API" / "V2"))


def v2_verbs_from_docs_dir(docs_dir):
    """Return canonical V2 order when every docs/API/V2 verb page is present."""
    if not docs_dir.is_dir():
        return None
    md_verbs = set()
    for path in docs_dir.glob("*.md"):
        if path.name == "WORK_DOCS.md":
            continue
        if path.name == "transforms.md":
            md_verbs.update(("set", "order", "enrich", "project"))
            continue
        md_verbs.add(path.stem)
    if not V2_DOCS_VERBS.issubset(md_verbs):
        return None
    return list(V2_DOCS_VERB_ORDER)


def v2_tool_order():
    loaded = v2_verbs_from_docs_dir(ZEUS_V2_DOCS_DIR)
    return loaded if loaded else list(V2_DOCS_VERB_ORDER)

