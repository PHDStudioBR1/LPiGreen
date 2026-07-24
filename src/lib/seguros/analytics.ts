import { trackChannelEvent } from "@/lib/analytics/track-channel";
import { buildFormSubmitEvents } from "@/lib/analytics/lead-conversion";
import {
  trackMetaFormProgress,
  trackMetaLeadConversion,
  trackMetaQuoteStarted,
} from "@/lib/analytics/meta-events";

const CHANNEL = "seguros" as const;
const FUNNEL = "seguros" as const;

function resolvePagePath(): string {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return "/seguros";
}

export function trackSegurosPageView() {
  trackChannelEvent(CHANNEL, "seguros_page_view", {
    step: "page_view",
    page_path: resolvePagePath(),
  });
}

export function trackSegurosCTAClick(location: string) {
  trackChannelEvent(CHANNEL, "seguros_cta_click", {
    step: "cta_click",
    location,
    page_path: resolvePagePath(),
  });
}

export function trackSegurosQuoteClick(location: string) {
  trackSegurosCTAClick(location);
}

export function trackSegurosWhatsAppClick(location: string) {
  const page_path = resolvePagePath();
  trackChannelEvent(CHANNEL, "seguros_whatsapp_click", {
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

export function trackSegurosNavClick(section: string) {
  trackChannelEvent(CHANNEL, "seguros_nav_click", {
    section,
    page_path: resolvePagePath(),
  });
}

export function trackSegurosExitIntent(action: "show" | "dismiss" | "quote" | "whatsapp") {
  trackChannelEvent(CHANNEL, "seguros_exit_intent", {
    action,
    page_path: resolvePagePath(),
  });
}

export function trackSegurosModalOpen() {
  trackChannelEvent(CHANNEL, "seguros_modal_open", {
    step: "quote_started",
    page_path: resolvePagePath(),
  });
  trackMetaQuoteStarted(FUNNEL);
}

export function trackSegurosModalClose() {
  trackChannelEvent(CHANNEL, "seguros_modal_close", {
    page_path: resolvePagePath(),
  });
}

export function trackSegurosFormStep(step: number) {
  trackChannelEvent(CHANNEL, "seguros_form_step", {
    step: "form_step",
    form_step: step,
    page_path: resolvePagePath(),
  });
  trackMetaFormProgress(FUNNEL, step);
}

export function trackSegurosPlanSelect(plan: string) {
  trackChannelEvent(CHANNEL, "seguros_plan_select", {
    plan,
    page_path: resolvePagePath(),
  });
}

export function trackSegurosFormSubmit(params: {
  vehicle_type: string;
  vehicle_use: string;
  lead_id?: string | number;
  event_id?: string;
}) {
  const page_path = resolvePagePath();
  for (const payload of buildFormSubmitEvents({
    channel: CHANNEL,
    formEvent: "seguros_form_submit",
    leadSource: "seguros_form",
    pagePath: page_path,
    leadId: params.lead_id,
    extra: {
      vehicle_type: params.vehicle_type,
      vehicle_use: params.vehicle_use,
      ...(params.event_id ? { event_id: params.event_id } : {}),
    },
  })) {
    const { event, ...extra } = payload;
    trackChannelEvent(CHANNEL, event, extra);
  }
  trackMetaLeadConversion(FUNNEL, params);
}

export function trackSegurosFaqExpand(faqId: string) {
  trackChannelEvent(CHANNEL, "seguros_faq_expand", {
    faq_id: faqId,
    page_path: resolvePagePath(),
  });
}
