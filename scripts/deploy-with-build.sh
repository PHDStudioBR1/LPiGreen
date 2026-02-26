#!/bin/bash
# Build das imagens LPiGreen (frontend + backend), push para o registry e deploy no Kubernetes.
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
VERSION="${VERSION:-latest}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  BUILD + PUSH + DEPLOY - LPiGreen${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Registry:  ${DOCKER_REGISTRY}"
echo -e "Version:   ${VERSION}"
echo -e "Namespace: ${NAMESPACE}"
echo ""

# --- 1. Build frontend ---
echo -e "${BLUE}1. Building frontend (lpigreen-web)...${NC}"
if [[ ! -f "$PROJECT_ROOT/Dockerfile" ]]; then
    echo -e "${RED}Dockerfile não encontrado em $PROJECT_ROOT${NC}" >&2
    exit 1
fi
docker build -f "$PROJECT_ROOT/Dockerfile" \
    -t "${DOCKER_REGISTRY}/lpigreen-web:${VERSION}" -t "${DOCKER_REGISTRY}/lpigreen-web:latest" \
    "$PROJECT_ROOT"
echo -e "${GREEN}✓ Frontend build concluído${NC}"
echo ""

# --- 2. Build backend ---
echo -e "${BLUE}2. Building backend (lpigreen-api)...${NC}"
if [[ ! -f "$PROJECT_ROOT/backend/Dockerfile" ]]; then
    echo -e "${RED}Dockerfile do backend não encontrado${NC}" >&2
    exit 1
fi
docker build -f "$PROJECT_ROOT/backend/Dockerfile" \
    -t "${DOCKER_REGISTRY}/lpigreen-api:${VERSION}" -t "${DOCKER_REGISTRY}/lpigreen-api:latest" \
    "$PROJECT_ROOT/backend"
echo -e "${GREEN}✓ Backend build concluído${NC}"
echo ""

# --- 3. Push imagens ---
echo -e "${BLUE}3. Pushing imagens...${NC}"
docker push "${DOCKER_REGISTRY}/lpigreen-web:${VERSION}"
docker push "${DOCKER_REGISTRY}/lpigreen-web:latest"
docker push "${DOCKER_REGISTRY}/lpigreen-api:${VERSION}"
docker push "${DOCKER_REGISTRY}/lpigreen-api:latest"
echo -e "${GREEN}✓ Push concluído${NC}"
echo ""

# --- 4. Deploy no Kubernetes ---
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}kubectl não encontrado${NC}" >&2
    exit 1
fi

echo -e "${BLUE}4. Aplicando namespace e ConfigMap mysql-init...${NC}"
kubectl apply -f "$K8S_DIR/namespace.yaml"
kubectl create configmap mysql-init -n "$NAMESPACE" \
    --from-file=init.sql="$PROJECT_ROOT/infra/mysql/init.sql" \
    --dry-run=client -o yaml | kubectl apply -f -
echo -e "${GREEN}✓${NC}"
echo ""

echo -e "${BLUE}5. Deploy MySQL...${NC}"
kubectl apply -f "$K8S_DIR/mysql-secret.yaml" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/mysql-configmap.yaml" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/mysql-pvc.yaml" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/mysql-deployment.yaml" -n "$NAMESPACE"
kubectl rollout status deployment/mysql -n "$NAMESPACE" --timeout=300s 2>/dev/null || echo -e "${YELLOW}MySQL ainda iniciando (ok na primeira vez)${NC}"
echo ""

echo -e "${BLUE}6. Job criar usuário MySQL...${NC}"
kubectl delete job mysql-create-app-user -n "$NAMESPACE" --ignore-not-found=true
kubectl apply -f "$K8S_DIR/mysql-create-user-job.yaml" -n "$NAMESPACE"
kubectl wait --for=condition=complete job/mysql-create-app-user -n "$NAMESPACE" --timeout=120s 2>/dev/null || echo -e "${YELLOW}Job em andamento ou já concluído${NC}"
echo ""

echo -e "${BLUE}7. Job migração de logs de formulário (idempotente)...${NC}"
kubectl delete job mysql-lead-form-logs-migration -n "$NAMESPACE" --ignore-not-found=true
kubectl apply -f "$K8S_DIR/mysql-lead-form-logs-migration-job.yaml" -n "$NAMESPACE"
kubectl wait --for=condition=complete job/mysql-lead-form-logs-migration -n "$NAMESPACE" --timeout=120s 2>/dev/null || echo -e "${YELLOW}Job em andamento ou já concluído${NC}"
echo ""

echo -e "${BLUE}8. Deploy Redis...${NC}"
kubectl apply -f "$K8S_DIR/redis-secret.yaml" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/redis-pvc.yaml" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/redis-deployment.yaml" -n "$NAMESPACE"
kubectl rollout status deployment/redis -n "$NAMESPACE" --timeout=180s 2>/dev/null || echo -e "${YELLOW}Redis ainda iniciando${NC}"
echo ""

echo -e "${BLUE}9. Deploy API (backend)...${NC}"
kubectl apply -f "$K8S_DIR/api-secret.yaml" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/backend-deployment.yaml" -n "$NAMESPACE"
kubectl set image deployment/lpigreen-api api="${DOCKER_REGISTRY}/lpigreen-api:${VERSION}" -n "$NAMESPACE"
kubectl rollout status deployment/lpigreen-api -n "$NAMESPACE" --timeout=300s
echo -e "${GREEN}✓ API implantada${NC}"
echo ""

echo -e "${BLUE}10. Deploy frontend e Ingress...${NC}"
kubectl apply -f "$K8S_DIR/deployment.yaml" -n "$NAMESPACE"
kubectl set image deployment/lpigreen-web web="${DOCKER_REGISTRY}/lpigreen-web:${VERSION}" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/middlewares/" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/certificate.yaml" -n "$NAMESPACE"
kubectl apply -f "$K8S_DIR/ingress-route.yaml" -n "$NAMESPACE"
kubectl rollout status deployment/lpigreen-web -n "$NAMESPACE" --timeout=300s
echo -e "${GREEN}✓ Frontend e Ingress aplicados${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploy concluído!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Pods:    kubectl get pods -n $NAMESPACE"
echo "Web:     kubectl logs -n $NAMESPACE -l app=lpigreen-web --tail=50 -f"
echo "API:     kubectl logs -n $NAMESPACE -l app=lpigreen-api --tail=50 -f"
echo ""
