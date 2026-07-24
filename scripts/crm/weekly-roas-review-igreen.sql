-- Revisão semanal ROAS / atribuição iGreen (phd-crm)
-- Tenant: iGreen (slug=igreen)
-- Uso: psql ... -f scripts/crm/weekly-roas-review-igreen.sql

\set tenant_id '27a3da52-33bf-43b5-ad6c-063158026d01'

-- 1) Leads site 7d por source + status
SELECT
  COALESCE(l.source, '(null)') AS source,
  l.status,
  COUNT(*) AS leads,
  COUNT(*) FILTER (
    WHERE EXISTS (
      SELECT 1 FROM lead_custom_fields lcf
      WHERE lcf.lead_id = l.id
        AND lcf.tenant_id = l.tenant_id
        AND lcf.field_key IN ('utm_source', 'fbclid', 'gclid')
        AND NULLIF(TRIM(lcf.field_value), '') IS NOT NULL
    )
  ) AS com_atribuicao
FROM leads l
WHERE l.tenant_id = :'tenant_id'::uuid
  AND l.deleted_at IS NULL
  AND l.created_at >= NOW() - INTERVAL '7 days'
  AND (l.source ILIKE 'site_%' OR l.source IS NULL)
GROUP BY 1, 2
ORDER BY leads DESC;

-- 2) Breakdown UTM (custom fields) 7d
SELECT
  COALESCE(utm.field_value, '(sem utm_source)') AS utm_source,
  COUNT(DISTINCT l.id) AS leads,
  COUNT(DISTINCT l.id) FILTER (WHERE l.status IN ('qualified', 'converted')) AS avancaram,
  COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'converted') AS converted
FROM leads l
LEFT JOIN lead_custom_fields utm
  ON utm.lead_id = l.id
 AND utm.tenant_id = l.tenant_id
 AND utm.field_key = 'utm_source'
WHERE l.tenant_id = :'tenant_id'::uuid
  AND l.deleted_at IS NULL
  AND l.created_at >= NOW() - INTERVAL '7 days'
  AND l.source ILIKE 'site_%'
GROUP BY 1
ORDER BY leads DESC;

-- 3) Deals / receita 7d (ROAS de negócio — cruzar spend Meta/Google à mão)
SELECT
  d.status,
  COUNT(*) AS deals,
  COALESCE(SUM(d.value), 0) AS valor_total
FROM deals d
WHERE d.tenant_id = :'tenant_id'::uuid
  AND d.deleted_at IS NULL
  AND d.created_at >= NOW() - INTERVAL '7 days'
GROUP BY 1
ORDER BY deals DESC;

-- Checklist operacional:
-- [ ] Spend Meta 7d (Ads Manager)
-- [ ] Spend Google 7d (se houver)
-- [ ] CPA = spend / converted
-- [ ] ROAS = valor_won / spend (só com deals.value > 0)
-- [ ] Pausar criativos com CPL ok mas converted=0 e lost alto
