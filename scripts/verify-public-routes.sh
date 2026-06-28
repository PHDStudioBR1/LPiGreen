#!/usr/bin/env bash
# Verifica rotas públicas críticas após deploy (falha o CI se alguma retornar 404).
set -euo pipefail

BASE_URL="${1:?Usage: verify-public-routes.sh <base-url>}"
ROUTES=(/ /seguros /seguro-auto /telecom /lic)

echo "Verificando rotas em ${BASE_URL} ..."
failed=0

for route in "${ROUTES[@]}"; do
  code="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 30 "${BASE_URL}${route}")"
  if [ "$code" = "200" ]; then
    echo "  OK  ${route} → HTTP ${code}"
  else
    echo "  FAIL ${route} → HTTP ${code}"
    failed=1
  fi
done

if [ "$failed" -ne 0 ]; then
  echo ""
  echo "Deploy inválido: uma ou mais rotas públicas retornaram erro."
  exit 1
fi

echo ""
echo "Todas as rotas públicas responderam HTTP 200."
