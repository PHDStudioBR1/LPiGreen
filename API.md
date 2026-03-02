# Documentação da API – LPiGreen (Captação de Leads)

## Visão Geral

- **Base pública (Ingress / Traefik)**: `https://lpigreen.546digitalservices.com`
- **Prefixo da API**: `/api`
- **Principais endpoints**:
  - `GET /api/health` – healthcheck da API.
  - `GET /api/representantes` – lista os representantes comerciais.
  - `POST /api/leads` – criação de lead.

Todas as respostas são em **JSON**.

---

## Autenticação (API Key)

Os endpoints sob `/api` (exceto `/api/health`) são protegidos por **API Key**.

- A API espera uma chave secreta configurada na variável de ambiente `API_KEY` do backend.
- Em produção, essa chave vem do Secret Kubernetes `api-secret` (campo `api-key`).
- No frontend (Next), a chave é enviada via header `X-API-Key`, lida de `LEAD_API_KEY`.

### Como enviar a API Key

Você pode usar **um** dos cabeçalhos abaixo:

```http
X-API-Key: <SUA_API_KEY>
```

ou

```http
Authorization: Bearer <SUA_API_KEY>
```

> Exemplo de chave (NÃO use essa em produção se o repositório for público):  
> `qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI=`

---

## Healthcheck

### `GET /api/health`

Verifica se a API está de pé.

- **URL completa**:  
  `https://lpigreen.546digitalservices.com/api/health`
- **Autenticação**: **não** requer API Key.

> Observação: internamente o backend também responde em `/health`, mas externamente (Ingress) recomenda-se usar `/api/health`.

#### Exemplo de requisição

```bash
curl -X GET \
  https://lpigreen.546digitalservices.com/api/health
```

#### Exemplo de resposta (`200 OK`)

```json
{ "status": "ok" }
```

---

## Representantes

### `GET /api/representantes`

Lista os representantes comerciais cadastrados na tabela `representantes`.

- **URL completa**:  
  `https://lpigreen.546digitalservices.com/api/representantes`
- **Autenticação**: **obrigatória** (API Key).
- **Corpo de requisição**: nenhum.

#### Exemplo de requisição

```bash
curl -X GET \
  https://lpigreen.546digitalservices.com/api/representantes \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI="
```

#### Exemplo de resposta (`200 OK`)

```json
[
  {
    "id": 1,
    "nome": "Marcelo Narita",
    "link_cadastro": "https://link1.com",
    "tipo_produto": "conexao",
    "ativo": 1
  },
  {
    "id": 2,
    "nome": "Donavan Alencar",
    "link_cadastro": "https://link2.com",
    "tipo_produto": "conexao",
    "ativo": 1
  }
]
```

#### Erros comuns

- **401 Unauthorized**

```json
{ "error": "Não autorizado" }
```

- **500 Internal Server Error**

```json
{ "error": "Erro interno ao listar representantes" }
```

---

## Leads

**Documentos (arquivos)**  
Os anexos (`document_front`, `document_back`, `energy_bill`, `payment_proof`) são enviados via `multipart/form-data`. O servidor converte cada arquivo para **base64** e grava no banco nas colunas `document_front_base64`, `document_back_base64`, `energy_bill_base64`, `payment_proof_base64`. Todas as respostas **GET** de leads (lista, por ID, nao-verificado) retornam **todos os campos** do lead, incluindo esses documentos em **base64** (string), quando existirem.

### `POST /api/leads`

Cria um novo lead, aplica todas as validações de negócio e associa automaticamente um **representante** (distribuição alternada / balanceada entre os representantes ativos).

- **URL completa (pública)**:  
  `https://lpigreen.546digitalservices.com/api/leads`
- **Content-Type**: `multipart/form-data`
- **Autenticação**: **obrigatória** (API Key).

> O campo `representante_id` **não é enviado** pelo cliente.  
> O backend escolhe automaticamente o representante com menos leads.  
> Os arquivos enviados são convertidos em base64 e armazenados no banco (não são gravados em disco).

### Campos esperados (form-data)

**Landing / simulação**

- `cep_landing` (string, obrigatório)
- `valor_conta` (string ou número, obrigatório – ex.: `"250,00"`)

**Cadastro pessoal**

- `document_number` (string, obrigatório – CPF ou CNPJ)
- `name` (string, obrigatório)
- `birth_date` (string, obrigatório, formato `YYYY-MM-DD`)
- `phone` (string, obrigatório)
- `phone_confirm` (string, obrigatório, igual a `phone`)
- `email` (string, obrigatório)
- `email_confirm` (string, obrigatório, igual a `email`)

**Endereço**

- `cep` (obrigatório)
- `address` (obrigatório)
- `number` (obrigatório)
- `neighborhood` (obrigatório)
- `city` (obrigatório)
- `state` (obrigatório, ex.: `SP`)
- `complement` (opcional)

**Energia / documento**

- `power_company` (opcional)
- `installation_number` (obrigatório)
- `discount_option` (opcional – `"8"`, `"10"`, `"12"`, `"14"`)
- `document_type` (opcional)
- `document_front` (arquivo obrigatório – frente do documento, campo de upload)
- `document_back` (arquivo obrigatório – verso do documento, campo de upload)

**Procurador / conta**

- `has_procurator` (obrigatório – valores esperados `"sim"` ou `"nao"`)
- `energy_bill_password` (opcional)
- `energy_bill` (arquivo opcional – conta de energia)
- `has_pending_debts` (obrigatório – `"sim"` ou `"nao"`)
- `payment_proof` (arquivo opcional – comprovante de pagamento)

**Metadados opcionais**

- `status` (se não informado, default: `new`)
- `source` (se não informado, default: `web`)
- `id_campaign` (opcional)
- `eligibility_status` (opcional – uso interno; se não informado, default: `nao_verificado`. Valores possíveis:
  - `elegivel`
  - `nao_elegivel`
  - `cadastrado`
  - `nao_verificado`)

### Exemplo de requisição (curl)

```bash
curl -X POST \
  https://lpigreen.546digitalservices.com/api/leads \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI=" \
  -F "cep_landing=12345-678" \
  -F "valor_conta=250,00" \
  -F "document_number=123.456.789-09" \
  -F "name=Fulano de Tal" \
  -F "birth_date=1990-01-01" \
  -F "phone=(11) 99999-0000" \
  -F "phone_confirm=(11) 99999-0000" \
  -F "email=fulano@example.com" \
  -F "email_confirm=fulano@example.com" \
  -F "cep=12345-678" \
  -F "address=Rua Exemplo" \
  -F "number=123" \
  -F "neighborhood=Centro" \
  -F "city=São Paulo" \
  -F "state=SP" \
  -F "complement=Apto 101" \
  -F "power_company=Cemig" \
  -F "installation_number=123456789" \
  -F "discount_option=10" \
  -F "document_type=RG (Novo)" \
  -F "has_procurator=nao" \
  -F "energy_bill_password=" \
  -F "has_pending_debts=nao" \
  -F "document_front=@/caminho/para/rg-frente.jpg" \
  -F "document_back=@/caminho/para/rg-verso.jpg" \
  -F "energy_bill=@/caminho/para/conta-energia.pdf" \
  -F "payment_proof=@/caminho/para/comprovante.pdf"
```

### Respostas

#### Sucesso (`201 Created`)

```json
{
  "id": 123,
  "message": "Lead registrado com sucesso",
  "document_validation": {
    "documentos": [
      {
        "slot": "document_front",
        "tipo_detectado": "rg_frente",
        "legivel": true,
        "documento_esperado": true,
        "confianca": 0.95,
        "problemas_encontrados": []
      },
      {
        "slot": "energy_bill",
        "tipo_detectado": "conta_de_luz",
        "legivel": true,
        "documento_esperado": true,
        "confianca": 0.9,
        "problemas_encontrados": []
      }
    ],
    "status_final": "aprovado",
    "faltantes": [],
    "conflitos_duplicados": [],
    "recomendacao": "aprovar"
  }
}
```

#### Erro de validação (`422 Unprocessable Entity`)

```json
{
  "error": "Erro de validação",
  "details": {
    "campo": ["Mensagem de erro 1", "Mensagem de erro 2"]
  }
}
```

#### Não autorizado (`401 Unauthorized`)

```json
{ "error": "Não autorizado" }
```

#### Rate limit excedido (`429 Too Many Requests`)

```json
{ "error": "Muitas requisições. Tente novamente mais tarde." }
```

#### Erro interno (`500 Internal Server Error`)

```json
{ "error": "Erro interno ao processar solicitação" }
```

---

### `POST /api/leads/progress`

Salva o progresso do formulário em cache Redis (TTL) e registra log de preenchimento no banco.

- **URL completa**:  
  `https://lpigreen.546digitalservices.com/api/leads/progress`
- **Content-Type**: `application/json`
- **Autenticação**: **obrigatória** (API Key).
- **Requisito de etapa**: `step_index >= 1` (a partir da tela 2 do formulário).

#### Exemplo de payload

```json
{
  "session_id": "0c53e4ef-4f9f-4b84-97df-77f1d6d02f8b",
  "step_index": 2,
  "step_id": "endereco",
  "values": {
    "document_number": "123.456.789-09",
    "name": "Fulano de Tal"
  }
}
```

#### Exemplo de resposta (`200 OK`)

```json
{ "success": true }
```

---

### `GET /api/leads/progress/:sessionId`

Recupera o snapshot de progresso salvo no Redis para uma sessão de formulário.

---

### `DELETE /api/leads/progress/:sessionId`

Limpa o snapshot de progresso no Redis para a sessão informada e registra log de limpeza.

---

### `GET /api/leads/nao-verificado`

Retorna todos os leads cujo campo `eligibility_status` está em `"nao_verificado"`.

- **URL completa**:  
  `https://lpigreen.546digitalservices.com/api/leads/nao-verificado`
- **Autenticação**: **obrigatória** (API Key).
- **Corpo de requisição**: nenhum.

#### Exemplo de requisição

```bash
curl -X GET \
  https://lpigreen.546digitalservices.com/api/leads/nao-verificado \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI="
```

#### Exemplo de resposta (`200 OK`)

Retorna **todos os campos** do lead, incluindo documentos em base64 (quando existirem). Exemplo resumido (os campos `*_base64` podem ser strings longas):

```json
[
  {
    "id": 123,
    "cep_landing": "12345-678",
    "valor_conta": "250.00",
    "document_number": "123.456.789-09",
    "name": "Fulano de Tal",
    "birth_date": "1990-01-01",
    "phone": "(11) 99999-0000",
    "phone_confirm": "(11) 99999-0000",
    "email": "fulano@example.com",
    "email_confirm": "fulano@example.com",
    "cep": "12345-678",
    "address": "Rua Exemplo",
    "number": "123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "complement": null,
    "power_company": "Cemig",
    "installation_number": "123456789",
    "discount_option": "10",
    "document_type": "RG (Novo)",
    "document_front_base64": "iVBORw0KGgoAAAANSUhEUgAAA...",
    "document_back_base64": "/9j/4AAQSkZJRgABAQAAAQAB...",
    "has_procurator": 0,
    "energy_bill_password": null,
    "energy_bill_base64": "JVBERi0xLjQKJeLjz9MK...",
    "has_pending_debts": 0,
    "payment_proof_base64": null,
    "representante_id": 1,
    "eligibility_status": "nao_verificado",
    "status": "new",
    "source": "web",
    "id_campaign": null,
    "created_at": "2026-02-26T12:34:56.000Z",
    "updated_at": "2026-02-26T12:34:56.000Z"
  }
]
```

#### Erros comuns

- **401 Unauthorized**

```json
{ "error": "Não autorizado" }
```

- **500 Internal Server Error**

```json
{ "error": "Erro interno ao listar leads nao_verificado" }
```

---

### `PATCH /api/leads/eligibility`

Atualiza o campo `eligibility_status` de um ou mais leads com base no campo `document_number`.

- **URL completa**:  
  `https://lpigreen.546digitalservices.com/api/leads/eligibility`
- **Autenticação**: **obrigatória** (API Key).
- **Content-Type**: `application/json`

#### Corpo da requisição (JSON)

- `document_number` (string, obrigatório – CPF ou CNPJ exatamente como armazenado no lead)
- `eligibility_status` (string, obrigatório – valores permitidos:
  - `elegivel`
  - `nao_elegivel`
  - `cadastrado`
  - `nao_verificado`)

#### Exemplo de requisição

```bash
curl -X PATCH \
  https://lpigreen.546digitalservices.com/api/leads/eligibility \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI=" \
  -H "Content-Type: application/json" \
  -d '{
    "document_number": "123.456.789-09",
    "eligibility_status": "elegivel"
  }'
```

#### Resposta de sucesso (`200 OK`)

```json
{
  "updated": 1,
  "message": "Status de elegibilidade atualizado com sucesso"
}
```

#### Lead não encontrado (`404 Not Found`)

```json
{ "error": "Lead não encontrado para o documento informado" }
```

#### Erro de validação (`400 Bad Request`)

```json
{
  "error": "Parâmetros obrigatórios ausentes",
  "details": {
    "document_number": ["Informe o número do documento"],
    "eligibility_status": ["Informe o novo status de elegibilidade"]
  }
}
```

---

## CRUD de Leads (Tela de Gestão)

Os endpoints abaixo foram pensados para a **tela interna de gestão** dos leads já cadastrados (backoffice).  
Todos exigem **API Key** e retornam JSON.

### `GET /api/leads`

Lista leads com filtros opcionais e paginação.

- **URL**: `/api/leads`
- **Autenticação**: obrigatória (API Key)
- **Query params (opcionais)**:
  - `status`: filtra por status do lead (ex.: `new`, `deleted`, etc.)
  - `eligibility_status`: filtra por status de elegibilidade (`elegivel`, `nao_elegivel`, `cadastrado`, `nao_verificado`)
  - `representante_id`: filtra por ID de representante
  - `document_number`: filtro parcial por documento (usa `LIKE '%valor%'`)
  - `created_from`: data/hora inicial (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:MM:SS`)
  - `created_to`: data/hora final
  - `limit`: quantidade por página (default: `50`)
  - `offset`: deslocamento para paginação (default: `0`)

#### Exemplo

```bash
curl -X GET \
  "https://lpigreen.546digitalservices.com/api/leads?status=new&eligibility_status=nao_verificado&limit=20&offset=0" \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI="
```

#### Exemplo de resposta (`200 OK`)

Retorna **todos os campos** de cada lead, incluindo documentos em **base64** (`document_front_base64`, `document_back_base64`, `energy_bill_base64`, `payment_proof_base64`). Cada item do array tem a mesma estrutura do `GET /api/leads/:id` (todos os campos listados abaixo).

---

### `GET /api/leads/:id`

Busca os **detalhes completos** de um lead específico: todos os campos, incluindo endereço e documentos em **base64**.

- **URL**: `/api/leads/:id`
- **Autenticação**: obrigatória (API Key)

#### Exemplo

```bash
curl -X GET \
  https://lpigreen.546digitalservices.com/api/leads/123 \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI="
```

#### Resposta de sucesso (`200 OK`)

Todos os campos do lead. Documentos vêm em **base64** (strings; podem ser longas).

```json
{
  "id": 123,
  "cep_landing": "12345-678",
  "valor_conta": "250.00",
  "document_number": "123.456.789-09",
  "name": "Fulano de Tal",
  "birth_date": "1990-01-01",
  "phone": "(11) 99999-0000",
  "phone_confirm": "(11) 99999-0000",
  "email": "fulano@example.com",
  "email_confirm": "fulano@example.com",
  "cep": "12345-678",
  "address": "Rua Exemplo",
  "number": "123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "complement": "Apto 101",
  "power_company": "Cemig",
  "installation_number": "123456789",
  "discount_option": "10",
  "document_type": "RG (Novo)",
  "document_front_base64": "iVBORw0KGgoAAAANSUhEUgAAA...",
  "document_back_base64": "/9j/4AAQSkZJRgABAQAAAQAB...",
  "has_procurator": 0,
  "energy_bill_password": null,
  "energy_bill_base64": "JVBERi0xLjQKJeLjz9MK...",
  "has_pending_debts": 0,
  "payment_proof_base64": null,
  "representante_id": 1,
  "eligibility_status": "nao_verificado",
  "status": "new",
  "source": "web",
  "id_campaign": null,
  "created_at": "2026-02-26T12:34:56.000Z",
  "updated_at": "2026-02-26T12:34:56.000Z"
}
```

#### Erros

- `400 Bad Request` – ID inválido
- `404 Not Found` – lead não encontrado

---

### `PATCH /api/leads/:id`

Atualiza campos de um lead para uso na tela de gestão.

- **URL**: `/api/leads/:id`
- **Autenticação**: obrigatória (API Key)
- **Content-Type**: `application/json`
- **Campos atualizáveis**:
  - `status`
  - `eligibility_status`
  - `representante_id`
  - `id_campaign`

#### Exemplo de requisição

```bash
curl -X PATCH \
  https://lpigreen.546digitalservices.com/api/leads/123 \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI=" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "em_analise",
    "eligibility_status": "elegivel",
    "representante_id": 2
  }'
```

#### Resposta de sucesso (`200 OK`)

```json
{
  "message": "Lead atualizado com sucesso",
  "lead": {
    "...": "campos do lead após atualização"
  }
}
```

---

### `DELETE /api/leads/:id`

Opera como um **soft delete**: não remove o registro fisicamente, apenas define `status = 'deleted'`.

- **URL**: `/api/leads/:id`
- **Autenticação**: obrigatória (API Key)

#### Exemplo

```bash
curl -X DELETE \
  https://lpigreen.546digitalservices.com/api/leads/123 \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI="
```

#### Resposta de sucesso (`200 OK`)

```json
{ "message": "Lead marcado como deletado (status=deleted)" }
```

---

## Logs de Formulário / Erros de Processamento

Os logs de formulário são gravados na tabela `lead_form_logs` sempre que:

- o usuário salva o progresso do formulário (`event_type = 'step_progress_saved'`);
- o progresso é limpo (`event_type = 'step_progress_cleared'`);
- o lead é enviado com sucesso (`event_type = 'lead_submitted'`);
- (opcionalmente) você pode estender para gravar erros de processamento usando `insertLeadFormLog` com outro `event_type`.

O campo `payload` (derivado de `payload_json`) contém um JSON com detalhes do evento (como `lead_id`, `document_number`, etc.).

### `GET /api/leads/:id/logs`

Retorna os logs associados a um lead, com base no `document_number` armazenado no payload dos eventos de formulário.

- **URL**: `/api/leads/:id/logs`
- **Autenticação**: obrigatória (API Key)
- **Query params (opcionais)**:
  - `limit` (default: `50`)
  - `offset` (default: `0`)

#### Exemplo

```bash
curl -X GET \
  "https://lpigreen.546digitalservices.com/api/leads/123/logs?limit=20" \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI="
```

#### Exemplo de resposta (`200 OK`)

```json
[
  {
    "id": 1,
    "session_id": "0c53e4ef-4f9f-4b84-97df-77f1d6d02f8b",
    "event_type": "lead_submitted",
    "step_index": 5,
    "step_id": "final",
    "payload": {
      "lead_id": 123,
      "document_number": "123.456.789-09",
      "email": "fulano@example.com"
    },
    "ip_address": "1.2.3.4",
    "user_agent": "Mozilla/5.0 ...",
    "created_at": "2026-02-26T12:35:00.000Z"
  }
]
```

Na tela de gestão de leads, você pode usar esse endpoint para exibir o **histórico de eventos** e mensagens de erro ou de processamento associadas ao lead selecionado.

---

### `GET /api/leads/logs/search`

Endpoint genérico para consultar logs com filtros, útil para telas de auditoria.

- **URL**: `/api/leads/logs/search`
- **Autenticação**: obrigatória (API Key)
- **Query params (todos opcionais)**:
  - `session_id`
  - `event_type` (ex.: `lead_submitted`, `step_progress_saved`, `step_progress_cleared`, etc.)
  - `document_number` (bate em `payload.document_number` dos eventos)
  - `created_from`
  - `created_to`
  - `limit` (default: `50`)
  - `offset` (default: `0`)

#### Exemplo

```bash
curl -X GET \
  "https://lpigreen.546digitalservices.com/api/leads/logs/search?document_number=123.456.789-09&event_type=lead_submitted" \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI="
```

---

### `GET /api/leads/logs/:logId`

Retorna o detalhe de um log específico.

- **URL**: `/api/leads/logs/:logId`
- **Autenticação**: obrigatória (API Key)

#### Exemplo

```bash
curl -X GET \
  https://lpigreen.546digitalservices.com/api/leads/logs/1 \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI="
```

---

### `DELETE /api/leads/logs/:logId`

Remove um log de formulário (uso administrativo, por exemplo para limpeza de dados sensíveis).

- **URL**: `/api/leads/logs/:logId`
- **Autenticação**: obrigatória (API Key)

#### Exemplo

```bash
curl -X DELETE \
  https://lpigreen.546digitalservices.com/api/leads/logs/1 \
  -H "X-API-Key: qOXKMZmz76NQZQ89rJZeXRqIHM21UzPXp1NCbQj5TaI="
```

#### Resposta de sucesso (`200 OK`)

```json
{ "message": "Log removido com sucesso" }
```
