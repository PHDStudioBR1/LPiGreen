import { NextRequest, NextResponse } from "next/server";
import { assignCrmLeadRepresentative } from "@/lib/crm/assign-crm-lead-representative";
import {
  brazilIsoNow,
  buildSessionLeadEmail,
  buildSessionPlaceholderPhone,
  cleanString,
  createLeadActivity,
  existingTagNames,
  getCrmConfig,
  onlyDigits,
  splitName,
  upsertCrmLead,
} from "@/lib/crm/phd-crm-client";
import { getRepresentativeLinkForSegment } from "@/lib/random-service/client";
import { PAGE_SEGMENT_MAP } from "@/lib/random-service/segments";

export const runtime = "nodejs";

type TelecomCrmStep = "activation" | "details" | "contact";

type TelecomCrmPayload = {
  step: TelecomCrmStep;
  session_id?: string;
  crm_lead_id?: number;
  values?: {
    activationType?: string;
    name?: string;
    email?: string;
    cpfCnpj?: string;
    chipType?: string;
    portNumber?: string;
    currentOperator?: string;
    ddd?: string;
    selectedPlan?: string;
  };
};

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

/**
 * Número real só na portabilidade (portNumber).
 * Em linha nova / etapa inicial usamos placeholder por sessão — o DDD fica em custom_values.
 * Placeholder compartilhado (ex.: 0000000000 ou DDD+900000000) colide em idx_leads_phone_unique_active.
 */
function resolveTelecomPhone(
  values: TelecomCrmPayload["values"],
  sessionId: string
): { phone: string; isPlaceholder: boolean } {
  const portDigits = onlyDigits(values?.portNumber);
  if (portDigits.length >= 10) {
    return { phone: portDigits, isPlaceholder: false };
  }

  return {
    phone: buildSessionPlaceholderPhone(sessionId || `telecom-${Date.now()}`),
    isPlaceholder: true,
  };
}

function buildLeadPayload(config: ReturnType<typeof getCrmConfig>, payload: TelecomCrmPayload) {
  const values = payload.values || {};
  const name = cleanString(values.name, 180);
  const contactEmail = cleanString(values.email, 180).toLowerCase();
  const cpfCnpj = cleanString(values.cpfCnpj, 32);
  const cpfDigits = onlyDigits(values.cpfCnpj);
  const sessionId = cleanString(payload.session_id, 80);
  const { phone: phoneDigits, isPlaceholder } = resolveTelecomPhone(values, sessionId);
  const activationLabel =
    cleanString(values.activationType) === "portabilidade" ? "Portabilidade" : "Linha Nova";
  const { firstName, lastName } = splitName(name || `Lead Telecom ${activationLabel}`);

  if (payload.step === "details" || payload.step === "contact") {
    if (!name) {
      throw new Error("Nome obrigatório para criar lead no CRM");
    }
    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      throw new Error("E-mail inválido para criar lead no CRM");
    }
    if (cpfDigits.length < 11) {
      throw new Error("CPF/CNPJ inválido para criar lead no CRM");
    }
  }

  if (payload.step === "contact") {
    if (!cleanString(values.selectedPlan)) {
      throw new Error("Plano obrigatório para criar lead no CRM");
    }
    // Portabilidade exige número real; linha nova segue com placeholder único + DDD em custom_values.
    if (
      cleanString(values.activationType) === "portabilidade" &&
      (isPlaceholder || phoneDigits.length < 10)
    ) {
      throw new Error("Telefone inválido para criar lead no CRM");
    }
    if (cleanString(values.activationType) === "linha_nova" && !onlyDigits(values?.ddd)) {
      throw new Error("DDD obrigatório para criar lead no CRM");
    }
  }

  const customValues: Record<string, string> = {
    funil: "telecom",
    origem_canal: "site",
    lead_intention: "Contratacao plano telecom",
    main_pain: "contratacao plano celular",
    telecom_step: payload.step,
    telecom_session_id: sessionId,
    site_submitted_at: brazilIsoNow(),
    activation_type: cleanString(values.activationType, 40),
    chip_type: cleanString(values.chipType, 20),
    port_number: cleanString(values.portNumber, 32),
    current_operator: cleanString(values.currentOperator, 80),
    ddd: cleanString(values.ddd, 4),
    selected_plan: cleanString(values.selectedPlan, 40),
  };

  if (payload.step === "details" || payload.step === "contact") {
    customValues.document_number = cpfCnpj;
    customValues.contact_name = name;
    if (contactEmail) customValues.contact_email = contactEmail;
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
    email: buildSessionLeadEmail(sessionId || `telecom-${Date.now()}`, config.tenantSlug, "telecom"),
    first_name: firstName,
    last_name: lastName,
    phone: phoneDigits,
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
    `Nome: ${cleanString(values.name) || "-"}`,
    `E-mail: ${cleanString(values.email) || "-"}`,
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

  let config: ReturnType<typeof getCrmConfig>;
  try {
    config = getCrmConfig(request.headers.get("host"));
  } catch (error) {
    console.error("Telecom CRM config:", error instanceof Error ? error.message : error);
    return jsonError("CRM não configurado", 503);
  }

  try {
    const leadBody = buildLeadPayload(config, payload);

    const lead = await upsertCrmLead(config, leadBody, {
      crmLeadId: payload.crm_lead_id,
      tags: TAGS_BY_STEP[payload.step],
    });
    const tags = existingTagNames(lead).length
      ? existingTagNames(lead)
      : TAGS_BY_STEP[payload.step];

    let activityCreated = false;
    try {
      const title =
        payload.step === "contact"
          ? "Telecom: plano selecionado"
          : payload.step === "details"
            ? "Telecom: dados preenchidos"
            : "Telecom: contratacao iniciada";
      await createLeadActivity(config, lead.id, title, buildActivityDescription(payload));
      activityCreated = true;
    } catch (activityError) {
      console.error(
        "Telecom CRM activity:",
        activityError instanceof Error ? activityError.message : activityError
      );
    }

    let responsavelAssigned: { userId: number; representativeName: string } | null = null;
    let rotationApproved = false;
    let representativeLink: string | null = null;

    if (payload.step === "contact") {
      try {
        const assignment = await assignCrmLeadRepresentative({
          config,
          leadId: lead.id,
          segmento: PAGE_SEGMENT_MAP.telecom,
          leadName: cleanString(payload.values?.name) || "Lead Telecom",
          leadPhone: resolveTelecomPhone(payload.values, cleanString(payload.session_id, 80)).phone,
          logPrefix: "Telecom CRM responsavel",
          notify: {
            segmento: "telecom",
            formValues: payload.values,
          },
        });

        rotationApproved = assignment.rotationApproved;
        representativeLink = getRepresentativeLinkForSegment(
          assignment.representative,
          PAGE_SEGMENT_MAP.telecom
        );
        if (assignment.responsavelId != null) {
          responsavelAssigned = {
            userId: assignment.responsavelId,
            representativeName: assignment.representative.name,
          };
        }
      } catch (responsavelError) {
        console.error(
          "Telecom CRM responsavel:",
          responsavelError instanceof Error ? responsavelError.message : responsavelError,
          { lead_id: lead.id, session_id: payload.session_id }
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
        rotation_approved: rotationApproved,
        representative_link: representativeLink,
      },
    });
  } catch (error) {
    console.error("Telecom CRM lead:", error instanceof Error ? error.message : error);
    const message = error instanceof Error ? error.message : "Erro ao sincronizar lead no CRM";
    // Evitar 502: proxies (Traefik/Cloudflare) substituem o body e a UI perde a mensagem real.
    const status = /unique constraint|duplicate key/i.test(message) ? 409 : 400;
    return jsonError(message, status);
  }
}
