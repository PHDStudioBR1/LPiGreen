# Prompt sugerido

Implemente no projeto LPiGreen, sem duplicar recursos já existentes, os itens abaixo:

1. Redis no Kubernetes
- Criar manifests Kubernetes para Redis com `Secret`, `PVC`, `Deployment` e `Service` no namespace `lpigreen`.
- Configurar persistência (`appendonly yes`) e autenticação por senha via Secret.
- Ajustar deploy para subir Redis antes do backend.

2. Cache progressivo do formulário
- Reaproveitar o fluxo atual do formulário multi-etapas.
- A partir da etapa 2 (índice 1), ao avançar de etapa, persistir snapshot parcial em Redis com TTL (ex.: 72h).
- Criar endpoint backend autenticado por API key para salvar progresso: `POST /api/leads/progress`.
- Criar endpoint para recuperar progresso: `GET /api/leads/progress/:sessionId`.
- Criar endpoint para limpar progresso após envio final: `DELETE /api/leads/progress/:sessionId`.
- No frontend, gerar e manter `session_id` por usuário (localStorage), restaurar rascunho ao abrir formulário e limpar após submit com sucesso.

3. Logs de preenchimento em banco existente
- Criar tabela idempotente `lead_form_logs` no MySQL já conectado, com campos de mercado:
  - `session_id`, `event_type`, `step_index`, `step_id`, `payload_json`, `ip_address`, `user_agent`, `created_at`.
- Registrar logs no banco a cada salvamento de progresso e no envio final do lead.
- Evitar logs redundantes e evitar criar funções duplicadas no código.

4. Banco e deploy
- Atualizar `infra/mysql/init.sql` para novas instalações.
- Criar migração idempotente para ambientes existentes.
- Incluir execução da migração no deploy Kubernetes via Job.
- Garantir que os scripts de deploy/build continuem funcionais e sem passos manuais ocultos.

5. Critérios de aceite
- Build e typecheck sem erros.
- Endpoints de progresso funcionando (POST/GET/DELETE).
- Redis operacional no cluster e backend conectado.
- Logs de preenchimento aparecendo na tabela MySQL.
- Sem remoção de funcionalidades existentes e sem código redundante.
