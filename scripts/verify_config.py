#!/usr/bin/env python3
"""Verify scope_contracts bindings against synced catalog files."""
from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO.parent / "zeus_client_python" / "src"))

from zeus_client import close_http, init_http, sync_chat_requests
from zeus_client.config import load_config, resolve_zeus_config
from zeus_client.contract_hash import compute_contract_hash, extract_stamped_hash
from zeus_client.zeus.catalog import chat_request_path, tools_from_chat_request
from zeus_client.zeus.contracts import resolve_contract_for_scope

MODES = ["travel_booking", "analytics"]
BUCKET, SCOPE = "travel-sample", "_default"


def _status(ok: bool) -> str:
    return "PASS" if ok else "FAIL"


async def main() -> int:
    cfg = await load_config()
    zcfg = resolve_zeus_config(cfg)

    print("=== CONFIG BINDINGS ===")
    for mode in MODES:
        cid, ch = resolve_contract_for_scope(zcfg, BUCKET, SCOPE, mode)
        print(f"  {mode}: contract_id={cid}  hash={ch}")

    print("\n=== SYNC (force) ===")
    await init_http()
    try:
        try:
            result = await sync_chat_requests(cfg, force=True)
            print(f"  synced: {len(result.synced)}  errors: {len(result.errors)}")
            for entry in result.synced:
                h = (entry.get("hash") or "")[:22]
                print(f"    OK  {entry.get('mode')} -> {entry.get('path')} ({h}…)")
            for entry in result.errors:
                print(f"    ERR {entry.get('mode')}: {entry.get('error')}")
        except Exception as e:
            print(f"  SKIP  live sync failed ({e})")
            print("  continuing with on-disk catalogs only")
    finally:
        await close_http()

    print("\n=== CATALOG VERIFICATION ===")
    failures = 0
    for mode in MODES:
        print(f"\n--- {mode} ---")
        path = chat_request_path("v2", mode, bucket=BUCKET, scope=SCOPE)
        cid_cfg, ch_cfg = resolve_contract_for_scope(zcfg, BUCKET, SCOPE, mode)

        if not path or not path.is_file():
            print(f"  FAIL  missing catalog at chat_request_path(..., mode={mode!r})")
            failures += 1
            continue

        print(f"  file: {path}")
        doc = json.loads(path.read_text(encoding="utf-8"))
        stamped = extract_stamped_hash(doc)
        computed = compute_contract_hash(doc)
        file_cid = ((doc.get("contract") or {}).get("id") or "").strip()
        verbs = [
            (t.get("function") or t).get("name")
            for t in tools_from_chat_request(doc)[:10]
        ]

        authoritative = stamped or computed
        has_stamp = bool(stamped)
        hash_match = ch_cfg == authoritative
        id_match = (not file_cid) or (cid_cfg == file_cid)

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
            print(f"  FIX: set scope_contracts travel-sample/_default/{mode}/contract_hash to:")
            print(f"       {authoritative}")

    print(f"\n=== OVERALL: {'PASS' if failures == 0 else f'FAIL ({failures} issue(s))'} ===")
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))