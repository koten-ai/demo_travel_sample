"""Chat request catalog discovery and loading."""
import asyncio
import json
import re
from copy import deepcopy
from pathlib import Path

import httpx

from contract_hash import extract_stamped_hash
from python3.constants import (
    AUTH_TIMEOUT,
    CHAT_REQ_DIR,
    normalize_api_version,
)
from python3.http_client import client
from python3.logging_setup import logger

def list_chat_requests():
    """V2 catalogs only (Catalog page is V2-only now).

    Discovers:
    - "general" source: *.json directly under V2/
    - subdir sources: e.g. "by_use_case", "demo", "use_case" etc. under V2/<source>/
      (mirrors Zeus ai/V2/use_case/ style organization)

    Each entry gets a "source" key for the Catalog dropdown filtering.
    """
    out = []
    d = CHAT_REQ_DIR / "V2"
    if not d.exists():
        return out

    # Root files → source "general"
    for p in sorted(d.glob("*.json")):
        stem = p.stem
        if stem in ("chat_request", "chat_request_v2"):
            mode = "default"
        elif stem.startswith("chat_request_"):
            mode = stem[len("chat_request_"):]
            if mode.endswith("_v2"):
                mode = mode[:-3]
        else:
            mode = stem
        out.append({
            "api_version": "v2",
            "mode": mode,
            "file": f"V2/{p.name}",
            "source": "general"
        })

    # Subdirectories as named sources (e.g. by_use_case, demo, use_case)
    for sub in sorted([x for x in d.iterdir() if x.is_dir()]):
        src = sub.name
        for p in sorted(sub.glob("*.json")):
            stem = p.stem
            if stem in ("chat_request", "chat_request_v2"):
                mode = "default"
            elif stem.startswith("chat_request_"):
                mode = stem[len("chat_request_"):]
                if mode.endswith("_v2"):
                    mode = mode[:-3]
            else:
                mode = stem
            out.append({
                "api_version": "v2",
                "mode": mode,
                "file": f"V2/{src}/{p.name}",
                "source": src
            })

    return out


def chat_request_path(api_version, mode):
    api_version = normalize_api_version(api_version)
    subdir = CHAT_REQ_DIR / api_version.upper()
    if mode in (None, "", "default"):
        p = subdir / ("chat_request_v2.json" if api_version == "v2" else "chat_request.json")
        if p.exists():
            return p
    suffix = "_v2" if api_version == "v2" else ""
    candidate = f"chat_request_{mode}{suffix}.json"
    # Search recursively so sources in subdirs (use_case, by_use_case, demo, beer-sample, ...) are found
    for p in subdir.rglob("*.json"):
        if p.name == candidate or (mode == "default" and p.name in ("chat_request_v2.json", "chat_request.json")):
            return p
    # last resort
    p = subdir / ("chat_request_v2.json" if api_version == "v2" else "chat_request.json")
    return p if p.exists() else None


# ── Zeus auth ─────────────────────────────────────────────────────
async def invalidate_zeus_session(zeus_url, bucket, scope, user):
    """Drop a cached basic→session sid so the next resolve re-mints.
    Called when Zeus rejects a reused session (401)."""
    async with _SESSION_LOCK:
        _SESSION_CACHE.pop((zeus_url, bucket, scope, user), None)


async def resolve_zeus_auth(zeus_url, zcfg, bucket=None, scope=None, force=False):
    """Turn config's zeus.auth_mode into request headers for Zeus.
    Returns (headers, note). Raises RuntimeError on a failed login.

    NOTE: basic (username/password) login is now per-scope — Zeus
    authenticates the credential against `<bucket>.<scope>.zeus_users`,
    so the login must POST to /v1/{bucket}/{scope}/auth/session, not the
    old global /v1/auth/session (which now 401s for Basic). Because a
    user exists in exactly one scope, credentials are resolved per
    scope: `zeus.scope_credentials["<bucket>/<scope>"]` wins, otherwise
    the global `zeus.username`/`zeus.password` is used as a default.

    basic mode caches the minted session id and reuses it across turns
    (and across chats) so the expensive bcrypt login runs only once per
    session lifetime rather than on every request. Pass force=True to
    bypass the cache and re-mint (used by the 401 self-heal)."""
    mode = zcfg.get("auth_mode", "none")
    logger.debug(f"resolve_zeus_auth called: mode={mode}, bucket={bucket}, scope={scope}, force={force}")
    if mode == "none":
        logger.debug("auth mode=none (dev_no_auth)")
        return {}, "no auth (dev_no_auth)"
    if mode == "bearer":
        tok = (zcfg.get("bearer_token") or "").strip()
        if not tok:
            raise RuntimeError("bearer mode selected but bearer_token is empty")
        return {"Authorization": f"Bearer {tok}"}, "bearer token"
    if mode == "session":
        sid = (zcfg.get("session_id") or "").strip()
        if not sid:
            raise RuntimeError("session mode selected but session_id is empty")
        return {"X-Zeus-Session": sid}, "session id"
    if mode == "basic":
        if not bucket or not scope:
            logger.warning("basic auth requested but no bucket/scope provided — this will fail for per-scope logins")
            raise RuntimeError(
                "basic mode needs a bucket+scope: Zeus username/password "
                "login is per-scope (POST /v1/{bucket}/{scope}/auth/session)")
        # Credentials are per-scope (a user lives in exactly one scope's
        # zeus_users). Prefer a scope-specific entry keyed by
        # "<bucket>/<scope>"; fall back to the global zeus.username/password
        # (handy when the same admin was bootstrapped into every scope).
        scope_creds = (zcfg.get("scope_credentials") or {}).get(f"{bucket}/{scope}") or {}
        user = scope_creds.get("username") or zcfg.get("username") or ""
        pwd = scope_creds.get("password") or zcfg.get("password") or ""
        if not user:
            logger.error(f"no credentials found for scope {bucket}/{scope}")
            raise RuntimeError(
                f"no credentials for scope {bucket}/{scope}: add them under "
                f"zeus.scope_credentials['{bucket}/{scope}'] or zeus.username/password")

        cache_key = (zeus_url, bucket, scope, user)
        now = time.time()
        # Fast path: reuse a cached session that is comfortably within
        # both the sliding idle window and the absolute hard TTL. Every
        # authenticated request we make refreshes the idle window on
        # Zeus, so last_used is the right clock to compare against.
        if not force:
            async with _SESSION_LOCK:
                ent = _SESSION_CACHE.get(cache_key)
                if (ent and ent.get("pwd") == pwd
                        and now < ent["hard_deadline"]
                        and (now - ent["last_used"]) < (ent["idle_ttl"] - _SESSION_IDLE_MARGIN_S)):
                    ent["last_used"] = now
                    sid = ent["sid"]
                    return ({"X-Zeus-Session": sid},
                            f"basic→session {bucket}/{scope} {sid[:14]}… (cached)")

        logger.debug(f"performing basic login for {bucket}/{scope} user={user}")
        r = await client().post(
            f"{zeus_url}/v1/{bucket}/{scope}/auth/session",
            auth=(user, pwd), timeout=AUTH_TIMEOUT)
        if r.status_code != 200:
            logger.error(f"Zeus basic login failed for {bucket}/{scope}: {r.status_code} {r.text[:300]}")
            raise RuntimeError(f"Zeus login failed ({r.status_code}): {r.text[:300]}")
        body = r.json()
        sid = body.get("session_id", "")
        if not sid:
            logger.error("Zeus login returned no session_id")
            raise RuntimeError("Zeus login returned no session_id")
        logger.info(f"basic session obtained for {bucket}/{scope} sid={sid[:12]}… (cached for future calls)")
        # expires_in = sliding idle TTL (s); hard_ttl_s = absolute cap.
        # Default to 30 min / 12 h if Zeus omits them (matches its own
        # NewSessionService defaults).
        idle_ttl = float(body.get("expires_in") or 1800)
        hard_ttl = float(body.get("hard_ttl_s") or 43200)
        async with _SESSION_LOCK:
            _SESSION_CACHE[cache_key] = {
                "sid": sid, "pwd": pwd, "idle_ttl": idle_ttl,
                "hard_deadline": now + hard_ttl, "last_used": now,
            }
        return {"X-Zeus-Session": sid}, f"basic→session {bucket}/{scope} {sid[:14]}…"
    raise RuntimeError(f"unknown auth mode: {mode}")


# ── chat_request loading ──────────────────────────────────────────
def extract_scope_brief(chat_req):
    """Pull the live ## SCOPE BRIEF suffix out of a chat_request system prompt.

    For standardized v4 shape, also check instructions.system_prompt as a fallback
    (the assembler and some paths may store it there after normalization).
    """
    try:
        # Prefer messages[0] (common case)
        content = (chat_req.get("messages") or [{}])[0].get("content") or ""
        marker = "## SCOPE BRIEF"
        idx = content.find(marker)
        if idx >= 0:
            return content[idx:].strip()
        # Try instructions.system_prompt for v4 standardized shape
        instr = chat_req.get("instructions") or {}
        if isinstance(instr, dict):
            sp = instr.get("system_prompt") or ""
            idx = sp.find(marker)
            if idx >= 0:
                return sp[idx:].strip()
    except Exception:
        pass
    return ""


def merge_scope_brief(chat_req, brief):
    """Append a live scope brief to a bundled catalog's system message.

    For standardized 5TH/v4 shape (with top-level "instructions"), also keep
    instructions.system_prompt in sync so that MINI-SCHEMA / SCOPE BRIEF is
    visible no matter which copy the assembler or downstream code reads.
    """
    if not brief:
        return chat_req
    out = deepcopy(chat_req)
    messages = out.get("messages") or []
    if messages:
        current = messages[0].get("content") or ""
        if "## SCOPE BRIEF" not in current and "## MINI-SCHEMA" not in current:
            messages[0]["content"] = current.rstrip() + "\n\n" + brief.strip()
    # Standardized v4 shape support: also inject into instructions.system_prompt
    instr = out.get("instructions") or {}
    if isinstance(instr, dict):
        sp = instr.get("system_prompt") or ""
        if sp and "## SCOPE BRIEF" not in sp and "## MINI-SCHEMA" not in sp:
            instr["system_prompt"] = sp.rstrip() + "\n\n" + brief.strip()
            out["instructions"] = instr
    return out


# ---------------------------------------------------------------------------
# Mini-schema introspection + structured middle-man injection
#
# The runtime ## SCOPE BRIEF carries a ## MINI-SCHEMA block (per entity_type
# fields, FK pointers, example values) generated by the Zeus server from the
# scope's EntityMap. A middle-man operator wants to SEE that vocabulary before
# authoring a business-rule injection so the rule references REAL entity_types
# and fields (e.g. "for Beer, don't process beers from California with abv>7%")
# instead of guessing field names.
#
# get_mini_schema() parses that block into a structured dict. The reserved
# injection slot is guidance.injections.business_logic (advisory; excluded
# from the contract hash). inject_business_logic() writes grounded rules there,
# validating their entity_type/field references against the mini-schema, and
# apply_injected_business_logic() renders them into the system prompt AFTER the
# scope brief so they reach the LLM without changing the contract hash (the
# server + client _strip_scope_brief truncate everything after the brief
# marker before hashing).
# ---------------------------------------------------------------------------

_MINI_HEADER_RE = re.compile(r"^###\s+(?P<ent>.+?)\s+\(fields:\s*(?P<n>\d+)\)\s*$")
_MINI_FIELD_RE = re.compile(
    r"^\s+-\s+(?P<path>\S+)\s+(?P<kind>\S+)\s+\[(?P<idx>[^\]]+)\]"
    r"(?:\s+(?P<trailer>.*\S))?\s*$"
)
_MINI_INVERSE_RE = re.compile(
    r"^\s+\u2190\s+(?P<token>\S+)\s+\((?P<kind>[^)]+)\)\s+--\s+(?P<recipe>.*\S)?\s*$"
)
_FK_TO_RE = re.compile(r"fk_to=(\S+)")
_VIA_RE = re.compile(r"via=(\S+)")
_EX_RE = re.compile(r"ex:\s*(.+)$")

# Kinds that cannot be used in a `where` equality predicate (display rows are
# result-only; text_fts rows need fts/hybrid search instead of equality).
_NON_FILTERABLE_KINDS = {"display", "text_fts"}

# Heading used for the injected business-rules section. Matches the default
# guidance.assembler_hints.merge_business_logic_into in the standardized
# chat_request*.json so server and client agree on the section name.
INJECTED_BUSINESS_RULES_HEADING = "Additional Business Rules (injected by middle-man)"


def _system_prompt_text(chat_req):
    """Return the system-prompt text that carries the SCOPE BRIEF / MINI-SCHEMA.

    Prefers messages[0].content (the live, brief-merged copy); falls back to
    the standardized instructions.system_prompt.
    """
    content = ""
    try:
        content = (chat_req.get("messages") or [{}])[0].get("content") or ""
    except Exception:
        content = ""
    if "## MINI-SCHEMA" not in content and "## SCOPE BRIEF" not in content:
        instr = chat_req.get("instructions") or {}
        if isinstance(instr, dict):
            sp = instr.get("system_prompt") or ""
            if "## MINI-SCHEMA" in sp or "## SCOPE BRIEF" in sp:
                content = sp
    return content


def get_mini_schema(chat_req, values=False):
    """Parse the runtime MINI-SCHEMA out of a chat_request's SCOPE BRIEF.

    Lets a middle-man operator see exactly which entity_types and fields the AI
    is working against before authoring an injection.

    Args:
        chat_req: a loaded chat_request dict OR a path to a chat_request*.json.
        values:   when True, include each field's `ex:` example values (the
                  stored surface forms, e.g. "United Kingdom"); when False,
                  return structure only.

    Note:
        The MINI-SCHEMA is per-scope and only present AFTER the live scope brief
        has been merged (see load_chat_request / merge_scope_brief). A bundled
        on-disk file with no brief yet returns empty `entity_types`.

    Returns:
        {
          "scope": "beer-sample/_default" | "",
          "mode":  "auto" | "",
          "entity_types": {
            "Beer": {
              "field_count": 8,
              "fields": {
                "abv": {"kind": "number", "indexed": "gsi", "filterable": True},
                "brewery_id": {"kind": "entity_fk", "indexed": "gsi",
                               "filterable": True, "fk_to": "Brewery",
                               "examples": ["coopers_brewery"]},  # if values=True
                ...
              },
              "inverse_fks": [
                {"from_entity": "Beer", "from_path": "brewery_id",
                 "kind": "entity_fk"}
              ],
            },
            ...
          },
        }
    """
    if isinstance(chat_req, (str, Path)):
        chat_req = json.loads(Path(chat_req).read_text())

    out = {"scope": "", "mode": "", "entity_types": {}}
    content = _system_prompt_text(chat_req)
    if not content:
        return out

    m = re.search(r"^scope:\s+(\S+)", content, re.MULTILINE)
    if m:
        out["scope"] = m.group(1)
    m = re.search(r"^mode:\s+(\S+)", content, re.MULTILINE)
    if m:
        out["mode"] = m.group(1)

    # Slice the MINI-SCHEMA block: from its header to the next "## " top-level
    # section (e.g. "## WALK_PATHS") or the end of the brief.
    start = content.find("## MINI-SCHEMA")
    if start < 0:
        return out
    rest = content[start:]
    nxt = re.search(r"\n##\s+(?!MINI-SCHEMA)", rest)
    block = rest[: nxt.start()] if nxt else rest

    cur = None
    in_inverse = False
    for line in block.splitlines():
        hm = _MINI_HEADER_RE.match(line)
        if hm:
            cur = hm.group("ent")
            out["entity_types"][cur] = {
                "field_count": int(hm.group("n")),
                "fields": {},
                "inverse_fks": [],
            }
            in_inverse = False
            continue
        if cur is None:
            continue
        if line.strip() == "inverse_fks:":
            in_inverse = True
            continue
        if in_inverse:
            im = _MINI_INVERSE_RE.match(line)
            if im:
                ent, _, path = im.group("token").partition(".")
                out["entity_types"][cur]["inverse_fks"].append({
                    "from_entity": ent,
                    "from_path": path,
                    "kind": im.group("kind"),
                })
            continue
        fm = _MINI_FIELD_RE.match(line)
        if fm:
            kind = fm.group("kind")
            idx = fm.group("idx")
            field = {
                "kind": kind,
                "indexed": idx,
                "filterable": kind not in _NON_FILTERABLE_KINDS and idx not in ("none", ""),
            }
            trailer = fm.group("trailer") or ""
            fk = _FK_TO_RE.search(trailer)
            if fk:
                field["fk_to"] = fk.group(1)
            via = _VIA_RE.search(trailer)
            if via:
                field["via"] = via.group(1)
            if trailer.lstrip().startswith("--"):
                field["note"] = trailer.lstrip()[2:].strip()
            if values:
                ex = _EX_RE.search(trailer)
                if ex:
                    field["examples"] = [
                        e.strip() for e in ex.group(1).split(",") if e.strip()
                    ]
            out["entity_types"][cur]["fields"][fm.group("path")] = field
    return out


# camelCase alias to match the requested call site: getMiniSchema(values=...).
getMiniSchema = get_mini_schema


def _validate_rule_against_schema(entry, schema):
    """Raise ValueError if a structured rule references an unknown entity_type
    or field. Free-form rules (no entity_type) are not checked. If no
    MINI-SCHEMA is present (brief not merged yet) validation is skipped so the
    call still works against a bundled on-disk file.
    """
    ets = (schema or {}).get("entity_types") or {}
    et = entry.get("entity_type")
    if et is None or not ets:
        return
    if et not in ets:
        raise ValueError(
            f"business rule references unknown entity_type {et!r}; "
            f"valid types: {sorted(ets)}"
        )
    known = ets[et].get("fields") or {}
    bad = [f for f in (entry.get("fields") or []) if f not in known]
    if bad:
        raise ValueError(
            f"business rule for {et!r} references unknown field(s) {bad}; "
            f"valid fields: {sorted(known)}"
        )


def inject_business_logic(chat_req, *rules, validate=True):
    """Add operator business rule(s) into the reserved injection slot
    (guidance.injections.business_logic).

    This slot is ADVISORY and excluded from the contract hash (see
    contract_hash._strip_for_hash / the v4 _hash_policy), so injecting here
    never breaks contract binding.

    Each rule may be:
      * a plain string -> stored as {"rule": "<text>"}
      * a dict         -> stored as-is. When it carries "entity_type" and/or
                          "fields" and validate=True, those references are
                          checked against the live MINI-SCHEMA so a typo'd
                          entity_type or non-existent field is caught early.

    Example:
        chat_req = inject_business_logic(chat_req, {
            "entity_type": "Beer",
            "fields": ["abv"],
            "rule": "Do not process beers from California with abv > 7%.",
        })

    Returns a deepcopy of chat_req with the rule(s) appended.
    """
    out = deepcopy(chat_req)
    bl = (
        out.setdefault("guidance", {})
        .setdefault("injections", {})
        .setdefault("business_logic", [])
    )
    schema = get_mini_schema(out, values=False) if validate else None
    for rule in rules:
        if isinstance(rule, str):
            entry = {"rule": rule}
        elif isinstance(rule, dict):
            entry = dict(rule)
            if validate:
                _validate_rule_against_schema(entry, schema)
        else:
            raise TypeError(
                f"business rule must be str or dict, got {type(rule).__name__}"
            )
        # Give every rule a stable id so both the AI's self-report and the
        # operator's deterministic audit can refer to the same rule.
        if not entry.get("id"):
            entry["id"] = f"r{len(bl) + 1}"
        bl.append(entry)
    return out


def compliance_report_enabled(chat_req):
    """Whether the AI should self-report rule compliance. Default OFF so the AI
    does less work on normal turns. Turn it on explicitly for debugging/audit:

        chat_req["guidance"]["injections"]["report_compliance"] = True

    Debug mode (guidance.debug=True) implies it on, since debug already asks the
    AI to explain itself.
    """
    guidance = chat_req.get("guidance") or {}
    flag = (guidance.get("injections") or {}).get("report_compliance")
    if flag is not None:
        return bool(flag)
    return bool(guidance.get("debug"))


def render_injected_business_logic(chat_req):
    """Render guidance.injections.business_logic into a markdown section the LLM
    can read. Returns "" when there are no injected rules. The heading matches
    guidance.assembler_hints.merge_business_logic_into when present.

    The per-rule self-report instruction is appended ONLY when
    compliance_report_enabled(chat_req) is true (default OFF).
    """
    guidance = chat_req.get("guidance") or {}
    rules = (guidance.get("injections") or {}).get("business_logic") or []
    if not rules:
        return ""
    heading = (guidance.get("assembler_hints") or {}).get(
        "merge_business_logic_into"
    ) or INJECTED_BUSINESS_RULES_HEADING
    lines = [f"## {heading}", ""]
    for i, r in enumerate(rules):
        if isinstance(r, str):
            rid = f"r{i + 1}"
            lines.append(f"- ({rid}) {r}")
        elif isinstance(r, dict):
            rid = r.get("id") or f"r{i + 1}"
            text = r.get("rule") or r.get("text") or json.dumps(r, sort_keys=True)
            et = r.get("entity_type")
            lines.append(f"- ({rid}) {f'[{et}] ' if et else ''}{text}")
    # OPTIONAL (default OFF): ask the AI to self-report what it did with each
    # rule. Off keeps the AI's output lean; on gives a human-readable
    # "I produced Z because of rule Y / I removed X" for debugging/audit.
    # (Layer 2, audit_rows_against_rules(), is unaffected by this flag — it runs
    # in operator code and costs the AI nothing, so use it any time for trust.)
    if compliance_report_enabled(chat_req):
        lines += [
            "",
            "When you produce your final answer, append a `rule_compliance` block. "
            "For EACH rule id above, state one of: `applied` (you enforced it and what "
            "you changed/removed, with counts), `not_triggered` (no matching data this "
            "turn), or `cannot_comply` (and why). Be specific, e.g. "
            "\"(r1) applied — removed 3 California beers with abv > 7%\".",
        ]
    return "\n".join(lines)


def apply_injected_business_logic(chat_req):
    """Splice the rendered business-rules section into the system prompt so the
    injected rules actually reach the LLM.

    Hash safety: the section is appended only when a ## SCOPE BRIEF / ##
    MINI-SCHEMA marker is already present, so it always lands AFTER that marker.
    Both the server and client _strip_scope_brief truncate content at the brief
    marker before hashing, so the appended rules are excluded from the contract
    hash on both sides — binding stays stable with no Go changes. (The rules
    also live in guidance.injections.business_logic, which is excluded outright.)

    Returns a deepcopy with the section spliced, or the original chat_req
    unchanged when there are no rules or no brief marker is present.
    """
    section = render_injected_business_logic(chat_req)
    if not section:
        return chat_req
    heading_line = section.splitlines()[0]
    block = "\n\n" + section
    out = deepcopy(chat_req)

    def _splice(text):
        # Only append after a brief marker so the strip-for-hash truncation
        # covers it; skip (return unchanged) otherwise to avoid hash drift.
        if not text or ("## SCOPE BRIEF" not in text and "## MINI-SCHEMA" not in text):
            return text
        if heading_line in text:
            return text
        return text.rstrip() + block

    messages = out.get("messages") or []
    if messages:
        messages[0]["content"] = _splice(messages[0].get("content") or "")
    instr = out.get("instructions")
    if isinstance(instr, dict) and instr.get("system_prompt"):
        instr["system_prompt"] = _splice(instr["system_prompt"])
    return out


# --- Deterministic compliance audit (the "trust" layer) --------------------
#
# The AI's `rule_compliance` self-report (rendered above) is the AI's WORD and
# can be wrong. To actually KNOW the output obeyed a rule, give the rule a
# machine-checkable `deny_when` predicate and run audit_rows_against_rules()
# over the rows Zeus returned (captured by the operator in a `zeus_result` /
# `final_answer` hook). This runs in YOUR code, so the AI cannot fake it.
#
# Predicate grammar for `deny_when` (a row is a VIOLATION when ALL clauses match):
#   {"state": "California"}              -> row["state"] == "California"
#   {"abv": {">": 7}}                    -> row["abv"] > 7   (also >=, <, <=, ==, !=, in)
#   {"state": "California", "abv": {">": 7}}  -> both must hold (AND)
# Use `require` for the inverse (every row MUST match; non-matching = violation).

_OPS = {
    ">": lambda a, b: a is not None and a > b,
    ">=": lambda a, b: a is not None and a >= b,
    "<": lambda a, b: a is not None and a < b,
    "<=": lambda a, b: a is not None and a <= b,
    "==": lambda a, b: a == b,
    "!=": lambda a, b: a != b,
    "in": lambda a, b: a in b,
}


def _clause_matches(row, field, cond):
    val = row.get(field)
    if isinstance(cond, dict):
        for op, target in cond.items():
            fn = _OPS.get(op)
            if fn is None:
                raise ValueError(f"unknown predicate op {op!r} in rule")
            try:
                if not fn(val, target):
                    return False
            except TypeError:
                return False  # type mismatch -> clause does not match
        return True
    return val == cond


def _row_matches(row, predicate):
    return all(_clause_matches(row, f, c) for f, c in predicate.items())


def audit_rows_against_rules(rows, rules):
    """Deterministically check returned rows against injected rules.

    Only rules carrying a machine-checkable `deny_when` (forbidden rows) or
    `require` (mandatory shape) predicate are audited; free-text rules are
    reported as `unverifiable` (you must check those by reading the answer or
    the AI's self-report).

    Returns a list of per-rule results:
      {"id","status": "ok"|"violation"|"unverifiable",
       "checked": N, "violations": [<row>...], "rule": "<text>"}
    """
    if isinstance(rules, dict):  # accept a whole chat_req
        rules = (rules.get("guidance", {}).get("injections", {}) or {}).get(
            "business_logic", []
        ) or []
    rows = rows or []
    out = []
    for i, r in enumerate(rules):
        if isinstance(r, str):
            r = {"rule": r}
        rid = r.get("id") or f"r{i + 1}"
        text = r.get("rule") or r.get("text") or ""
        deny = r.get("deny_when")
        req = r.get("require")
        if not deny and not req:
            out.append({"id": rid, "status": "unverifiable",
                        "checked": len(rows), "violations": [], "rule": text})
            continue
        bad = []
        for row in rows:
            if deny and _row_matches(row, deny):
                bad.append(row)
            elif req and not _row_matches(row, req):
                bad.append(row)
        out.append({
            "id": rid,
            "status": "violation" if bad else "ok",
            "checked": len(rows),
            "violations": bad,
            "rule": text,
        })
    return out


def _normalize_chat_request_shape(doc: dict) -> dict:
    """Support the standardized 5TH contract shape (top-level 'verbs' + 'instructions' + 'messages').
    After this, the rest of the middle-man sees a dict with 'messages' and 'tools'.
    (No legacy flat shape support needed.)
    """
    if not isinstance(doc, dict):
        return doc
    # Standardized 5TH shape
    if "verbs" in doc and "tools" not in doc:
        doc = dict(doc)  # shallow is enough; we don't mutate the original on disk
        doc["tools"] = doc.get("verbs") or []
        doc["_normalized_from_verbs"] = True
        # Optional: if someone wants the instructions visible in traces
        if "instructions" in doc and "_instructions" not in doc:
            doc["_instructions"] = doc["instructions"]
    return doc


async def load_live_v1_chat_request(zeus_url, mode, bucket, scope, zeus_headers):
    params = {"mode": mode}
    if bucket and scope:
        params["scope"] = f"{bucket}/{scope}"
    r = await client().get(f"{zeus_url}/v1/ai/chat_request.json", params=params,
                           headers=zeus_headers, timeout=AUTH_TIMEOUT)
    if r.status_code != 200:
        raise RuntimeError(f"HTTP {r.status_code}")
    return r.json()


async def load_chat_request(zeus_url, api_version, mode, bucket, scope, zeus_headers):
    """Prefer the live catalog from Zeus (includes the per-scope SCOPE
    BRIEF + kill-switch filtering). Fall back to the bundled snapshot."""
    api_version = normalize_api_version(api_version)
    logger.debug(f"load_chat_request: api={api_version} mode={mode} sample={bucket}/{scope}")
    live_err = "not attempted"
    live_v1 = None
    if api_version == "v1":
        try:
            cat, src = await load_live_v1_chat_request(zeus_url, mode, bucket, scope, zeus_headers), "live from Zeus"
            logger.debug(f"loaded live V1 catalog (len={len(str(cat))} chars) source={src}")
            return cat, src
        except (RuntimeError, httpx.HTTPError) as e:
            live_err = str(e)
            logger.warning(f"live V1 catalog load failed: {live_err}")
    else:
        # Zeus currently exposes live scope-brief injection on the V1
        # chat_request route. The V2 verb catalog is bundled, so borrow only
        # the live SCOPE BRIEF suffix from V1 and splice it onto the V2 system
        # prompt. This gives V2 the same MINI-SCHEMA the admin chat sees while
        # preserving the V2 verb tool list.
        try:
            live_v1 = await load_live_v1_chat_request(zeus_url, mode, bucket, scope, zeus_headers)
            live_err = "borrowed live V1 scope brief"
            logger.debug("borrowed live V1 SCOPE BRIEF for V2")
        except (RuntimeError, httpx.HTTPError) as e:
            live_v1 = None
            live_err = str(e)
            logger.debug(f"could not borrow live V1 brief: {live_err}")

    path = chat_request_path(api_version, mode)
    if not path:
        raise RuntimeError(f"no {api_version.upper()} chat_request file for mode '{mode}'")
    # Bundled files are tiny + read once per turn; to_thread keeps the
    # loop free even on a slow/networked filesystem.
    bundled = await asyncio.to_thread(lambda: json.loads(path.read_text()))
    bundled = _normalize_chat_request_shape(bundled)
    embedded_h = extract_stamped_hash(bundled)  # this already rejects TO_BE_FILLED placeholders
    has_contract = bool(embedded_h)
    logger.info(f"loaded bundled catalog from {path.name} (has_embedded_contract={has_contract})")
    if "_format" in bundled or "verbs" in bundled and "tools" not in bundled:
        # New standardized shape (5TH contract work). The normalizer already
        # turned verbs -> tools for the LLM call and for traces.
        pass
    if api_version == "v2" and live_v1:
        brief = extract_scope_brief(live_v1)
        if brief:
            return merge_scope_brief(bundled, brief), f"bundled ({path.relative_to(CHAT_REQ_DIR)}) + live scope brief from V1"
        live_err = "live V1 had no SCOPE BRIEF"
    return bundled, f"bundled ({path.relative_to(CHAT_REQ_DIR)}; live: {live_err})"


def chat_request_filename(mode: str) -> str:
    """On-disk filename for a bootstrap-fetched chat_request mode."""
    m = (mode or "default").strip() or "default"
    if m == "default":
        return "chat_request_v2.json"
    return f"chat_request_{m}_v2.json"


def modes_to_bootstrap(cfg: dict, bucket: str, scope: str) -> list[str]:
    """Union of bundled general modes and scope_contracts keys for the target scope."""
    from python3.config import resolve_zeus_config

    modes: set[str] = {"default"}
    scope_key = f"{bucket}/{scope}"
    entry = resolve_zeus_config(cfg)
    contracts = (entry.get("scope_contracts") or {}).get(scope_key) or {}
    for key in contracts:
        if key:
            modes.add(str(key))
    for item in list_chat_requests():
        if item.get("source") != "general":
            continue
        rel = (item.get("file") or "").replace("V2/", "", 1)
        if "/" in rel:
            continue
        modes.add(item.get("mode") or "default")
    return sorted(modes, key=lambda m: (0 if m == "default" else 1, m))


async def fetch_scope_bootstrap(zeus_url: str, bucket: str, scope: str, zeus_headers: dict) -> dict:
    """GET /v1/ai/bootstrap/scope/{bucket}/{scope} — wizard primary bootstrap fetch."""
    url = f"{zeus_url.rstrip('/')}/v1/ai/bootstrap/scope/{bucket}/{scope}"
    r = await client().get(url, headers=zeus_headers, timeout=AUTH_TIMEOUT)
    if r.status_code != 200:
        raise RuntimeError(f"bootstrap HTTP {r.status_code}: {r.text[:300]}")
    return r.json()


async def fetch_scope_chat_request(
    zeus_url: str, bucket: str, scope: str, mode: str, zeus_headers: dict,
) -> dict:
    """GET /v1/ai/chat_request.json for a specific scope + mode."""
    params: dict[str, str] = {"scope": f"{bucket}/{scope}"}
    if mode and mode != "default":
        params["mode"] = mode
    r = await client().get(
        f"{zeus_url.rstrip('/')}/v1/ai/chat_request.json",
        params=params,
        headers=zeus_headers,
        timeout=AUTH_TIMEOUT,
    )
    if r.status_code != 200:
        raise RuntimeError(f"chat_request HTTP {r.status_code}: {r.text[:300]}")
    return r.json()
