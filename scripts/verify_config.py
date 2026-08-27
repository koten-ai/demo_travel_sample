#!/usr/bin/env python3
"""Verify scope_contracts bindings against on-disk catalog files (V2)."""
from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "src"))
sys.path.insert(0, str(REPO.parent / "zeus_client_python" / "src"))

from zeus_client import compute_contract_hash, extract_stamped_hash  # noqa: E402
from zeus_client.domain.catalog import resolve_catalog_path  # noqa: E402

from travel_planner.runtime_factory import build_runtime  # noqa: E402
from travel_planner.zeus_config import configure_paths  # noqa: E402

MODES = ["analytics"]
BUCKET, SCOPE = "travel-sample", "inventory"


def _status(ok: bool) -> str:
    return "PASS" if ok else "FAIL"


def _tools(doc: dict) -> list[str]:
    names: list[str] = []
    tools = doc.get("tools") if isinstance(doc.get("tools"), list) else []
    for t in tools[:10]:
        if isinstance(t, dict):
            fn = t.get("function") if isinstance(t.get("function"), dict) else t
            name = (fn or {}).get("name") if isinstance(fn, dict) else None
            if name:
                names.append(str(name))
    verbs = doc.get("verbs") if isinstance(doc.get("verbs"), list) else []
    if not names and verbs:
        names = [str(v) for v in verbs[:10]]
    return names


def _bound(contracts: dict, mode: str) -> tuple[str, str]:
    entry = contracts.get(f"{BUCKET}/{SCOPE}") or {}
    if not isinstance(entry, dict):
        return "", ""
    mode_ent = entry.get(mode) or {}
    if not isinstance(mode_ent, dict):
        return "", ""
    cid = str(mode_ent.get("contract_id") or mode_ent.get("id") or "").strip()
    ch = str(mode_ent.get("contract_hash") or mode_ent.get("hash") or "").strip()
    return cid, ch


async def main() -> int:
    configure_paths()
    rt = build_runtime()
    try:
        print("=== CONFIG BINDINGS ===")
        contracts = dict(rt.config.scope_contracts or {})
        for mode in MODES:
            cid, ch = _bound(contracts, mode)
            print(f"  {mode}: contract_id={cid}  hash={ch}")

        print("\n=== SYNC ===")
        try:
            result = await rt.catalog.sync()
            print(f"  synced: {len(result.synced)}  errors: {len(result.errors)}")
            for entry in result.synced:
                h = str(entry.get("hash") or "")[:22]
                print(f"    OK  {entry.get('mode')} -> {entry.get('path')} ({h}…)")
            for entry in result.errors:
                print(f"    ERR {entry.get('mode')}: {entry.get('error')}")
        except Exception as e:
            print(f"  SKIP  live sync failed ({e})")
            print("  continuing with on-disk catalogs only")

        print("\n=== CATALOG VERIFICATION ===")
        failures = 0
        chat_dir = Path(rt.config.chat_requests_dir or (REPO / "data" / "chat_requests"))
        for mode in MODES:
            print(f"\n--- {mode} ---")
            path = resolve_catalog_path(
                mode=mode,
                bucket=BUCKET,
                scope=SCOPE,
                user_dir=chat_dir,
            )
            cid_cfg, ch_cfg = _bound(contracts, mode)

            if path is None or not path.is_file():
                print(f"  FAIL  missing catalog for mode={mode!r} under {chat_dir}")
                failures += 1
                continue

            print(f"  file: {path}")
            doc = json.loads(path.read_text(encoding="utf-8"))
            stamped = extract_stamped_hash(doc)
            computed = compute_contract_hash(doc)
            file_cid = ((doc.get("contract") or {}).get("id") or "").strip()
            verbs = _tools(doc)

            authoritative = stamped or computed
            has_stamp = bool(stamped)
            hash_match = (not ch_cfg) or ch_cfg == authoritative
            id_match = (not file_cid) or (not cid_cfg) or (cid_cfg == file_cid)

            print(f"  stamped hash:     {stamped or 'MISSING'}")
            print(f"  computed hash:    {computed}")
            print(f"  config hash:      {ch_cfg}")
            print(f"  file contract.id: {file_cid or 'MISSING'}")
            print(f"  config contract:  {cid_cfg}")
            print(f"  [{_status(has_stamp)}] embedded stamp present")
            print(f"  [{_status(hash_match)}] config hash matches catalog")
            print(f"  [{_status(id_match)}] contract_id aligns")
            print(f"  verbs (first 10): {verbs}")

            if not has_stamp:
                failures += 1
            if not hash_match:
                failures += 1
                print(f"  FIX: set scope_contracts {BUCKET}/{SCOPE}/{mode}/contract_hash to:")
                print(f"       {authoritative}")

        print(f"\n=== OVERALL: {'PASS' if failures == 0 else f'FAIL ({failures} issue(s))'} ===")
        return 0 if failures == 0 else 1
    finally:
        await rt.aclose()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
