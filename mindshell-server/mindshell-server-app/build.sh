#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
docker build -t mindshell-server:1.0 -f Dockerfile .
