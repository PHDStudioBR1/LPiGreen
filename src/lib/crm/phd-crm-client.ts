export type CrmConfig = {
  env: "dev" | "prod";
  baseUrl: string;
  email: string;
  password: string;
  tenantSlug: string;
};

export type CrmLogin = {
  accessToken: string;
  userId: number | null;
  expiresAt: number;
};

export type CrmLead = {
  id: number;
  tags?: Array<string | { name?: string }>;
  custom_values?: Record<string, string | number | boolean | null>;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
};

export type CrmUser = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
};

export type CrmResponse<T = unknown> = {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
};

const TOKEN_CACHE: Partial<Record<CrmConfig["env"], CrmLogin>> = {};

export function cleanString(value: unknown, maxLength = 255): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function onlyDigits(value: unknown): string {
  return cleanString(value).replace(/\D/g, "");
}

export function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Lead",
    lastName: parts.slice(1).join(" ") || "Site",
  };
}

export function isDevCrmHost(host: string | null | undefined): boolean {
  const normalized = cleanString(host, 255).toLowerCase();
  if (!normalized) return false;
  return (
    normalized.includes("localhost") ||
    normalized.includes("127.0.0.1") ||
    normalized.includes("lpigreendev") ||
    normalized.endsWith(".local")
  );
}

function resolveCrmEnv(requestHost?: string | null): CrmConfig["env"] {
  const rawEnv = cleanString(process.env.PHDCRM_ENV || process.env.CRM_ENV || "dev").toLowerCase();
  let env: CrmConfig["env"] = rawEnv === "prod" || rawEnv === "production" ? "prod" : "dev";

  if (isDevCrmHost(requestHost)) {
    if (env === "prod") {
      console.warn(
        `PHDCRM_ENV=prod ignorado para host de desenvolvimento: ${requestHost}`
      );
    }
    return "dev";
  }

  if (process.env.NODE_ENV !== "production" && env === "prod") {
    const allowProd = cleanString(process.env.PHDCRM_ALLOW_PROD).toLowerCase();
    if (allowProd !== "true" && allowProd !== "1") {
      console.warn("PHDCRM_ENV=prod ignorado em NODE_ENV !== production (use PHDCRM_ALLOW_PROD=true para forçar)");
      return "dev";
    }
  }

  return env;
}

export function getCrmConfig(requestHost?: string | null): CrmConfig {
  const env = resolveCrmEnv(requestHost);
  const prefix = env === "prod" ? "PHDCRM_PROD" : "PHDCRM_DEV";

  const baseUrl =
    cleanString(process.env[`${prefix}_BASE_URL`]) ||
    cleanString(process.env.PHDCRM_BASE_URL) ||
    (env === "prod"
      ? "https://phdcrm.546digitalservices.com"
      : "https://phdcrmdev.546digitalservices.com");

  const email =
    cleanString(process.env[`${prefix}_EMAIL`]) ||
    cleanString(process.env.PHDCRM_EMAIL) ||
    "admin@igreen";

  const password =
    cleanString(process.env[`${prefix}_PASSWORD`], 1024) ||
    cleanString(process.env.PHDCRM_PASSWORD, 1024);

  const tenantSlug =
    cleanString(process.env.PHDCRM_TENANT_SLUG) ||
    cleanString(process.env[`${prefix}_TENANT_SLUG`]) ||
    "igreen";

  if (!password) {
    throw new Error(`PHDCRM password missing for ${env}`);
  }

  const config = {
    env,
    baseUrl: baseUrl.replace(/\/$/, ""),
    email,
    password,
    tenantSlug,
  };

  if (env === "dev" && config.baseUrl.includes("phdcrm.546digitalservices.com")) {
    throw new Error(
      "Configuração CRM inconsistente: PHDCRM_ENV=dev com URL de produção. Verifique PHDCRM_DEV_BASE_URL."
    );
  }

  return config;
}

async function readCrmJson<T>(res: Response): Promise<CrmResponse<T>> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as CrmResponse<T>;
  } catch {
    return { error: text.slice(0, 300) };
  }
}

export async function login(config: CrmConfig, force = false): Promise<CrmLogin> {
  const cached = TOKEN_CACHE[config.env];
  if (!force && cached && cached.expiresAt > Date.now() + 60_000) {
    return cached;
  }

  const res = await fetch(`${config.baseUrl}/api/crm/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: config.email,
      password: config.password,
      tenant_slug: config.tenantSlug,
    }),
    cache: "no-store",
  });
  const body = await readCrmJson<{
    accessToken?: string;
    user?: { id?: number };
    expiresAt?: string;
  }>(res);

  const accessToken = body.data?.accessToken;
  if (!res.ok || !accessToken) {
    throw new Error(body.error || body.message || "CRM login failed");
  }

  const expiresAt = body.data?.expiresAt
    ? new Date(body.data.expiresAt).getTime()
    : Date.now() + 20 * 60_000;

  const auth = {
    accessToken,
    userId: typeof body.data?.user?.id === "number" ? body.data.user.id : null,
    expiresAt,
  };
  TOKEN_CACHE[config.env] = auth;
  return auth;
}

export async function crmRequest<T>(
  config: CrmConfig,
  path: string,
  init: RequestInit,
  retry = true
): Promise<CrmResponse<T>> {
  const auth = await login(config);
  const res = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.accessToken}`,
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (res.status === 401 && retry) {
    await login(config, true);
    return crmRequest<T>(config, path, init, false);
  }

  const body = await readCrmJson<T>(res);
  if (!res.ok) {
    throw new Error(body.error || body.message || `CRM HTTP ${res.status}`);
  }
  return body;
}

export function existingTagNames(lead: CrmLead): string[] {
  return (lead.tags || [])
    .map((tag) => (typeof tag === "string" ? tag : tag.name))
    .filter((name): name is string => Boolean(name));
}

export function buildStableLeadEmail(phoneDigits: string, tenantSlug: string): string {
  const tenant = tenantSlug.replace(/[^a-z0-9_.-]/gi, "").toLowerCase() || "igreen";
  return `${phoneDigits}@w.phdcrm.${tenant}.local`;
}

/** E-mail técnico único por sessão do formulário (evita deduplicação no CRM por e-mail/telefone). */
export function buildSessionLeadEmail(
  sessionId: string,
  tenantSlug: string,
  prefix = "lead"
): string {
  const tenant = tenantSlug.replace(/[^a-z0-9_.-]/gi, "").toLowerCase() || "igreen";
  const safePrefix = prefix.replace(/[^a-z0-9_.-]/gi, "").toLowerCase() || "lead";
  const sessionSlug = sessionId.replace(/[^a-z0-9_.-]/gi, "").toLowerCase().slice(0, 48);
  const uniquePart = sessionSlug || `anon-${Date.now()}`;
  return `${safePrefix}-${uniquePart}@draft.phdcrm.${tenant}.local`;
}

export function resolveLeadEmail(
  phoneDigits: string,
  tenantSlug: string,
  realEmail?: string
): string {
  const normalized = cleanString(realEmail, 180).toLowerCase();
  if (normalized.includes("@")) return normalized;
  return buildStableLeadEmail(phoneDigits, tenantSlug);
}

export function isPlaceholderCrmEmail(email: string | null | undefined): boolean {
  const normalized = cleanString(email, 255).toLowerCase();
  if (!normalized) return true;
  return (
    normalized.includes("@w.phdcrm.") ||
    normalized.includes("@draft.phdcrm.") ||
    normalized.endsWith(".local")
  );
}

/** Data/hora atual em America/Sao_Paulo (YYYY-MM-DD HH:mm:ss). */
export function brazilIsoNow(): string {
  return new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" });
}

export function extractCrmLead(data: unknown): CrmLead | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (typeof record.id === "number") return record as CrmLead;
  const nested = record.lead;
  if (nested && typeof nested === "object" && typeof (nested as CrmLead).id === "number") {
    return nested as CrmLead;
  }
  return null;
}

export function isLikelyTagError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /tag/i.test(message);
}

export async function getLeadById(config: CrmConfig, leadId: number): Promise<CrmLead | null> {
  const body = await crmRequest<unknown>(config, `/api/crm/v1/leads/${leadId}`, { method: "GET" });
  return extractCrmLead(body.data);
}

export async function findLeadByPhone(config: CrmConfig, phoneDigits: string): Promise<CrmLead | null> {
  if (phoneDigits.length < 10) return null;

  const encodedPhone = encodeURIComponent(phoneDigits);
  const encodedTenant = encodeURIComponent(config.tenantSlug);
  const body = await crmRequest<CrmLead[] | { items?: CrmLead[] }>(
    config,
    `/api/crm/v1/leads?phone=${encodedPhone}&tenant_slug=${encodedTenant}&limit=5`,
    { method: "GET" }
  );

  const leads = Array.isArray(body.data)
    ? body.data
    : Array.isArray(body.data?.items)
      ? body.data.items
      : [];

  const matches = leads
    .filter((lead) => onlyDigits(lead.phone) === phoneDigits)
    .sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

  return matches[0] ?? null;
}

function mergeCustomValues(
  existing: CrmLead | null,
  nextCustomValues: Record<string, string>
): Record<string, string> {
  const merged: Record<string, string> = {};
  const existingValues = existing?.custom_values ?? {};

  for (const [key, value] of Object.entries(existingValues)) {
    if (value != null && String(value).trim()) {
      merged[key] = String(value);
    }
  }

  for (const [key, value] of Object.entries(nextCustomValues)) {
    if (value.trim()) merged[key] = value;
  }

  return merged;
}

/**
 * Cria ou atualiza lead no CRM.
 * Só atualiza (PUT) quando `crmLeadId` pertence à mesma sessão do formulário.
 * Nunca busca lead existente por telefone ou e-mail — cada envio gera registro novo.
 */
export async function upsertCrmLead(
  config: CrmConfig,
  payload: Record<string, unknown>,
  options: {
    crmLeadId?: number;
    tags?: string[];
  } = {}
): Promise<CrmLead> {
  const nextCustomValues =
    payload.custom_values && typeof payload.custom_values === "object"
      ? (payload.custom_values as Record<string, string>)
      : {};

  let existing: CrmLead | null = null;

  if (options.crmLeadId) {
    existing = await getLeadById(config, options.crmLeadId);
  }

  const mergedTags =
    options.tags && options.tags.length > 0
      ? [...new Set([...existingTagNames(existing ?? { id: 0 }), ...options.tags])]
      : undefined;

  const body: Record<string, unknown> = {
    ...payload,
    custom_values: mergeCustomValues(existing, nextCustomValues),
  };
  if (mergedTags) body.tags = mergedTags;

  const upsert = async (requestBody: Record<string, unknown>): Promise<CrmLead> => {
    if (existing?.id) {
      const result = await crmRequest<unknown>(config, `/api/crm/v1/leads/${existing.id}`, {
        method: "PUT",
        body: JSON.stringify(requestBody),
      });
      const lead = extractCrmLead(result.data);
      if (!lead) throw new Error("CRM did not return lead id on update");
      return lead;
    }

    const result = await crmRequest<unknown>(config, "/api/crm/v1/leads", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
    const lead = extractCrmLead(result.data);
    if (!lead) throw new Error("CRM did not return lead id");
    return lead;
  };

  try {
    return await upsert(body);
  } catch (error) {
    if (!mergedTags || !isLikelyTagError(error)) throw error;
    const { tags: _tags, ...bodyWithoutTags } = body;
    return upsert(bodyWithoutTags);
  }
}

export async function mergeLeadTags(
  config: CrmConfig,
  lead: CrmLead,
  tags: string[]
): Promise<string[]> {
  try {
    const updated = await upsertCrmLead(config, {}, { crmLeadId: lead.id, tags });
    return existingTagNames(updated);
  } catch (error) {
    console.warn(
      "mergeLeadTags:",
      error instanceof Error ? error.message : error
    );
    return existingTagNames(lead);
  }
}

export async function searchCrmUsers(config: CrmConfig, search: string): Promise<CrmUser[]> {
  const encoded = encodeURIComponent(search.trim());
  const body = await crmRequest<CrmUser[]>(config, `/api/crm/v1/users?search=${encoded}&limit=20`, {
    method: "GET",
  });
  return Array.isArray(body.data) ? body.data : [];
}

export async function findCrmUserIdByRepresentative(
  config: CrmConfig,
  representative: { email: string | null; name: string },
  logPrefix: string
): Promise<number | null> {
  if (representative.email) {
    const email = representative.email.toLowerCase().trim();
    const users = await searchCrmUsers(config, email);
    const match = users.find((user) => user.email?.toLowerCase() === email);
    if (match) {
      console.log(`${logPrefix}: usuário CRM encontrado por email (id=${match.id})`);
      return match.id;
    }
    console.warn(`${logPrefix}: email ${representative.email} não encontrou usuário CRM`);
  }

  if (representative.name) {
    const nameLower = representative.name.trim().toLowerCase();
    const users = await searchCrmUsers(config, representative.name.trim());
    const match = users.find((user) => {
      const full = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim().toLowerCase();
      return full === nameLower || full.startsWith(nameLower) || nameLower.startsWith(full);
    });
    if (match) {
      console.log(`${logPrefix}: usuário CRM encontrado por nome "${representative.name}" (id=${match.id})`);
      return match.id;
    }
    console.warn(`${logPrefix}: nome "${representative.name}" não encontrou usuário CRM`);
  }

  return null;
}

export async function assignLeadResponsavel(
  config: CrmConfig,
  leadId: number,
  responsavelId: number
): Promise<void> {
  await crmRequest(config, `/api/crm/v1/leads/${leadId}`, {
    method: "PUT",
    body: JSON.stringify({ responsavel_id: responsavelId }),
  });
}

export async function createLeadActivity(
  config: CrmConfig,
  leadId: number,
  title: string,
  description: string
): Promise<void> {
  const auth = await login(config);
  const activity: Record<string, unknown> = {
    lead_id: leadId,
    type: "note",
    title,
    description,
    due_date: null,
  };
  if (auth.userId != null) activity.user_id = auth.userId;
  await crmRequest(config, "/api/crm/v1/activities", {
    method: "POST",
    body: JSON.stringify(activity),
  });
}
