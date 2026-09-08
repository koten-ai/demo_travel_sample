#!/usr/bin/env bash
# Obsolete: TravelPlan loads Zeus chat-trace from the public CDN, not a vendored copy.
#   https://koten-static-cdn.nyc3.cdn.digitaloceanspaces.com/zeus_client_chat_trace/latest/zeus_client_chat_trace.js
#
# Publish a new bundle from the chat-trace repo:
#   cd ../zeus_client_chat_trace && npm test && npm run build && npm run publish:cdn
#
# To freeze a release, point templates/index.html at:
#   https://koten-static-cdn.nyc3.cdn.digitaloceanspaces.com/zeus_client_chat_trace/<semver>/zeus_client_chat_trace.js
set -euo pipefail
echo "TravelPlan no longer vendors zeus_client_chat_trace.js — use CDN latest (see script header)." >&2
exit 1
