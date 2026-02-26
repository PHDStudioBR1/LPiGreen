#!/bin/bash
# Cria o secret do Docker Registry no namespace lpigreen.
# Necessário quando o repositório donavanalencar/lpigreen-web é PRIVADO no Docker Hub.
# Execute uma vez (ou quando trocar a senha).
#
# Uso:
#   ./scripts/create-registry-secret.sh
#   DOCKER_USER=meuuser DOCKER_PASSWORD=xxx ./scripts/create-registry-secret.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NAMESPACE="${K8S_NAMESPACE:-lpigreen}"

# Docker Hub (padrão)
DOCKER_SERVER="${DOCKER_SERVER:-docker.io}"
DOCKER_USER="${DOCKER_USER:-}"
DOCKER_PASSWORD="${DOCKER_PASSWORD:-}"
SECRET_NAME="${REGISTRY_SECRET_NAME:-lpigreen-registry}"

if [[ -z "$DOCKER_USER" || -z "$DOCKER_PASSWORD" ]]; then
  echo "Uso: DOCKER_USER=seu_usuario DOCKER_PASSWORD=sua_senha $0"
  echo "Ou exporte DOCKER_USER e DOCKER_PASSWORD e execute $0"
  exit 1
fi

kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret docker-registry "$SECRET_NAME" \
  --docker-server="$DOCKER_SERVER" \
  --docker-username="$DOCKER_USER" \
  --docker-password="$DOCKER_PASSWORD" \
  -n "$NAMESPACE" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Secret $SECRET_NAME criado/atualizado no namespace $NAMESPACE."
echo "Agora aplique o deployment: kubectl apply -f $PROJECT_ROOT/infra/k8s/deployment.yaml -n $NAMESPACE"
echo "Ou execute: ./scripts/deploy-with-build.sh"
