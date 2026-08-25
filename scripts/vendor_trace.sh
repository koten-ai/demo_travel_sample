#!/usr/bin/env bash
# Copy a pinned zeus_client_chat_trace build into TravelPlan static assets.
# Does not use CDN latest.
#
#   ./scripts/vendor_trace.sh
#   TRACE_SRC=/path/to/zeus_client_chat_trace ./scripts/vendor_trace.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${TRACE_SRC:-$ROOT/../zeus_client_chat_trace}"
DEST="$ROOT/src/travel_planner/static"
SKIP_BUILD="${SKIP_BUILD:-0}"

if [[ ! -f "$SRC/package.json" ]]; then
  echo "zeus_client_chat_trace not found at $SRC" >&2
  exit 1
fi

VER="$(python3 -c 'import json, pathlib; print(json.loads(pathlib.Path("'"$SRC"'/package.json").read_text())["version"])')"

if [[ "$SKIP_BUILD" != "1" ]]; then
  (cd "$SRC" && npm run build)
fi

JS_SRC="$SRC/dist/zeus_client_chat_trace.js"
MAP_SRC="$SRC/dist/zeus_client_chat_trace.js.map"
if [[ ! -f "$JS_SRC" ]]; then
  echo "missing $JS_SRC — run npm run build in $SRC" >&2
  exit 1
fi

cp "$JS_SRC" "$DEST/zeus_client_chat_trace.js"
if [[ -f "$MAP_SRC" ]]; then
  cp "$MAP_SRC" "$DEST/zeus_client_chat_trace.js.map"
fi

echo "Pinned zeus_client_chat_trace@$VER → $DEST/zeus_client_chat_trace.js"
echo "Keep index.html src at /static/zeus_client_chat_trace.js?v=${VER}"
