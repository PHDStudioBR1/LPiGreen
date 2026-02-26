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

### `POST /api/leads`

Cria um novo lead, aplica todas as validações de negócio e associa automaticamente um **representante** (distribuição alternada / balanceada entre os representantes ativos).

- **URL completa (pública)**:  
  `https://lpigreen.546digitalservices.com/api/leads`
- **Content-Type**: `multipart/form-data`
- **Autenticação**: **obrigatória** (API Key).

> O campo `representante_id` **não é enviado** pelo cliente.  
> O backend escolhe automaticamente o representante com menos leads.

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
  "message": "Lead registrado com sucesso"
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

```json
[
  {
    "id": 123,
    "document_number": "123.456.789-09",
    "name": "Fulano de Tal",
    "email": "fulano@example.com",
    "phone": "(11) 99999-0000",
    "eligibility_status": "nao_verificado",
    "status": "new",
    "source": "web",
    "representante_id": 1,
    "created_at": "2026-02-26T12:34:56.000Z"
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


