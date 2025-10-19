#!/usr/bin/env bash
set -euo pipefail
python3 server.py &           # RPC em :8000  (XML-RPC)
cd static && python3 -m http.server 8080
