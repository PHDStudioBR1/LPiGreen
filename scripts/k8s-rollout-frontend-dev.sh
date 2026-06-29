#!/usr/bin/env bash
# Atualiza lpigreen-web-dev no cluster de produção (destino de lpigreendev).
set -euo pipefail

NAMESPACE="${1:?Usage: k8s-rollout-frontend-dev.sh <namespace> <image>}"
IMAGE="${2:?Usage: k8s-rollout-frontend-dev.sh <namespace> <image>}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Deploy lpigreen-web-dev em ${NAMESPACE} → ${IMAGE}"

kubectl apply -f "${ROOT_DIR}/infra/k8s/deployment-dev.yaml" -n "${NAMESPACE}"
kubectl set image deployment/lpigreen-web-dev \
  web="${IMAGE}" \
  -n "${NAMESPACE}"
kubectl rollout status deployment/lpigreen-web-dev -n "${NAMESPACE}" --timeout=300s

if [ -d "${ROOT_DIR}/infra/k8s/middlewares" ]; then
  kubectl apply -f "${ROOT_DIR}/infra/k8s/middlewares/" -n "${NAMESPACE}"
fi
kubectl apply -f "${ROOT_DIR}/infra/k8s/ingress-route-dev-prod-cluster.yaml" -n "${NAMESPACE}"

echo "Imagem configurada:"
kubectl get deployment lpigreen-web-dev -n "${NAMESPACE}" -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
kubectl get pods -n "${NAMESPACE}" -l app=lpigreen-web-dev -o wide
