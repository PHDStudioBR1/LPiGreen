-- ============================================================
-- iGreen Captação - Inicialização do banco MySQL
-- Executar como root na primeira vez (init container ou job único)
-- ============================================================

CREATE DATABASE IF NOT EXISTS igreen_captacao
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE igreen_captacao;

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

-- Usuário da aplicação (senha definida via Secret no K8s; aqui é exemplo)
-- Em produção, criar usuário com: CREATE USER 'igreen_app'@'%' IDENTIFIED BY '<senha-do-secret>';
-- GRANT abaixo assume que o usuário já foi criado (ex.: via job que lê o Secret)
-- Para init automático com senha fixa em dev, descomente e ajuste:
-- CREATE USER IF NOT EXISTS 'igreen_app'@'%' IDENTIFIED BY 'change_me_in_secret';
-- GRANT SELECT, INSERT, UPDATE ON igreen_captacao.* TO 'igreen_app'@'%';
-- FLUSH PRIVILEGES;

-- ------------------------------------------------------------
-- Tabela principal de leads (espelho do formulário de captação)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- 1.1 Landing
  cep_landing VARCHAR(10) NOT NULL,
  valor_conta DECIMAL(12,2) NOT NULL,
  -- 1.2 Cadastro pessoal
  document_number VARCHAR(18) NOT NULL COMMENT 'CPF ou CNPJ',
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  phone_confirm VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  email_confirm VARCHAR(255) NOT NULL,
  -- 1.3 Endereço
  cep VARCHAR(10) NOT NULL,
  address VARCHAR(255) NOT NULL,
  number VARCHAR(20) NOT NULL,
  neighborhood VARCHAR(120) NOT NULL,
  city VARCHAR(120) NOT NULL,
  state VARCHAR(2) NOT NULL,
  complement VARCHAR(255) DEFAULT NULL,
  -- 1.4 Energia e documento
  power_company VARCHAR(120) DEFAULT NULL,
  installation_number VARCHAR(60) NOT NULL,
  discount_option VARCHAR(10) DEFAULT NULL COMMENT '8, 10, 12, 14',
  document_type VARCHAR(60) DEFAULT NULL COMMENT 'ex: RG (Novo)',
  document_front_path VARCHAR(512) DEFAULT NULL,
  document_back_path VARCHAR(512) DEFAULT NULL,
  -- 1.5 Procurador e conta
  has_procurator TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=Não, 1=Sim',
  energy_bill_password VARCHAR(255) DEFAULT NULL,
  energy_bill_path VARCHAR(512) DEFAULT NULL,
  has_pending_debts TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=Não, 1=Sim',
  payment_proof_path VARCHAR(512) DEFAULT NULL,
  -- metadados
  representante_id BIGINT UNSIGNED NOT NULL,
  eligibility_status VARCHAR(32) NOT NULL DEFAULT 'nao_verificado',
  status VARCHAR(32) DEFAULT 'new',
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
  CONSTRAINT fk_leads_representante FOREIGN KEY (representante_id) REFERENCES representantes(id)
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

-- Exemplo de registros iniciais em config (opcional)
-- INSERT INTO config (namespace, `key`, value) VALUES
-- ('app', 'api_base_url', 'https://api.seudominio.com'),
-- ('ingress', 'rate_limit_per_minute', '60')
-- ON DUPLICATE KEY UPDATE value = VALUES(value);
