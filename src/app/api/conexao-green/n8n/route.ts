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
import {
  buildMetaCapiEventId,
  clientIpFromHeaders,
  sendMetaCapiLead,
} from "@/lib/analytics/meta-capi";

export const runtime = "nodejs";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL?.trim() ?? "";

const CONEXAO_GREEN_TAGS = [
  "whatsapp-n8n",
  "produto-conexao",
  "conexao-green-site",
  "conexao-green-qualificacao",
];

function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

async function forwardToN8n(body: Record<string, unknown>) {
  if (!N8N_WEBHOOK_URL) {
    return { skipped: true as const, status: 503, detail: "N8N_WEBHOOK_URL não configurada" };
  }

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return { skipped: false as const, status: res.status, text };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("JSON inválido", 400);
  }

  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  if (nome.length < 2) {
    return jsonError("Campo nome é obrigatório", 400);
  }

  const whatsappRaw =
    typeof body.whatsapp === "string"
      ? body.whatsapp
      : typeof body.whatsapp_apenas_numeros === "string"
        ? body.whatsapp_apenas_numeros
        : "";
  const phoneDigits = onlyDigits(whatsappRaw);
  if (phoneDigits.length < 10) {
    return jsonError("WhatsApp inválido", 400);
  }

  let config: ReturnType<typeof getCrmConfig>;
  try {
    config = getCrmConfig(request.headers.get("host"));
  } catch (error) {
    console.error("Conexao Green CRM config:", error instanceof Error ? error.message : error);
    return jsonError("CRM não configurado", 503);
  }

  const sessionId =
    cleanString(body.session_id, 80) ||
    cleanString(body.conexao_session_id, 80) ||
    `conexao-${Date.now()}`;
  const { firstName, lastName } = splitName(nome);
  const valorFatura =
    body.valor_medio_fatura_mensal != null
      ? String(body.valor_medio_fatura_mensal)
      : body.valor_medio_fatura_formatado != null
        ? String(body.valor_medio_fatura_formatado)
        : "";

  try {
    const lead = await upsertCrmLead(
      config,
      {
        email: buildSessionLeadEmail(sessionId, config.tenantSlug, "conexao-green"),
        first_name: firstName,
        last_name: lastName,
        phone: phoneDigits,
        tenant_slug: config.tenantSlug,
        source: "site_conexao_green",
        status: "new",
        stage: "Curioso",
        pain_point: "economia na conta de luz",
        custom_values: {
          funil: "conexao_green",
          origem_canal: "site",
          lead_intention: "Qualificacao conexao green",
          main_pain: "economia na conta de luz",
          conexao_session_id: sessionId,
          site_submitted_at: brazilIsoNow(),
          valor_medio_fatura_mensal: valorFatura,
          valor_medio_fatura_formatado: cleanString(body.valor_medio_fatura_formatado, 40),
          poupanca_anual_projetada:
            body.poupanca_anual_projetada != null ? String(body.poupanca_anual_projetada) : "",
        },
        tags: CONEXAO_GREEN_TAGS,
      },
      { tags: CONEXAO_GREEN_TAGS }
    );

    try {
      await createLeadActivity(
        config,
        lead.id,
        "Conexao Green: qualificacao enviada",
        [
          "Origem: / (Conexao Green)",
          `Sessao: ${sessionId}`,
          `Nome: ${nome}`,
          `WhatsApp: ${cleanString(body.whatsapp, 32) || phoneDigits}`,
          `Valor medio fatura: ${valorFatura || "-"}`,
        ].join("\n")
      );
    } catch (activityError) {
      console.error(
        "Conexao Green CRM activity:",
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
        segmento: PAGE_SEGMENT_MAP.conexao_green,
        leadName: nome,
        leadPhone: phoneDigits,
        logPrefix: "Conexao Green CRM responsavel",
        notify: {
          segmento: "conexao_green",
          formValues: {
            name: nome,
            whatsapp: cleanString(body.whatsapp, 32) || phoneDigits,
            valor_medio_fatura: valorFatura,
          },
        },
      });

      rotationApproved = assignment.rotationApproved;
      representativeLink = getRepresentativeLinkForSegment(
        assignment.representative,
        PAGE_SEGMENT_MAP.conexao_green
      );
      if (assignment.responsavelId != null) {
        responsavelAssigned = {
          userId: assignment.responsavelId,
          representativeName: assignment.representative.name,
        };
      }
    } catch (responsavelError) {
      console.error(
        "Conexao Green CRM responsavel:",
        responsavelError instanceof Error ? responsavelError.message : responsavelError,
        { lead_id: lead.id, session_id: sessionId }
      );
    }

    const n8nPayload = {
      ...body,
      session_id: sessionId,
      crm_lead_id: lead.id,
      crm_env: config.env,
      representante_nome: responsavelAssigned?.representativeName ?? null,
      representante_crm_user_id: responsavelAssigned?.userId ?? null,
      representante_link: representativeLink,
    };

    let n8nResult: { skipped: boolean; status: number; text?: string; detail?: string };
    try {
      n8nResult = await forwardToN8n(n8nPayload);
    } catch (err) {
      console.error("Conexao Green n8n:", err);
      n8nResult = { skipped: false, status: 502, detail: "Falha ao contactar o webhook n8n" };
    }

    if (!n8nResult.skipped && n8nResult.status >= 400) {
      return NextResponse.json(
        {
          success: false,
          error: n8nResult.detail || `Webhook n8n HTTP ${n8nResult.status}`,
          data: {
            crm_env: config.env,
            lead_id: lead.id,
            responsavel_assigned: responsavelAssigned,
            rotation_approved: rotationApproved,
            representative_link: representativeLink,
          },
        },
        { status: 502 }
      );
    }

    let metaEventId = buildMetaCapiEventId(lead.id, "Lead");
    const capi = await sendMetaCapiLead({
      funnel: "home",
      leadId: lead.id,
      phone: phoneDigits,
      eventSourceUrl: request.headers.get("referer") || undefined,
      clientIp: clientIpFromHeaders(request.headers),
      clientUserAgent: request.headers.get("user-agent") || undefined,
    });
    if (!capi.ok) {
      console.error("Conexao Green Meta CAPI:", capi.error, {
        lead_id: lead.id,
        status: capi.status,
      });
    }
    if (capi.eventId) metaEventId = capi.eventId;

    return NextResponse.json({
      success: true,
      data: {
        crm_env: config.env,
        lead_id: lead.id,
        responsavel_assigned: responsavelAssigned,
        rotation_approved: rotationApproved,
        representative_link: representativeLink,
        n8n_skipped: n8nResult.skipped,
        meta_event_id: metaEventId,
      },
    });
  } catch (error) {
    console.error("Conexao Green CRM lead:", error instanceof Error ? error.message : error);
    return jsonError(error instanceof Error ? error.message : "Erro ao registrar lead", 502);
  }
}
