-- ============================================================
-- Migração: armazenamento de documentos em base64 na tabela leads
-- Uso: rodar em bancos já existentes (após init ou após migration anterior)
-- Banco: igreen_captacao
-- ============================================================

USE igreen_captacao;

-- Adiciona colunas para armazenar conteúdo dos documentos em base64 (LONGTEXT suporta até ~4GB)
-- Executar uma única vez; em bancos já com essas colunas, ignorar erro "Duplicate column".
ALTER TABLE leads
  ADD COLUMN document_front_base64 LONGTEXT NULL COMMENT 'Documento frente (imagem/PDF) em base64' AFTER document_type,
  ADD COLUMN document_back_base64 LONGTEXT NULL COMMENT 'Documento verso em base64' AFTER document_front_base64,
  ADD COLUMN energy_bill_base64 LONGTEXT NULL COMMENT 'Conta de energia em base64' AFTER energy_bill_password,
  ADD COLUMN payment_proof_base64 LONGTEXT NULL COMMENT 'Comprovante de pagamento em base64' AFTER has_pending_debts;

-- Nota: as colunas *_path são mantidas para compatibilidade com registros antigos.
-- Novos cadastros passam a gravar apenas *_base64. Em leitura, a API retorna *_base64.
