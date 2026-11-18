#!/usr/bin/env bash
set -euo pipefail
: "${MINDSHELL_AI_BASE_URL:?设置模型接口地址}"
: "${MINDSHELL_AI_API_KEY:?设置模型 API 密钥}"
: "${MINDSHELL_AI_MODEL:?设置模型 ID}"
curl --fail-with-body "${MINDSHELL_AI_BASE_URL%/}/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MINDSHELL_AI_API_KEY" \
  -d "$(jq -n --arg model "$MINDSHELL_AI_MODEL" '{model: $model, messages: [{role: "user", content: "1+1"}]}')"
