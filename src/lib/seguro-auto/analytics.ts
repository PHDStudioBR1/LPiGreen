import { trackGtagEvent } from "@/lib/analytics/gtag";
import {
  trackMetaFormProgress,
  trackMetaLeadConversion,
  trackMetaQuoteStarted,
} from "@/lib/analytics/meta-events";

const FUNNEL = "seguro-auto" as const;

function resolvePagePath(): string {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return "/seguro-auto";
}

export function trackSeguroAutoPageView() {
  trackGtagEvent("seguro_auto_page_view", { page_path: resolvePagePath() });
}

export function trackSeguroAutoCTAClick(location: string) {
  trackGtagEvent("seguro_auto_cta_click", { location, page_path: resolvePagePath() });
}

export function trackSeguroAutoQuoteClick(location: string) {
  trackSeguroAutoCTAClick(location);
}

export function trackSeguroAutoWhatsAppClick(location: string) {
  const params = { location, page_path: resolvePagePath(), cta_type: "whatsapp" };
  trackGtagEvent("seguro_auto_whatsapp_click", params);
  trackGtagEvent("generate_lead", {
    ...params,
    lead_source: "whatsapp",
    currency: "BRL",
    value: 1,
  });
}

export function trackSeguroAutoNavClick(section: string) {
  trackGtagEvent("seguro_auto_nav_click", { section, page_path: resolvePagePath() });
}

export function trackSeguroAutoExitIntent(action: "show" | "dismiss" | "quote" | "whatsapp") {
  trackGtagEvent("seguro_auto_exit_intent", { action, page_path: resolvePagePath() });
}

export function trackSeguroAutoModalOpen() {
  trackGtagEvent("seguro_auto_modal_open", { page_path: resolvePagePath() });
  trackMetaQuoteStarted(FUNNEL);
}

export function trackSeguroAutoModalClose() {
  trackGtagEvent("seguro_auto_modal_close", { page_path: resolvePagePath() });
}

export function trackSeguroAutoFormStep(step: number) {
  trackGtagEvent("seguro_auto_form_step", { step, page_path: resolvePagePath() });
  trackMetaFormProgress(FUNNEL, step);
}

export function trackSeguroAutoPlanSelect(plan: string) {
  trackGtagEvent("seguro_auto_plan_select", { plan, page_path: resolvePagePath() });
}

export function trackSeguroAutoFormSubmit(params: {
  vehicle_type: string;
  vehicle_use: string;
}) {
  const eventParams = { ...params, page_path: resolvePagePath() };
  trackGtagEvent("seguro_auto_form_submit", eventParams);
  trackGtagEvent("generate_lead", {
    ...eventParams,
    lead_source: "seguro_auto_form",
    currency: "BRL",
    value: 1,
  });
  trackMetaLeadConversion(FUNNEL, params);
}

export function trackSeguroAutoFaqExpand(faqId: string) {
  trackGtagEvent("seguro_auto_faq_expand", { faq_id: faqId, page_path: resolvePagePath() });
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
