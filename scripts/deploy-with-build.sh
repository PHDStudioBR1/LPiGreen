#!/bin/bash
# Build da imagem LPiGreen (Next.js), push para o registry e deploy no Kubernetes.
# Use este script quando alterar código e quiser implantar a nova versão.
#
# Requer: Docker em execução, login no registry (docker login), kubectl configurado.
# Se o repositório no Docker Hub for PRIVADO, crie o secret antes (uma vez):
#   DOCKER_USER=xxx DOCKER_PASSWORD=xxx ./scripts/create-registry-secret.sh
#
# Uso:
#   ./scripts/deploy-with-build.sh
#   VERSION=v1.0.0 ./scripts/deploy-with-build.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
K8S_DIR="$PROJECT_ROOT/infra/k8s"
NAMESPACE="${K8S_NAMESPACE:-lpigreen}"

DOCKER_REGISTRY="${DOCKER_REGISTRY:-donavanalencar}"
PROJECT_NAME="lpigreen-web"
VERSION="${VERSION:-latest}"
IMAGE_NAME="${DOCKER_REGISTRY}/${PROJECT_NAME}:${VERSION}"
IMAGE_LATEST="${DOCKER_REGISTRY}/${PROJECT_NAME}:latest"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  BUILD + PUSH + DEPLOY - LPiGreen${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Registry: ${DOCKER_REGISTRY}"
echo -e "Image:   ${IMAGE_NAME}"
echo -e "Namespace: ${NAMESPACE}"
echo ""

# 1. Build
echo -e "${BLUE}1. Building image...${NC}"
if [[ ! -f "$PROJECT_ROOT/Dockerfile" ]]; then
    echo -e "${RED}Dockerfile não encontrado em $PROJECT_ROOT${NC}" >&2
    exit 1
fi
docker build -f "$PROJECT_ROOT/Dockerfile" \
    -t "$IMAGE_NAME" -t "$IMAGE_LATEST" \
    "$PROJECT_ROOT"
echo -e "${GREEN}✓ Build concluído${NC}"
echo ""

# 2. Push
echo -e "${BLUE}2. Pushing image...${NC}"
docker push "$IMAGE_NAME"
docker push "$IMAGE_LATEST"
echo -e "${GREEN}✓ Push concluído${NC}"
echo ""

# 3. Deploy no Kubernetes (namespace já criado ou será criado)
echo -e "${BLUE}3. Deploy no cluster...${NC}"
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}kubectl não encontrado${NC}" >&2
    exit 1
fi
kubectl apply -f "$K8S_DIR/namespace.yaml"
kubectl apply -f "$K8S_DIR/deployment.yaml" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/middlewares/" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/certificate.yaml" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/ingress-route.yaml" -n "$NAMESPACE"
echo -e "${GREEN}✓ Manifestos aplicados${NC}"
echo ""

# 4. Aguardar rollout
echo -e "${BLUE}4. Aguardando rollout do deployment...${NC}"
kubectl rollout status deployment/lpigreen-web -n "$NAMESPACE" --timeout=300s
echo -e "${GREEN}✓ LPiGreen implantado com sucesso${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploy concluído!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Logs: kubectl logs -n $NAMESPACE -l app=lpigreen-web --tail=50 -f"
echo "Status: kubectl get pods -n $NAMESPACE -l app=lpigreen-web"
echo ""
