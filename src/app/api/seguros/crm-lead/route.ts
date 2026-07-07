import { NextRequest, NextResponse } from "next/server";
import {
  assignLeadResponsavel,
  buildStableLeadEmail,
  cleanString,
  createLeadActivity,
  existingTagNames,
  findCrmUserIdByRepresentative,
  getCrmConfig,
  onlyDigits,
  splitName,
  upsertCrmLead,
} from "@/lib/crm/phd-crm-client";
import { assignRepresentativeToLead } from "@/lib/random-service/client";

export const runtime = "nodejs";

type SegurosCrmStep = "vehicle" | "contact";
type SegurosFunil = "seguros" | "seguro-auto";

type SegurosCrmPayload = {
  step: SegurosCrmStep;
  session_id?: string;
  crm_lead_id?: number;
  funil?: SegurosFunil;
  values?: {
    vehicleType?: string;
    plate?: string;
    model?: string;
    vehicleUse?: string;
    garage?: string;
    name?: string;
    cpfCnpj?: string;
    email?: string;
    phone?: string;
    cep?: string;
  };
};

const TAGS_BY_STEP: Record<SegurosCrmStep, string[]> = {
  vehicle: [
    "whatsapp-n8n",
    "produto-seguros",
    "seguros-site",
    "seguros-cotacao-iniciada",
    "seguros-step-1",
  ],
  contact: [
    "whatsapp-n8n",
    "produto-seguros",
    "seguros-site",
    "seguros-cotacao-iniciada",
    "seguros-step-1",
    "seguros-step-2",
    "seguros-cotacao-completa",
    "seguros-whatsapp-redirecionado",
  ],
};

function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function resolveFunil(payload: SegurosCrmPayload): SegurosFunil {
  return payload.funil === "seguro-auto" ? "seguro-auto" : "seguros";
}

function buildLeadPayload(config: ReturnType<typeof getCrmConfig>, payload: SegurosCrmPayload) {
  const values = payload.values || {};
  const funil = resolveFunil(payload);
  const name = cleanString(values.name, 180);
  const phoneDigits = onlyDigits(values.phone);
  const email = cleanString(values.email, 180).toLowerCase();
  const cpfCnpj = cleanString(values.cpfCnpj, 32);
  const cepDigits = onlyDigits(values.cep);
  const { firstName, lastName } = splitName(name);

  if (!phoneDigits || phoneDigits.length < 10) {
    throw new Error("Telefone inválido para criar lead no CRM");
  }
  if (!name) {
    throw new Error("Nome obrigatório para criar lead no CRM");
  }

  const customValues: Record<string, string> = {
    funil,
    origem_canal: "site",
    lead_intention: funil === "seguro-auto" ? "Cotacao seguro auto" : "Cotacao seguro veicular",
    main_pain: funil === "seguro-auto" ? "cotacao de seguro auto" : "cotacao de seguro veicular",
    seguros_step: payload.step,
    seguros_session_id: cleanString(payload.session_id, 80),
    vehicle_type: cleanString(values.vehicleType, 80),
    vehicle_plate: cleanString(values.plate, 20),
    vehicle_model: cleanString(values.model, 160),
    vehicle_use: cleanString(values.vehicleUse, 160),
    garage: cleanString(values.garage, 80),
  };

  if (payload.step === "contact") {
    customValues.document_number = cpfCnpj;
    customValues.cep = cepDigits;
    customValues.seguros_quote_status = "contact_completed";
    if (email) customValues.contact_email = email;
  } else {
    customValues.seguros_quote_status = "vehicle_completed";
  }

  Object.keys(customValues).forEach((key) => {
    if (!customValues[key]) delete customValues[key];
  });

  return {
    email: buildStableLeadEmail(phoneDigits, config.tenantSlug),
    first_name: firstName,
    last_name: lastName,
    phone: phoneDigits,
    tenant_slug: config.tenantSlug,
    source: funil === "seguro-auto" ? "site_seguro_auto" : "site_seguros",
    status: "new",
    stage: payload.step === "contact" ? "Avaliando" : "Curioso",
    pain_point: customValues.main_pain,
    custom_values: customValues,
  };
}

function buildActivityDescription(payload: SegurosCrmPayload): string {
  const values = payload.values || {};
  const funil = resolveFunil(payload);
  const lines = [
    `Origem: /${funil}`,
    `Etapa: ${payload.step === "contact" ? "Dados de contato" : "Veiculo"}`,
    payload.session_id ? `Sessao: ${payload.session_id}` : null,
    `Nome: ${cleanString(values.name) || "-"}`,
    `WhatsApp: ${cleanString(values.phone) || "-"}`,
    `Tipo: ${cleanString(values.vehicleType) || "-"}`,
    `Placa: ${cleanString(values.plate) || "-"}`,
    `Modelo: ${cleanString(values.model) || "-"}`,
    `Aplicativo ou Táxi: ${cleanString(values.vehicleUse) || "-"}`,
    `Garagem própria para pernoite: ${cleanString(values.garage) || "-"}`,
  ];

  if (payload.step === "contact") {
    lines.push(
      `CPF/CNPJ: ${cleanString(values.cpfCnpj) || "-"}`,
      `E-mail: ${cleanString(values.email) || "-"}`,
      `CEP: ${cleanString(values.cep) || "-"}`
    );
  }

  return lines.filter(Boolean).join("\n");
}

export async function POST(request: NextRequest) {
  let payload: SegurosCrmPayload;
  try {
    payload = (await request.json()) as SegurosCrmPayload;
  } catch {
    return jsonError("JSON inválido", 400);
  }

  if (payload.step !== "vehicle" && payload.step !== "contact") {
    return jsonError("step inválido", 400);
  }

  let config: ReturnType<typeof getCrmConfig>;
  try {
    config = getCrmConfig();
  } catch (error) {
    console.error("Seguros CRM config:", error instanceof Error ? error.message : error);
    return jsonError("CRM não configurado", 503);
  }

  try {
    const leadBody = buildLeadPayload(config, payload);
    const phoneDigits = onlyDigits(payload.values?.phone);

    const lead = await upsertCrmLead(config, leadBody, {
      crmLeadId: payload.crm_lead_id,
      phoneDigits,
      tags: TAGS_BY_STEP[payload.step],
    });
    const tags = existingTagNames(lead).length
      ? existingTagNames(lead)
      : TAGS_BY_STEP[payload.step];

    let activityCreated = false;
    try {
      const title =
        payload.step === "contact"
          ? "Seguros: dados de contato preenchidos"
          : "Seguros: cotacao iniciada";
      await createLeadActivity(config, lead.id, title, buildActivityDescription(payload));
      activityCreated = true;
    } catch (activityError) {
      console.error(
        "Seguros CRM activity:",
        activityError instanceof Error ? activityError.message : activityError
      );
    }

    let responsavelAssigned: { userId: number; representativeName: string } | null = null;
    let rotationApproved = false;

    if (payload.step === "contact") {
      const leadName = cleanString(payload.values?.name, 180);
      const leadPhone = onlyDigits(payload.values?.phone);
      try {
        const assignment = await assignRepresentativeToLead({
          segmento: "seguros",
          leadName,
          leadPhone,
          assignResponsavel: async (representative) => {
            const userId = await findCrmUserIdByRepresentative(
              config,
              representative,
              "Seguros CRM responsavel"
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
      } catch (responsavelError) {
        console.error(
          "Seguros CRM responsavel:",
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
        rotation_approved: rotationApproved,
      },
    });
  } catch (error) {
    console.error("Seguros CRM lead:", error instanceof Error ? error.message : error);
    return jsonError(error instanceof Error ? error.message : "Erro ao sincronizar lead no CRM", 502);
  }
}
