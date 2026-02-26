-- ============================================================
-- Migração manual: criação de logs de preenchimento
-- Uso previsto: rodar em bancos já existentes
-- Banco: igreen_captacao
-- ============================================================

USE igreen_captacao;

CREATE TABLE IF NOT EXISTS lead_form_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id VARCHAR(64) DEFAULT NULL,
  event_type VARCHAR(64) NOT NULL,
  step_index TINYINT UNSIGNED DEFAULT NULL,
  step_id VARCHAR(64) DEFAULT NULL,
  payload_json JSON DEFAULT NULL,
  ip_address VARCHAR(64) DEFAULT NULL,
  user_agent VARCHAR(512) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lead_form_logs_session_created (session_id, created_at),
  KEY idx_lead_form_logs_event_created (event_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
