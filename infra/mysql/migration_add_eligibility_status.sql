-- ============================================================
-- Migração manual: campo de elegibilidade em leads
-- Uso previsto: rodar UMA VEZ no banco já em produção
-- Banco: igreen_captacao
-- ============================================================

USE igreen_captacao;

-- Adiciona coluna de status de elegibilidade
-- Valores esperados:
--   - 'elegivel'
--   - 'nao_elegivel'
--   - 'cadastrado'
--   - 'nao_verificado' (default)
--
-- Todos os registros atuais receberão automaticamente o valor default.

ALTER TABLE leads
  ADD COLUMN eligibility_status VARCHAR(32) NOT NULL DEFAULT 'nao_verificado'
  AFTER representante_id;

