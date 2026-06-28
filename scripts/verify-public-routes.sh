#!/usr/bin/env bash
# Verifica rotas públicas críticas após deploy (falha o CI se alguma retornar 404).
set -euo pipefail

BASE_URL="${1:?Usage: verify-public-routes.sh <base-url>}"
ROUTES=(/ /seguros /seguro-auto /telecom /lic)
MAX_ATTEMPTS="${VERIFY_ROUTES_ATTEMPTS:-12}"
SLEEP_SECONDS="${VERIFY_ROUTES_SLEEP:-15}"

is_dev_host() {
  [[ "$BASE_URL" == *"lpigreendev"* ]]
}

echo "Verificando rotas em ${BASE_URL} (até ${MAX_ATTEMPTS} tentativas) ..."

verify_home_bundle() {
  local html chunk js
  html="$(curl -sS --max-time 30 "${BASE_URL}/")"
  chunk="$(echo "$html" | grep -oE '/_next/static/chunks/app/page-[^"]+\.js' | head -1 || true)"
  if [ -z "$chunk" ]; then
    echo "  FAIL / — chunk da home não encontrado no HTML"
    return 1
  fi

  js="$(curl -sS --max-time 30 "${BASE_URL}${chunk}")"

  if echo "$js" | grep -q 'conexao_green'; then
    echo "  FAIL / — home ainda contém formulário legado (conexao_green)"
    return 1
  fi

  if is_dev_host; then
    if ! echo "$js" | grep -q 'redirect-to-whatsapp-dev'; then
      echo "  FAIL / — home em dev deve redirecionar para redirect-to-whatsapp-dev"
      return 1
    fi
    echo "  OK  / — home dev sem modal e com redirect dev"
  else
    if ! echo "$js" | grep -q 'redirect-to-whatsapp.546digitalservices.com'; then
      echo "  FAIL / — home em prod deve redirecionar para redirect-to-whatsapp"
      return 1
    fi
    echo "  OK  / — home prod sem modal e com redirect prod"
  fi

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

  if ! verify_home_bundle; then
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
