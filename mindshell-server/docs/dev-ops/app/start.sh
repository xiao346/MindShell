#!/usr/bin/env bash
set -euo pipefail
: "${MINDSHELL_DB_URL:?设置容器可访问的 JDBC 地址}"
: "${MINDSHELL_DB_PASSWORD:?设置数据库密码}"
: "${MINDSHELL_SECRET_KEY:?设置 SSH 凭据加密密钥}"
: "${MINDSHELL_AI_BASE_URL:?设置模型接口地址}"
: "${MINDSHELL_AI_API_KEY:?设置模型 API 密钥}"
: "${MINDSHELL_AI_MODEL:?设置模型 ID}"
docker run --name mindshell-server -p 127.0.0.1:8091:8091 \
  -e MINDSHELL_DB_URL -e MINDSHELL_DB_USER -e MINDSHELL_DB_PASSWORD \
  -e MINDSHELL_SECRET_KEY -e MINDSHELL_AI_BASE_URL -e MINDSHELL_AI_API_KEY -e MINDSHELL_AI_MODEL \
  -d mindshell-server:1.0
