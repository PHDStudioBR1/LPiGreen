# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## CRM Admin (`/admin`)

O mini CRM em `/admin` permite gerenciar leads (listar, filtrar, ver detalhe, editar, exportar CSV) com login e senha.

### Variáveis de ambiente (Next.js)

- **ADMIN_USER** – usuário para login no admin (obrigatório).
- **ADMIN_PASSWORD** – senha em texto (uso em dev). Em produção prefira **ADMIN_PASSWORD_HASH** (hash bcrypt da senha).
- **ADMIN_JWT_SECRET** (ou **JWT_SECRET**) – segredo para assinar o JWT da sessão (obrigatório em produção).

Proteções: rate limit no login (5 tentativas / 15 min por IP), cookie HTTP-only e Secure em produção, headers de segurança (X-Frame-Options, etc.), e middleware que exige sessão válida em todas as rotas `/admin` e `/api/admin` (exceto login). As rotas de detalhe/edição de lead (`/api/leads/:id`, `/api/leads/:id/logs`) também exigem sessão admin.

---

## Validação de documentos com IA (backend)

O backend Express (`backend/`) suporta uma camada opcional de validação de documentos via IA (LLM) logo após o upload do formulário de lead.

- **Serviço**: `DocumentValidationService` (`backend/src/document-validation/document-validation-service.js`)
- **Providers** (estratégia, selecionados por env):
  - `openai` – `backend/src/document-validation/providers/openai-provider.js`
  - `deepseek` – `backend/src/document-validation/providers/deepseek-provider.js`
- **Integração**:
  - Rota `POST /api/leads` (arquivo `backend/src/routes/leads.js`)
  - Após validação de negócio e inserção do lead, o backend chama o serviço de IA e devolve o campo `document_validation` na resposta.

### Configuração por `.env`

No diretório `backend/` existe um arquivo `.env.example` com exemplos de configuração. Principais variáveis:

- `DOC_AI_PROVIDER`:
  - `openai` | `deepseek` – habilita o provider correspondente
  - vazio/qualquer outro valor – desabilita a validação automática (cai em revisão manual)
- `DOC_AI_TIMEOUT_MS`: timeout em milissegundos para chamadas à IA (default: `8000`)
- `OPENAI_API_KEY` / `OPENAI_MODEL`
- `DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL`

### Configuração no Kubernetes (GitHub Actions)

No deploy pelo pipeline, o secret `doc-ai-secret` é criado/atualizado a partir dos **GitHub Secrets** do repositório. Configure em *Settings → Secrets and variables → Actions*:

- `DOC_AI_PROVIDER` – `openai` ou `deepseek`
- `OPENAI_API_KEY` – chave da API OpenAI (se provider = openai)
- `OPENAI_MODEL` – opcional (default: `gpt-4.1-mini`)
- `DEEPSEEK_API_KEY` – chave da API DeepSeek (se provider = deepseek)
- `DEEPSEEK_MODEL` – opcional (default: `deepseek-chat`)
- `DOC_AI_TIMEOUT_MS` – opcional (default: `8000`)

Se `DOC_AI_PROVIDER` ou a API key correspondente estiverem vazios, a validação fica desativada e a resposta terá `status_final: "necessita_revisao_manual"`. Nos logs do pod da API você verá: `Document validation: desabilitado. Defina DOC_AI_PROVIDER...`

Para deploy manual no cluster, crie o secret antes do backend:  
`kubectl apply -f infra/k8s/doc-ai-secret.yaml -n lpigreen` (edite o YAML com os valores desejados).

Quando configurado, o backend:

- monta um payload enxuto com **metadados** dos arquivos (`slot`, `mimetype`, tamanho em bytes, etc.);
- envia para o LLM um **prompt estruturado** pedindo saída **estritamente em JSON**;
- valida a resposta com **Zod** (`validationResultSchema`) e normaliza via `parseAndNormalizeModelResponse`;
- em caso de erro de JSON/schema, tenta **1 retry**;
- se ainda assim falhar, retorna `status_final = "necessita_revisao_manual"` e `recomendacao = "revisao_manual"`.

### Contrato de resposta (resumo)

Para cada arquivo/slot analisado (`document_front`, `document_back`, `energy_bill`):

- `slot`
- `tipo_detectado`
- `legivel` (boolean ou null)
- `documento_esperado` (boolean ou null)
- `confianca` (0 a 1)
- `problemas_encontrados` (array de strings)

Retorno consolidado:

- `status_final`: `aprovado` | `reprovado` | `necessita_revisao_manual`
- `faltantes`: lista de slots obrigatórios ausentes
- `conflitos_duplicados`: lista de conflitos/duplicidades identificados
- `recomendacao`: `aprovar` | `solicitar_reenvio` | `revisao_manual`

### Custos, boas práticas e limitações

- O serviço envia **apenas metadados** dos arquivos (sem base64 do conteúdo) para manter o custo baixo e evitar vazamento de dados sensíveis.
- Sem OCR ou datas extraídas da conta de luz, a IA:
  - consegue ajudar principalmente em **checagem de completude** do conjunto de documentos;
  - tende a marcar casos como `necessita_revisao_manual` para legibilidade/tipo do documento.
- Logs de erro da IA:
  - não incluem conteúdo dos documentos nem do prompt;
  - registram apenas mensagens genéricas (status HTTP, erros de parsing, etc.).

Quando houver integração futura com OCR, você pode estender o payload de documentos (por exemplo, `ocr_text`) e o prompt continuará funcionando sem quebrar o fluxo atual.
