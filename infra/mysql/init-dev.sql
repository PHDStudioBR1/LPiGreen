-- ============================================================
-- iGreen Captação DEV - Inicialização do banco MySQL (ambiente dev)
-- Mesmo schema de init.sql, usando banco igreen_captacao_dev
-- ============================================================

CREATE DATABASE IF NOT EXISTS igreen_captacao_dev
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE igreen_captacao_dev;

-- ------------------------------------------------------------
-- Tabela de representantes comerciais
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS representantes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  link_cadastro VARCHAR(512) NOT NULL,
  tipo_produto VARCHAR(64) NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_representantes_link (link_cadastro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Registros iniciais de representantes
INSERT INTO representantes (nome, link_cadastro, tipo_produto)
VALUES
  ('Marcelo Narita', 'https://digital.igreenenergy.com.br/?id=121530', 'conexao'),
  ('Donavan Alencar', 'https://digital.igreenenergy.com.br/?id=121534', 'conexao')
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  tipo_produto = VALUES(tipo_produto),
  ativo = 1;

-- ------------------------------------------------------------
-- Tabela principal de leads (espelho do formulário de captação)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id VARCHAR(64) NULL UNIQUE COMMENT 'Sessão do formulário (draft por etapa)',
  cep_landing VARCHAR(10) NULL,
  valor_conta DECIMAL(12,2) NULL,
  document_number VARCHAR(18) NULL COMMENT 'CPF ou CNPJ',
  name VARCHAR(255) NULL,
  birth_date DATE NULL,
  phone VARCHAR(20) NULL,
  phone_confirm VARCHAR(20) NULL,
  email VARCHAR(255) NULL,
  email_confirm VARCHAR(255) NULL,
  cep VARCHAR(10) NULL,
  address VARCHAR(255) NULL,
  number VARCHAR(20) NULL,
  neighborhood VARCHAR(120) NULL,
  city VARCHAR(120) NULL,
  state VARCHAR(2) NULL,
  complement VARCHAR(255) DEFAULT NULL,
  power_company VARCHAR(120) DEFAULT NULL,
  installation_number VARCHAR(60) NULL,
  discount_option VARCHAR(10) DEFAULT NULL COMMENT '8, 10, 12, 14',
  document_type VARCHAR(60) DEFAULT NULL COMMENT 'ex: RG (Novo)',
  document_front_base64 LONGTEXT DEFAULT NULL COMMENT 'Documento frente (imagem/PDF) em base64',
  document_back_base64 LONGTEXT DEFAULT NULL COMMENT 'Documento verso em base64',
  has_procurator TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=Não, 1=Sim',
  energy_bill_password VARCHAR(255) DEFAULT NULL,
  energy_bill_base64 LONGTEXT DEFAULT NULL COMMENT 'Conta de energia em base64',
  has_pending_debts TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=Não, 1=Sim',
  payment_proof_base64 LONGTEXT DEFAULT NULL COMMENT 'Comprovante de pagamento em base64',
  representante_id BIGINT UNSIGNED NOT NULL,
  eligibility_status VARCHAR(32) NOT NULL DEFAULT 'nao_verificado',
  status VARCHAR(32) DEFAULT 'new' COMMENT 'new=completo, draft=parcial',
  source VARCHAR(64) DEFAULT 'web',
  id_campaign VARCHAR(64) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_created_at (created_at),
  KEY idx_status (status),
  KEY idx_email (email(64)),
  KEY idx_document (document_number(14)),
  KEY idx_representante (representante_id),
  KEY idx_session_id (session_id),
  CONSTRAINT fk_leads_representante FOREIGN KEY (representante_id) REFERENCES representantes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Logs de preenchimento de formulário (padrão de auditoria)
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- Tabela de configuração (chave/valor por namespace)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS config (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  namespace VARCHAR(64) NOT NULL DEFAULT 'app',
  `key` VARCHAR(128) NOT NULL,
  value TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_namespace_key (namespace, `key`),
  KEY idx_namespace (namespace)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabela de configuração específica da API (opcional)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS config_api (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(128) NOT NULL,
  value TEXT,
  description VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
