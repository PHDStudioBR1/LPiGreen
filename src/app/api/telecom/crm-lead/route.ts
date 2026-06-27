import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type TelecomCrmStep = "activation" | "details" | "contact";

type TelecomCrmPayload = {
  step: TelecomCrmStep;
  session_id?: string;
  values?: {
    activationType?: string;
    cpfCnpj?: string;
    chipType?: string;
    portNumber?: string;
    currentOperator?: string;
    ddd?: string;
    selectedPlan?: string;
  };
};

type CrmConfig = {
  env: "dev" | "prod";
  baseUrl: string;
  email: string;
  password: string;
  tenantSlug: string;
};

type CrmLogin = {
  accessToken: string;
  userId: number | null;
  expiresAt: number;
};

type CrmLead = {
  id: number;
  tags?: Array<string | { name?: string }>;
};

type CrmUser = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
};

type RandomServiceRepresentative = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

type CrmResponse<T = unknown> = {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
};

const TOKEN_CACHE: Partial<Record<CrmConfig["env"], CrmLogin>> = {};

const TAGS_BY_STEP: Record<TelecomCrmStep, string[]> = {
  activation: [
    "whatsapp-n8n",
    "produto-telecom",
    "telecom-site",
    "telecom-contratacao-iniciada",
    "telecom-step-1",
  ],
  details: [
    "whatsapp-n8n",
    "produto-telecom",
    "telecom-site",
    "telecom-contratacao-iniciada",
    "telecom-step-1",
    "telecom-step-2",
  ],
  contact: [
    "whatsapp-n8n",
    "produto-telecom",
    "telecom-site",
    "telecom-contratacao-iniciada",
    "telecom-step-1",
    "telecom-step-2",
    "telecom-step-3",
    "telecom-contratacao-completa",
  ],
};

function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function cleanString(value: unknown, maxLength = 255): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function onlyDigits(value: unknown): string {
  return cleanString(value).replace(/\D/g, "");
}

function getCrmConfig(): CrmConfig {
  const rawEnv = cleanString(process.env.PHDCRM_ENV || process.env.CRM_ENV || "dev").toLowerCase();
  const env: CrmConfig["env"] = rawEnv === "prod" || rawEnv === "production" ? "prod" : "dev";
  const prefix = env === "prod" ? "PHDCRM_PROD" : "PHDCRM_DEV";

  const baseUrl =
    cleanString(process.env.PHDCRM_BASE_URL) ||
    cleanString(process.env[`${prefix}_BASE_URL`]) ||
    (env === "prod"
      ? "https://phdcrm.546digitalservices.com"
      : "https://phdcrmdev.546digitalservices.com");

  const email =
    cleanString(process.env.PHDCRM_EMAIL) ||
    cleanString(process.env[`${prefix}_EMAIL`]) ||
    "admin@igreen";

  const password =
    cleanString(process.env.PHDCRM_PASSWORD, 1024) ||
    cleanString(process.env[`${prefix}_PASSWORD`], 1024);

  const tenantSlug =
    cleanString(process.env.PHDCRM_TENANT_SLUG) ||
    cleanString(process.env[`${prefix}_TENANT_SLUG`]) ||
    "igreen";

  if (!password) {
    throw new Error(`PHDCRM password missing for ${env}`);
  }

  return {
    env,
    baseUrl: baseUrl.replace(/\/$/, ""),
    email,
    password,
    tenantSlug,
  };
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

async function login(config: CrmConfig, force = false): Promise<CrmLogin> {
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

async function crmRequest<T>(
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

function existingTagNames(lead: CrmLead): string[] {
  return (lead.tags || [])
    .map((tag) => (typeof tag === "string" ? tag : tag.name))
    .filter((name): name is string => Boolean(name));
}

function buildLeadPayload(config: CrmConfig, payload: TelecomCrmPayload) {
  const values = payload.values || {};
  const cpfCnpj = cleanString(values.cpfCnpj, 32);
  const cpfDigits = onlyDigits(values.cpfCnpj);
  const portDigits = onlyDigits(values.portNumber);
  const ddd = cleanString(values.ddd, 4);
  const phoneDigits =
    portDigits.length >= 10 ? portDigits : ddd ? `${ddd}000000000`.slice(0, 11) : cpfDigits.slice(0, 11);
  const placeholderTenant = config.tenantSlug.replace(/[^a-z0-9_.-]/gi, "").toLowerCase() || "igreen";
  const activationLabel =
    cleanString(values.activationType) === "portabilidade" ? "Portabilidade" : "Linha Nova";

  if (payload.step === "contact") {
    if (cpfDigits.length < 11) {
      throw new Error("CPF/CNPJ inválido para criar lead no CRM");
    }
    if (!cleanString(values.selectedPlan)) {
      throw new Error("Plano obrigatório para criar lead no CRM");
    }
  }

  const customValues: Record<string, string> = {
    funil: "telecom",
    origem_canal: "site",
    lead_intention: "Contratacao plano telecom",
    main_pain: "contratacao plano celular",
    telecom_step: payload.step,
    telecom_session_id: cleanString(payload.session_id, 80),
    activation_type: cleanString(values.activationType, 40),
    chip_type: cleanString(values.chipType, 20),
    port_number: cleanString(values.portNumber, 32),
    current_operator: cleanString(values.currentOperator, 80),
    ddd: ddd,
    selected_plan: cleanString(values.selectedPlan, 40),
  };

  if (payload.step === "details" || payload.step === "contact") {
    customValues.document_number = cpfCnpj;
  }

  if (payload.step === "contact") {
    customValues.telecom_quote_status = "contact_completed";
  } else if (payload.step === "details") {
    customValues.telecom_quote_status = "details_completed";
  } else {
    customValues.telecom_quote_status = "activation_selected";
  }

  Object.keys(customValues).forEach((key) => {
    if (!customValues[key]) delete customValues[key];
  });

  return {
    email: `${cpfDigits || phoneDigits || "lead"}@w.phdcrm.${placeholderTenant}.local`,
    first_name: "Lead",
    last_name: `Telecom ${activationLabel}`.slice(0, 80),
    phone: phoneDigits || "0000000000",
    tenant_slug: config.tenantSlug,
    source: "site_telecom",
    status: "new",
    stage: payload.step === "contact" ? "Avaliando" : "Curioso",
    pain_point: "contratacao plano celular",
    custom_values: customValues,
  };
}

function buildActivityDescription(payload: TelecomCrmPayload): string {
  const values = payload.values || {};
  const stepLabel =
    payload.step === "contact"
      ? "Plano selecionado"
      : payload.step === "details"
        ? "Dados preenchidos"
        : "Tipo de ativacao";

  const lines = [
    "Origem: /telecom",
    `Etapa: ${stepLabel}`,
    payload.session_id ? `Sessao: ${payload.session_id}` : null,
    `Tipo: ${cleanString(values.activationType) || "-"}`,
    `CPF/CNPJ: ${cleanString(values.cpfCnpj) || "-"}`,
    `Chip: ${cleanString(values.chipType) || "-"}`,
    `Numero a portar: ${cleanString(values.portNumber) || "-"}`,
    `Operadora atual: ${cleanString(values.currentOperator) || "-"}`,
    `DDD: ${cleanString(values.ddd) || "-"}`,
    `Plano: ${cleanString(values.selectedPlan) || "-"}`,
  ];

  return lines.filter(Boolean).join("\n");
}

async function upsertLead(config: CrmConfig, payload: TelecomCrmPayload): Promise<CrmLead> {
  const body = buildLeadPayload(config, payload);
  const result = await crmRequest<CrmLead>(config, "/api/crm/v1/leads", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!result.data?.id) {
    throw new Error("CRM did not return lead id");
  }
  return result.data;
}

async function mergeTags(config: CrmConfig, lead: CrmLead, step: TelecomCrmStep): Promise<string[]> {
  const merged = [...new Set([...existingTagNames(lead), ...TAGS_BY_STEP[step]])];
  const result = await crmRequest<CrmLead>(config, `/api/crm/v1/leads/${lead.id}`, {
    method: "PUT",
    body: JSON.stringify({ tags: merged }),
  });
  return existingTagNames(result.data || { id: lead.id, tags: merged });
}

async function fetchNextRepresentative(
  leadName: string,
  leadPhone: string
): Promise<RandomServiceRepresentative | null> {
  const randomServiceUrl = process.env.RANDOM_SERVICE_URL ?? "http://random-service-api";
  const res = await fetch(`${randomServiceUrl}/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome_lead: leadName, telefone: leadPhone, segmento: "telecom" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`random-service HTTP ${res.status}`);
  const body = (await res.json()) as { representative?: RandomServiceRepresentative };
  if (!body.representative) throw new Error("random-service: representative ausente na resposta");
  return body.representative;
}

async function searchCrmUsers(config: CrmConfig, search: string): Promise<CrmUser[]> {
  const encoded = encodeURIComponent(search.trim());
  const body = await crmRequest<CrmUser[]>(config, `/api/crm/v1/users?search=${encoded}&limit=20`, {
    method: "GET",
  });
  return Array.isArray(body.data) ? body.data : [];
}

async function findCrmUserIdByRepresentative(
  config: CrmConfig,
  representative: RandomServiceRepresentative
): Promise<number | null> {
  if (representative.email) {
    const email = representative.email.toLowerCase().trim();
    const users = await searchCrmUsers(config, email);
    const match = users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match.id;
  }

  if (representative.name) {
    const nameLower = representative.name.trim().toLowerCase();
    const users = await searchCrmUsers(config, representative.name.trim());
    const match = users.find((u) => {
      const full = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim().toLowerCase();
      return full === nameLower || full.startsWith(nameLower) || nameLower.startsWith(full);
    });
    if (match) return match.id;
  }

  return null;
}

async function assignResponsavel(config: CrmConfig, leadId: number, responsavelId: number): Promise<void> {
  await crmRequest(config, `/api/crm/v1/leads/${leadId}`, {
    method: "PUT",
    body: JSON.stringify({ responsavel_id: responsavelId }),
  });
}

async function createActivity(config: CrmConfig, leadId: number, payload: TelecomCrmPayload) {
  const auth = await login(config);
  const title =
    payload.step === "contact"
      ? "Telecom: plano selecionado"
      : payload.step === "details"
        ? "Telecom: dados preenchidos"
        : "Telecom: contratacao iniciada";

  return crmRequest(config, "/api/crm/v1/activities", {
    method: "POST",
    body: JSON.stringify({
      lead_id: leadId,
      user_id: auth.userId,
      type: "note",
      title,
      description: buildActivityDescription(payload),
      due_date: null,
    }),
  });
}

export async function POST(request: NextRequest) {
  let payload: TelecomCrmPayload;
  try {
    payload = (await request.json()) as TelecomCrmPayload;
  } catch {
    return jsonError("JSON inválido", 400);
  }

  if (payload.step !== "activation" && payload.step !== "details" && payload.step !== "contact") {
    return jsonError("step inválido", 400);
  }

  let config: CrmConfig;
  try {
    config = getCrmConfig();
  } catch (error) {
    console.error("Telecom CRM config:", error instanceof Error ? error.message : error);
    return jsonError("CRM não configurado", 503);
  }

  try {
    const lead = await upsertLead(config, payload);
    const tags = await mergeTags(config, lead, payload.step);

    let activityCreated = false;
    try {
      await createActivity(config, lead.id, payload);
      activityCreated = true;
    } catch (activityError) {
      console.error(
        "Telecom CRM activity:",
        activityError instanceof Error ? activityError.message : activityError
      );
    }

    let responsavelAssigned: { userId: number; representativeName: string } | null = null;
    if (payload.step === "contact") {
      const leadName = "Lead Telecom";
      const portDigits = onlyDigits(payload.values?.portNumber);
      const ddd = cleanString(payload.values?.ddd, 4);
      const leadPhone =
        portDigits.length >= 10
          ? portDigits
          : ddd
            ? `${ddd}000000000`.slice(0, 11)
            : onlyDigits(payload.values?.cpfCnpj).slice(0, 11);
      try {
        const representative = await fetchNextRepresentative(leadName, leadPhone);
        if (representative) {
          const userId = await findCrmUserIdByRepresentative(config, representative);
          if (userId != null) {
            await assignResponsavel(config, lead.id, userId);
            responsavelAssigned = { userId, representativeName: representative.name };
          }
        }
      } catch (responsavelError) {
        console.error(
          "Telecom CRM responsavel:",
          responsavelError instanceof Error ? responsavelError.message : responsavelError
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        crm_env: config.env,
        lead_id: lead.id,
        tags,
        activity_created: activityCreated,
        responsavel_assigned: responsavelAssigned,
      },
    });
  } catch (error) {
    console.error("Telecom CRM lead:", error instanceof Error ? error.message : error);
    return jsonError("Erro ao sincronizar lead no CRM", 502);
  }
}
