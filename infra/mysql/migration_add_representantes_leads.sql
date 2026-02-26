-- ============================================================
-- Migração manual: criação de representantes e vínculo em leads
-- Uso previsto: rodar UMA VEZ no banco já em produção
-- Banco: igreen_captacao
-- ============================================================

USE igreen_captacao;

-- 1) Cria tabela de representantes (caso ainda não exista)
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

-- 2) Insere os representantes iniciais (id fixo não é assumido;
--    usamos o link_cadastro como chave única)
INSERT INTO representantes (nome, link_cadastro, tipo_produto)
VALUES
  ('Marcelo Narita', 'https://digital.igreenenergy.com.br/?id=121530', 'conexao'),
  ('Donavan Alencar', 'https://digital.igreenenergy.com.br/?id=121534', 'conexao')
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  tipo_produto = VALUES(tipo_produto),
  ativo = 1;

-- 3) Adiciona coluna de relacionamento em leads (permitindo NULL
--    temporariamente para conseguirmos popular os dados existentes)
ALTER TABLE leads
  ADD COLUMN representante_id BIGINT UNSIGNED NULL;

-- 4) Distribui os leads já existentes alternando entre os dois representantes
--    (Lead1 -> Marcelo, Lead2 -> Donavan, Lead3 -> Marcelo, Lead4 -> Donavan, ...).
--    Esta lógica assume que existem exatamente 2 representantes iniciais,
--    que é o cenário atual.

SET @rep1 := (SELECT id FROM representantes ORDER BY id LIMIT 1 OFFSET 0);
SET @rep2 := (SELECT id FROM representantes ORDER BY id LIMIT 1 OFFSET 1);
SET @rep_count := (SELECT COUNT(*) FROM representantes);
SET @toggle := 0;

UPDATE leads l
JOIN (
  SELECT id, (@toggle := 1 - @toggle) AS flag
  FROM leads
  ORDER BY id
) seq ON l.id = seq.id
SET l.representante_id =
  CASE
    WHEN @rep_count >= 2 THEN CASE WHEN seq.flag = 0 THEN @rep1 ELSE @rep2 END
    WHEN @rep_count = 1 THEN @rep1
    ELSE l.representante_id
  END
WHERE l.representante_id IS NULL;

-- 5) Torna o relacionamento obrigatório e cria índice/foreign key
ALTER TABLE leads
  MODIFY COLUMN representante_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE leads
  ADD KEY idx_representante (representante_id),
  ADD CONSTRAINT fk_leads_representante FOREIGN KEY (representante_id) REFERENCES representantes(id);

