-- ============================================================
-- Migração: armazenamento de documentos em base64 na tabela leads
-- Uso: rodar em bancos já existentes (após init ou após migration anterior)
-- Banco: igreen_captacao
-- Idempotente: só adiciona colunas que ainda não existem.
-- ============================================================

USE igreen_captacao;

-- Helper: adiciona coluna apenas se não existir (evita Duplicate column)
-- document_front_base64
SELECT COUNT(*) INTO @_col_exists FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'igreen_captacao' AND TABLE_NAME = 'leads' AND COLUMN_NAME = 'document_front_base64';
SET @_sql = IF(@_col_exists = 0,
  'ALTER TABLE leads ADD COLUMN document_front_base64 LONGTEXT NULL COMMENT ''Documento frente (imagem/PDF) em base64'' AFTER document_type',
  'SELECT 1 AS _skip');
PREPARE stmt FROM @_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- document_back_base64
SELECT COUNT(*) INTO @_col_exists FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'igreen_captacao' AND TABLE_NAME = 'leads' AND COLUMN_NAME = 'document_back_base64';
SET @_sql = IF(@_col_exists = 0,
  'ALTER TABLE leads ADD COLUMN document_back_base64 LONGTEXT NULL COMMENT ''Documento verso em base64'' AFTER document_front_base64',
  'SELECT 1 AS _skip');
PREPARE stmt FROM @_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- energy_bill_base64
SELECT COUNT(*) INTO @_col_exists FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'igreen_captacao' AND TABLE_NAME = 'leads' AND COLUMN_NAME = 'energy_bill_base64';
SET @_sql = IF(@_col_exists = 0,
  'ALTER TABLE leads ADD COLUMN energy_bill_base64 LONGTEXT NULL COMMENT ''Conta de energia em base64'' AFTER energy_bill_password',
  'SELECT 1 AS _skip');
PREPARE stmt FROM @_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- payment_proof_base64
SELECT COUNT(*) INTO @_col_exists FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'igreen_captacao' AND TABLE_NAME = 'leads' AND COLUMN_NAME = 'payment_proof_base64';
SET @_sql = IF(@_col_exists = 0,
  'ALTER TABLE leads ADD COLUMN payment_proof_base64 LONGTEXT NULL COMMENT ''Comprovante de pagamento em base64'' AFTER has_pending_debts',
  'SELECT 1 AS _skip');
PREPARE stmt FROM @_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Nota: as colunas *_path são mantidas para compatibilidade com registros antigos.
-- Novos cadastros passam a gravar apenas *_base64. Em leitura, a API retorna *_base64.
