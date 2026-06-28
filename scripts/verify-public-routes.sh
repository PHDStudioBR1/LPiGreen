#!/usr/bin/env bash
# Verifica rotas públicas críticas após deploy (falha o CI se alguma retornar 404).
set -euo pipefail

BASE_URL="${1:?Usage: verify-public-routes.sh <base-url>}"
ROUTES=(/ /seguros /seguro-auto /telecom /lic)
MAX_ATTEMPTS="${VERIFY_ROUTES_ATTEMPTS:-12}"
SLEEP_SECONDS="${VERIFY_ROUTES_SLEEP:-15}"

echo "Verificando rotas em ${BASE_URL} (até ${MAX_ATTEMPTS} tentativas) ..."

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  failed=0
  echo ""
  echo "--- tentativa ${attempt}/${MAX_ATTEMPTS} ---"

  for route in "${ROUTES[@]}"; do
    code="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 30 "${BASE_URL}${route}")"
    if [ "$code" = "200" ]; then
      echo "  OK  ${route} → HTTP ${code}"
    else
      echo "  FAIL ${route} → HTTP ${code}"
      failed=1
    fi
  done

  if [ "$failed" -eq 0 ]; then
    echo ""
    echo "Todas as rotas públicas responderam HTTP 200."
    exit 0
  fi

  if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
    echo "Aguardando ${SLEEP_SECONDS}s antes da próxima tentativa..."
    sleep "$SLEEP_SECONDS"
  fi
done

echo ""
echo "Deploy inválido: uma ou mais rotas públicas retornaram erro após ${MAX_ATTEMPTS} tentativas."
echo "Se lpigreendev apontar para um cluster diferente do prod, ajuste o DNS no Cloudflare."
exit 1
