# Vendored chat_request catalogs

`chat_request_analytics_base-6.1.json` is the [koten-ai/zeus_chat_request](https://github.com/koten-ai/zeus_chat_request) pin `v2/base/base-6.1/min/chat_request_analytics_base-6.1.json` (contract `analytics_base5_2`, hash `md5:5aacbf1d7a4d9d5de9436cdffbce050f`).

`kotenai-zeus-client` 2.4.x `load_for_turn` looks for `chat_request_{mode}_v2.json` under `{bucket}__{scope}` then the catalog root. Those copies are the same pin so a fresh clone can boot against Zeus 0.7.x (`client-floor-6.1`) before a live catalog sync.

Startup sync (`chat_requests_sync.on_startup`) refreshes the inventory copy from Zeus when reachable.
