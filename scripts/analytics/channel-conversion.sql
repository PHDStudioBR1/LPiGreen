-- Conversões por canal (iGreen) — rodar no phd-crm com tenant_id bind.
-- Canais: bot, telecom, seguros, seguro_auto (+ home/captacao opcional)

-- :tenant_id uuid
-- :days int

WITH bounds AS (
  SELECT now() - (:days || ' days')::interval AS since
),
src AS (
  SELECT * FROM (VALUES
    ('bot', 'whatsapp_evolution'),
    ('telecom', 'site_telecom'),
    ('seguros', 'site_seguros'),
    ('seguro_auto', 'site_seguro_auto'),
    ('home', 'site_captacao')
  ) AS t(channel, crm_source)
)
SELECT
  s.channel,
  s.crm_source,
  count(*) FILTER (WHERE l.created_at >= (SELECT since FROM bounds)) AS leads,
  count(*) FILTER (
    WHERE l.created_at >= (SELECT since FROM bounds) AND l.status = 'qualified'
  ) AS qualified,
  count(*) FILTER (
    WHERE l.created_at >= (SELECT since FROM bounds) AND l.status = 'converted'
  ) AS converted,
  count(*) FILTER (
    WHERE l.created_at >= (SELECT since FROM bounds) AND l.status = 'lost'
  ) AS lost
FROM src s
LEFT JOIN leads l
  ON l.tenant_id = :tenant_id
 AND l.source = s.crm_source
GROUP BY s.channel, s.crm_source
ORDER BY leads DESC;
