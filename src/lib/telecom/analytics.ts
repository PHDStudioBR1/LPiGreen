import { trackGtagEvent } from "@/lib/analytics/gtag";

function resolvePagePath(): string {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return "/telecom";
}

export function trackTelecomPageView() {
  trackGtagEvent("telecom_page_view", { page_path: resolvePagePath() });
}

export function trackTelecomCTAClick(location: string) {
  trackGtagEvent("telecom_cta_click", { location, page_path: resolvePagePath() });
}

export function trackTelecomQuoteClick(location: string) {
  trackTelecomCTAClick(location);
}

export function trackTelecomWhatsAppClick(location: string) {
  const params = { location, page_path: resolvePagePath(), cta_type: "whatsapp" };
  trackGtagEvent("telecom_whatsapp_click", params);
  trackGtagEvent("generate_lead", {
    ...params,
    lead_source: "whatsapp",
    currency: "BRL",
    value: 1,
  });
}

export function trackTelecomNavClick(section: string) {
  trackGtagEvent("telecom_nav_click", { section, page_path: resolvePagePath() });
}

export function trackTelecomExitIntent(action: "show" | "dismiss" | "quote" | "whatsapp") {
  trackGtagEvent("telecom_exit_intent", { action, page_path: resolvePagePath() });
}

export function trackTelecomModalOpen() {
  trackGtagEvent("telecom_modal_open", { page_path: resolvePagePath() });
}

export function trackTelecomModalClose() {
  trackGtagEvent("telecom_modal_close", { page_path: resolvePagePath() });
}

export function trackTelecomFormStep(step: number) {
  trackGtagEvent("telecom_form_step", { step, page_path: resolvePagePath() });
}

export function trackTelecomPlanSelect(plan: string) {
  trackGtagEvent("telecom_plan_select", { plan, page_path: resolvePagePath() });
}

export function trackTelecomFormSubmit(params: {
  plan_type: string;
  portability: string;
}) {
  const eventParams = { ...params, page_path: resolvePagePath() };
  trackGtagEvent("telecom_form_submit", eventParams);
  trackGtagEvent("generate_lead", {
    ...eventParams,
    lead_source: "telecom_form",
    currency: "BRL",
    value: 1,
  });
}

export function trackTelecomFaqExpand(faqId: string) {
  trackGtagEvent("telecom_faq_expand", { faq_id: faqId, page_path: resolvePagePath() });
}

export function trackTelecomSimulatorUse(dataGb: string) {
  trackGtagEvent("telecom_simulator_use", { data_gb: dataGb, page_path: resolvePagePath() });
}
