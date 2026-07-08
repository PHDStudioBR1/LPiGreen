import { NextRequest, NextResponse } from "next/server";
import { assignCrmLeadRepresentative } from "@/lib/crm/assign-crm-lead-representative";
import {
  brazilIsoNow,
  buildSessionLeadEmail,
  cleanString,
  createLeadActivity,
  getCrmConfig,
  onlyDigits,
  splitName,
  upsertCrmLead,
} from "@/lib/crm/phd-crm-client";
import { getRepresentativeLinkForSegment } from "@/lib/random-service/client";
import { PAGE_SEGMENT_MAP } from "@/lib/random-service/segments";

export const runtime = "nodejs";

type CaptacaoCrmPayload = {
  session_id?: string;
  mysql_lead_id?: number;
  source?: string;
  values?: {
    name?: string;
    phone?: string;
    email?: string;
    document_number?: string;
    cep_landing?: string;
    valor_conta?: string | number;
    city?: string;
    state?: string;
    power_company?: string;
    installation_number?: string;
  };
};

const CAPTACAO_TAGS = [
  "whatsapp-n8n",
  "produto-conexao",
  "captacao-site",
  "captacao-completa",
];

function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function buildLeadPayload(
  config: ReturnType<typeof getCrmConfig>,
  payload: CaptacaoCrmPayload
) {
  const values = payload.values || {};
  const name = cleanString(values.name, 180);
  const phoneDigits = onlyDigits(values.phone);
  const contactEmail = cleanString(values.email, 180).toLowerCase();
  const sessionId = cleanString(payload.session_id, 80);
  const { firstName, lastName } = splitName(name || "Lead Captacao");

  if (!phoneDigits || phoneDigits.length < 10) {
    throw new Error("Telefone inválido para criar lead no CRM");
  }
  if (!name) {
    throw new Error("Nome obrigatório para criar lead no CRM");
  }

  const customValues: Record<string, string> = {
    funil: "captacao",
    origem_canal: "site",
    lead_intention: "Cadastro energia conexao",
    main_pain: "economia na conta de luz",
    captacao_session_id: sessionId,
    site_submitted_at: brazilIsoNow(),
    document_number: cleanString(values.document_number, 32),
    cep_landing: cleanString(values.cep_landing, 10),
    valor_conta: values.valor_conta != null ? String(values.valor_conta) : "",
    city: cleanString(values.city, 120),
    state: cleanString(values.state, 2),
    power_company: cleanString(values.power_company, 120),
    installation_number: cleanString(values.installation_number, 60),
    captacao_quote_status: "completed",
  };

  if (contactEmail) customValues.contact_email = contactEmail;
  if (payload.mysql_lead_id != null) {
    customValues.mysql_lead_id = String(payload.mysql_lead_id);
  }

  Object.keys(customValues).forEach((key) => {
    if (!customValues[key]) delete customValues[key];
  });

  return {
    email: buildSessionLeadEmail(sessionId || `captacao-${Date.now()}`, config.tenantSlug, "captacao"),
    first_name: firstName,
    last_name: lastName,
    phone: phoneDigits,
    tenant_slug: config.tenantSlug,
    source: cleanString(payload.source, 64) || "site_captacao",
    status: "new",
    stage: "Avaliando",
    pain_point: "economia na conta de luz",
    custom_values: customValues,
    tags: CAPTACAO_TAGS,
  };
}

export async function POST(request: NextRequest) {
  let payload: CaptacaoCrmPayload;
  try {
    payload = (await request.json()) as CaptacaoCrmPayload;
  } catch {
    return jsonError("JSON inválido", 400);
  }

  let config: ReturnType<typeof getCrmConfig>;
  try {
    config = getCrmConfig(request.headers.get("host"));
  } catch (error) {
    console.error("Captacao CRM config:", error instanceof Error ? error.message : error);
    return jsonError("CRM não configurado", 503);
  }

  try {
    const leadBody = buildLeadPayload(config, payload);
    const lead = await upsertCrmLead(config, leadBody, { tags: CAPTACAO_TAGS });

    try {
      const values = payload.values || {};
      await createLeadActivity(
        config,
        lead.id,
        "Captacao: cadastro completo",
        [
          "Origem: formulario captacao",
          payload.session_id ? `Sessao: ${payload.session_id}` : null,
          payload.mysql_lead_id != null ? `Lead MySQL #${payload.mysql_lead_id}` : null,
          `Nome: ${cleanString(values.name) || "-"}`,
          `Telefone: ${cleanString(values.phone) || "-"}`,
          `E-mail: ${cleanString(values.email) || "-"}`,
          `CPF/CNPJ: ${cleanString(values.document_number) || "-"}`,
        ]
          .filter(Boolean)
          .join("\n")
      );
    } catch (activityError) {
      console.error(
        "Captacao CRM activity:",
        activityError instanceof Error ? activityError.message : activityError
      );
    }

    let responsavelAssigned: { userId: number; representativeName: string } | null = null;
    let rotationApproved = false;
    let representativeLink: string | null = null;

    try {
      const assignment = await assignCrmLeadRepresentative({
        config,
        leadId: lead.id,
        segmento: PAGE_SEGMENT_MAP.captacao,
        leadName: cleanString(payload.values?.name, 180) || "Lead Captacao",
        leadPhone: onlyDigits(payload.values?.phone),
        logPrefix: "Captacao CRM responsavel",
        notify: {
          segmento: "captacao",
          formValues: payload.values,
        },
      });

      rotationApproved = assignment.rotationApproved;
      representativeLink = getRepresentativeLinkForSegment(
        assignment.representative,
        PAGE_SEGMENT_MAP.captacao
      );
      if (assignment.responsavelId != null) {
        responsavelAssigned = {
          userId: assignment.responsavelId,
          representativeName: assignment.representative.name,
        };
      }
    } catch (responsavelError) {
      console.error(
        "Captacao CRM responsavel:",
        responsavelError instanceof Error ? responsavelError.message : responsavelError,
        { lead_id: lead.id, session_id: payload.session_id }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        crm_env: config.env,
        lead_id: lead.id,
        responsavel_assigned: responsavelAssigned,
        rotation_approved: rotationApproved,
        representative_link: representativeLink,
      },
    });
  } catch (error) {
    console.error("Captacao CRM lead:", error instanceof Error ? error.message : error);
    return jsonError(error instanceof Error ? error.message : "Erro ao sincronizar lead no CRM", 502);
  }
}
