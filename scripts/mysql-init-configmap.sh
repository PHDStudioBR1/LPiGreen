#!/bin/sh
# Cria o ConfigMap mysql-init a partir de infra/mysql/init.sql (necessário para o MySQL rodar o init na primeira vez).
# Executar a partir da raiz do projeto: ./scripts/mysql-init-configmap.sh
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
kubectl create configmap mysql-init -n lpigreen \
  --from-file=init.sql="$REPO_ROOT/infra/mysql/init.sql" \
  --dry-run=client -o yaml | kubectl apply -f -
echo "ConfigMap mysql-init aplicado."
