#!/usr/bin/env bash
set -euo pipefail
: "${MINDSHELL_REGISTRY:?设置镜像仓库地址}"
: "${MINDSHELL_REGISTRY_NAMESPACE:?设置仓库命名空间}"
: "${MINDSHELL_REGISTRY_USERNAME:?设置仓库用户名}"
: "${MINDSHELL_REGISTRY_PASSWORD:?设置仓库密码}"
image="$MINDSHELL_REGISTRY/$MINDSHELL_REGISTRY_NAMESPACE/mindshell-server:1.0"
printf "%s\n" "$MINDSHELL_REGISTRY_PASSWORD" | docker login --username "$MINDSHELL_REGISTRY_USERNAME" --password-stdin "$MINDSHELL_REGISTRY"
docker tag mindshell-server:1.0 "$image"
docker push "$image"
