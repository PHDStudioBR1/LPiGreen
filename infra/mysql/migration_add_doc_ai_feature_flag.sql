-- ============================================================
-- Migração manual: feature flag para validação de documentos por IA
-- Uso previsto: rodar UMA VEZ no banco já em produção/dev
-- Banco: igreen_captacao
--
-- Seguro para rodar múltiplas vezes (idempotente).
-- ============================================================

USE igreen_captacao;

-- Insere o flag 'doc_ai.enabled' na tabela config.
-- Se já existir, não altera o valor atual (preserva o que o admin definiu).
INSERT IGNORE INTO config (namespace, `key`, value)
VALUES ('doc_ai', 'enabled', 'true');
