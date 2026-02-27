-- ============================================================
-- Apaga todos os registros da tabela leads
-- Banco: igreen_captacao
--
-- Uso (linha de comando, ajuste host/usuário/senha):
--   mysql -h HOST -u USER -p igreen_captacao < infra/mysql/script_delete_all_leads.sql
--
-- Ou dentro do cliente MySQL:
--   USE igreen_captacao;
--   DELETE FROM leads;
--   SELECT ROW_COUNT() AS leads_apagados;
-- ============================================================

USE igreen_captacao;

DELETE FROM leads;

SELECT ROW_COUNT() AS leads_apagados;
