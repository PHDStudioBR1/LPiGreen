-- ============================================================
-- Migração: leads parciais (draft) por session_id
-- Permite salvar dados do formulário na tabela leads a cada passo,
-- mesmo sem cadastro completo. session_id identifica o rascunho.
-- Banco: igreen_captacao
-- ============================================================

USE igreen_captacao;

-- Identificador da sessão do formulário (permite upsert por sessão)
ALTER TABLE leads
  ADD COLUMN session_id VARCHAR(64) NULL UNIQUE
  AFTER id;

-- Índice para buscar lead por session_id (já coberto por UNIQUE, mas explícito para clareza)
-- CREATE INDEX idx_leads_session_id ON leads(session_id); -- UNIQUE já cria índice

-- Campos que podem ficar vazios em cadastro parcial (draft)
ALTER TABLE leads
  MODIFY COLUMN cep_landing VARCHAR(10) NULL,
  MODIFY COLUMN valor_conta DECIMAL(12,2) NULL,
  MODIFY COLUMN document_number VARCHAR(18) NULL COMMENT 'CPF ou CNPJ',
  MODIFY COLUMN name VARCHAR(255) NULL,
  MODIFY COLUMN birth_date DATE NULL,
  MODIFY COLUMN phone VARCHAR(20) NULL,
  MODIFY COLUMN phone_confirm VARCHAR(20) NULL,
  MODIFY COLUMN email VARCHAR(255) NULL,
  MODIFY COLUMN email_confirm VARCHAR(255) NULL,
  MODIFY COLUMN cep VARCHAR(10) NULL,
  MODIFY COLUMN address VARCHAR(255) NULL,
  MODIFY COLUMN number VARCHAR(20) NULL,
  MODIFY COLUMN neighborhood VARCHAR(120) NULL,
  MODIFY COLUMN city VARCHAR(120) NULL,
  MODIFY COLUMN state VARCHAR(2) NULL,
  MODIFY COLUMN installation_number VARCHAR(60) NULL;

-- Status 'draft' para leads salvos por etapa (incompletos)
-- Nenhuma alteração necessária: status já é VARCHAR(32) DEFAULT 'new'
-- Usaremos status = 'draft' para leads parciais e 'new' no submit final.
