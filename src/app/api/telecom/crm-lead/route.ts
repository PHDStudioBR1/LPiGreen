import { NextRequest, NextResponse } from "next/server";
import {
  assignLeadResponsavel,
  brazilIsoNow,
  buildSessionLeadEmail,
  cleanString,
  createLeadActivity,
  existingTagNames,
  findCrmUserIdByRepresentative,
  getCrmConfig,
  onlyDigits,
  upsertCrmLead,
} from "@/lib/crm/phd-crm-client";
import { notifyRepresentativeOfNewLead } from "@/lib/email/representative-lead-notification";
import { assignRepresentativeToLead } from "@/lib/random-service/client";

export const runtime = "nodejs";

type TelecomCrmStep = "activation" | "details" | "contact";

type TelecomCrmPayload = {
  step: TelecomCrmStep;
  session_id?: string;
  crm_lead_id?: number;
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

function resolveTelecomPhone(values: TelecomCrmPayload["values"]): string {
  const portDigits = onlyDigits(values?.portNumber);
  if (portDigits.length >= 10) return portDigits;

  const ddd = onlyDigits(values?.ddd).slice(0, 2);
  if (ddd) return `${ddd}900000000`.slice(0, 11);

  return "";
}

function buildLeadPayload(config: ReturnType<typeof getCrmConfig>, payload: TelecomCrmPayload) {
  const values = payload.values || {};
  const cpfCnpj = cleanString(values.cpfCnpj, 32);
  const cpfDigits = onlyDigits(values.cpfCnpj);
  const phoneDigits = resolveTelecomPhone(values);
  const sessionId = cleanString(payload.session_id, 80);
  const activationLabel =
    cleanString(values.activationType) === "portabilidade" ? "Portabilidade" : "Linha Nova";

  if (payload.step === "details" || payload.step === "contact") {
    if (cpfDigits.length < 11) {
      throw new Error("CPF/CNPJ inválido para criar lead no CRM");
    }
  }

  if (payload.step === "contact") {
    if (!cleanString(values.selectedPlan)) {
      throw new Error("Plano obrigatório para criar lead no CRM");
    }
    if (phoneDigits.length < 10) {
      throw new Error("Telefone inválido para criar lead no CRM");
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

    if (payload.step === "contact") {
      const leadPhone = resolveTelecomPhone(payload.values);
      const leadName = "Lead Telecom";
      try {
        const assignment = await assignRepresentativeToLead({
          segmento: "telecom",
          leadName,
          leadPhone,
          assignResponsavel: async (representative) => {
            const userId = await findCrmUserIdByRepresentative(
              config,
              representative,
              "Telecom CRM responsavel"
            );
            if (userId != null) {
              await assignLeadResponsavel(config, lead.id, userId);
            }
            return userId;
          },
        });

        rotationApproved = assignment.rotationApproved;
        if (assignment.responsavelId != null) {
          responsavelAssigned = {
            userId: assignment.responsavelId,
            representativeName: assignment.representative.name,
          };
        }

        if (assignment.representative.email) {
          void notifyRepresentativeOfNewLead({
            segmento: "telecom",
            representative: assignment.representative,
            leadId: lead.id,
            crmEnv: config.env,
            formValues: payload.values,
          }).catch((err) =>
            console.error(
              "Telecom rep email:",
              err instanceof Error ? err.message : err
            )
          );
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
      },
    });
  } catch (error) {
    console.error("Telecom CRM lead:", error instanceof Error ? error.message : error);
    return jsonError(error instanceof Error ? error.message : "Erro ao sincronizar lead no CRM", 502);
  }
}
