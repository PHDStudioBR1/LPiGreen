import { trackChannelEvent } from "@/lib/analytics/track-channel";
import { buildFormSubmitEvents } from "@/lib/analytics/lead-conversion";
import {
  trackMetaFormProgress,
  trackMetaLeadConversion,
  trackMetaQuoteStarted,
} from "@/lib/analytics/meta-events";

const CHANNEL = "telecom" as const;
const FUNNEL = "telecom" as const;

function resolvePagePath(): string {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return "/telecom";
}

function emitPayloads(
  events: ReturnType<typeof buildFormSubmitEvents>
) {
  for (const payload of events) {
    const { event, ...extra } = payload;
    trackChannelEvent(CHANNEL, event, extra);
  }
}

export function trackTelecomPageView() {
  trackChannelEvent(CHANNEL, "telecom_page_view", {
    step: "page_view",
    page_path: resolvePagePath(),
  });
}

export function trackTelecomCTAClick(location: string) {
  trackChannelEvent(CHANNEL, "telecom_cta_click", {
    step: "cta_click",
    location,
    page_path: resolvePagePath(),
  });
}

export function trackTelecomQuoteClick(location: string) {
  trackTelecomCTAClick(location);
}

export function trackTelecomWhatsAppClick(location: string) {
  const page_path = resolvePagePath();
  trackChannelEvent(CHANNEL, "telecom_whatsapp_click", {
    step: "whatsapp_click",
    location,
    page_path,
    cta_type: "whatsapp",
  });
  trackChannelEvent(CHANNEL, "generate_lead", {
    step: "lead_created",
    location,
    page_path,
    lead_source: "whatsapp",
    currency: "BRL",
    value: 1,
  });
}

export function trackTelecomNavClick(section: string) {
  trackChannelEvent(CHANNEL, "telecom_nav_click", {
    section,
    page_path: resolvePagePath(),
  });
}

export function trackTelecomExitIntent(action: "show" | "dismiss" | "quote" | "whatsapp") {
  trackChannelEvent(CHANNEL, "telecom_exit_intent", {
    action,
    page_path: resolvePagePath(),
  });
}

export function trackTelecomModalOpen() {
  trackChannelEvent(CHANNEL, "telecom_modal_open", {
    step: "quote_started",
    page_path: resolvePagePath(),
  });
  trackMetaQuoteStarted(FUNNEL);
}

export function trackTelecomModalClose() {
  trackChannelEvent(CHANNEL, "telecom_modal_close", {
    page_path: resolvePagePath(),
  });
}

export function trackTelecomFormStep(step: number) {
  trackChannelEvent(CHANNEL, "telecom_form_step", {
    step: "form_step",
    form_step: step,
    page_path: resolvePagePath(),
  });
  trackMetaFormProgress(FUNNEL, step);
}

export function trackTelecomPlanSelect(plan: string) {
  trackChannelEvent(CHANNEL, "telecom_plan_select", {
    plan,
    page_path: resolvePagePath(),
  });
}

export function trackTelecomFormSubmit(params: {
  plan_type: string;
  portability: string;
  lead_id?: string | number;
  event_id?: string;
}) {
  const page_path = resolvePagePath();
  emitPayloads(
    buildFormSubmitEvents({
      channel: CHANNEL,
      formEvent: "telecom_form_submit",
      leadSource: "telecom_form",
      pagePath: page_path,
      leadId: params.lead_id,
      extra: {
        plan_type: params.plan_type,
        portability: params.portability,
        ...(params.event_id ? { event_id: params.event_id } : {}),
      },
    })
  );
  trackMetaLeadConversion(FUNNEL, {
    plan_type: params.plan_type,
    portability: params.portability,
    lead_id: params.lead_id,
    event_id: params.event_id,
  });
}

export function trackTelecomFaqExpand(faqId: string) {
  trackChannelEvent(CHANNEL, "telecom_faq_expand", {
    faq_id: faqId,
    page_path: resolvePagePath(),
  });
}

export function trackTelecomSimulatorUse(dataGb: string) {
  trackChannelEvent(CHANNEL, "telecom_simulator_use", {
    data_gb: dataGb,
    page_path: resolvePagePath(),
  });
}
