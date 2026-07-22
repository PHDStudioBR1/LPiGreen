import { trackChannelEvent } from "@/lib/analytics/track-channel";
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
}) {
  const page_path = resolvePagePath();
  trackChannelEvent(CHANNEL, "seguros_form_submit", {
    step: "form_submit",
    ...params,
    page_path,
  });
  trackChannelEvent(CHANNEL, "generate_lead", {
    step: "lead_created",
    ...params,
    page_path,
    lead_source: "seguros_form",
    currency: "BRL",
    value: 1,
  });
  trackMetaLeadConversion(FUNNEL, params);
}

export function trackSegurosFaqExpand(faqId: string) {
  trackChannelEvent(CHANNEL, "seguros_faq_expand", {
    faq_id: faqId,
    page_path: resolvePagePath(),
  });
}
