import { trackChannelEvent } from "@/lib/analytics/track-channel";

const CHANNEL = "seguro_auto" as const;

function resolvePagePath(): string {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return "/seguro-auto";
}

export function trackSeguroAutoPageView() {
  trackChannelEvent(CHANNEL, "seguro_auto_page_view", {
    step: "page_view",
    page_path: resolvePagePath(),
  });
}

export function trackSeguroAutoCTAClick(location: string) {
  trackChannelEvent(CHANNEL, "seguro_auto_cta_click", {
    step: "cta_click",
    location,
    page_path: resolvePagePath(),
  });
}

export function trackSeguroAutoQuoteClick(location: string) {
  trackSeguroAutoCTAClick(location);
}

export function trackSeguroAutoWhatsAppClick(location: string) {
  const page_path = resolvePagePath();
  trackChannelEvent(CHANNEL, "seguro_auto_whatsapp_click", {
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

export function trackSeguroAutoNavClick(section: string) {
  trackChannelEvent(CHANNEL, "seguro_auto_nav_click", {
    section,
    page_path: resolvePagePath(),
  });
}

export function trackSeguroAutoExitIntent(action: "show" | "dismiss" | "quote" | "whatsapp") {
  trackChannelEvent(CHANNEL, "seguro_auto_exit_intent", {
    action,
    page_path: resolvePagePath(),
  });
}

export function trackSeguroAutoModalOpen() {
  trackChannelEvent(CHANNEL, "seguro_auto_modal_open", {
    step: "quote_started",
    page_path: resolvePagePath(),
  });
}

export function trackSeguroAutoModalClose() {
  trackChannelEvent(CHANNEL, "seguro_auto_modal_close", {
    page_path: resolvePagePath(),
  });
}

export function trackSeguroAutoFormStep(step: number) {
  trackChannelEvent(CHANNEL, "seguro_auto_form_step", {
    step: "form_step",
    form_step: step,
    page_path: resolvePagePath(),
  });
}

export function trackSeguroAutoPlanSelect(plan: string) {
  trackChannelEvent(CHANNEL, "seguro_auto_plan_select", {
    plan,
    page_path: resolvePagePath(),
  });
}

export function trackSeguroAutoFormSubmit(params: {
  vehicle_type: string;
  vehicle_use: string;
}) {
  const page_path = resolvePagePath();
  trackChannelEvent(CHANNEL, "seguro_auto_form_submit", {
    step: "form_submit",
    ...params,
    page_path,
  });
  trackChannelEvent(CHANNEL, "generate_lead", {
    step: "lead_created",
    ...params,
    page_path,
    lead_source: "seguro_auto_form",
    currency: "BRL",
    value: 1,
  });
}

export function trackSeguroAutoFaqExpand(faqId: string) {
  trackChannelEvent(CHANNEL, "seguro_auto_faq_expand", {
    faq_id: faqId,
    page_path: resolvePagePath(),
  });
}

/** @deprecated Use trackSeguroAutoPageView */
export const trackSegurosPageView = trackSeguroAutoPageView;
/** @deprecated Use trackSeguroAutoQuoteClick */
export const trackSegurosQuoteClick = trackSeguroAutoQuoteClick;
/** @deprecated Use trackSeguroAutoWhatsAppClick */
export const trackSegurosWhatsAppClick = trackSeguroAutoWhatsAppClick;
/** @deprecated Use trackSeguroAutoNavClick */
export const trackSegurosNavClick = trackSeguroAutoNavClick;
/** @deprecated Use trackSeguroAutoExitIntent */
export const trackSegurosExitIntent = trackSeguroAutoExitIntent;
/** @deprecated Use trackSeguroAutoModalOpen */
export const trackSegurosModalOpen = trackSeguroAutoModalOpen;
/** @deprecated Use trackSeguroAutoModalClose */
export const trackSegurosModalClose = trackSeguroAutoModalClose;
/** @deprecated Use trackSeguroAutoFormStep */
export const trackSegurosFormStep = trackSeguroAutoFormStep;
/** @deprecated Use trackSeguroAutoPlanSelect */
export const trackSegurosPlanSelect = trackSeguroAutoPlanSelect;
/** @deprecated Use trackSeguroAutoFormSubmit */
export const trackSegurosFormSubmit = trackSeguroAutoFormSubmit;
/** @deprecated Use trackSeguroAutoFaqExpand */
export const trackSegurosFaqExpand = trackSeguroAutoFaqExpand;
