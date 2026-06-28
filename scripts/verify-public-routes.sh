#!/usr/bin/env bash
# Verifica rotas públicas críticas após deploy (falha o CI se alguma retornar 404).
set -euo pipefail

BASE_URL="${1:?Usage: verify-public-routes.sh <base-url>}"
ROUTES=(/ /seguros /seguro-auto /telecom /lic)
MAX_ATTEMPTS="${VERIFY_ROUTES_ATTEMPTS:-12}"
SLEEP_SECONDS="${VERIFY_ROUTES_SLEEP:-15}"
HOME_MODAL_MARKER="${HOME_MODAL_MARKER:-começar é simples}"

echo "Verificando rotas em ${BASE_URL} (até ${MAX_ATTEMPTS} tentativas) ..."

verify_home_without_modal() {
  local html chunk
  html="$(curl -sS --max-time 30 "${BASE_URL}/")"
  chunk="$(echo "$html" | grep -oE '/_next/static/chunks/app/page-[^"]+\.js' | head -1 || true)"
  if [ -z "$chunk" ]; then
    echo "  WARN / — não foi possível localizar chunk da home"
    return 1
  fi
  if curl -sS --max-time 30 "${BASE_URL}${chunk}" | grep -q "$HOME_MODAL_MARKER"; then
    echo "  FAIL / — home ainda contém modal legado (\"${HOME_MODAL_MARKER}\")"
    return 1
  fi
  echo "  OK  / — home sem modal legado"
  return 0
}

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

  if ! verify_home_without_modal; then
    failed=1
  fi

  if [ "$failed" -eq 0 ]; then
    echo ""
    echo "Todas as verificações passaram."
    exit 0
  fi

  if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
    echo "Aguardando ${SLEEP_SECONDS}s antes da próxima tentativa..."
    sleep "$SLEEP_SECONDS"
  fi
done

echo ""
echo "Deploy inválido: rotas ou home da LP base não passaram na verificação."
exit 1
