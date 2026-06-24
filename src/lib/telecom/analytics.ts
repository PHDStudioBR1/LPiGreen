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

export function trackTelecomQuoteClick(location: string) {
  trackGtagEvent("telecom_quote_click", { location, page_path: resolvePagePath() });
}

export function trackTelecomWhatsAppClick(location: string) {
  trackGtagEvent("telecom_whatsapp_click", { location, page_path: resolvePagePath() });
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
  trackGtagEvent("telecom_form_submit", {
    ...params,
    page_path: resolvePagePath(),
  });
}

export function trackTelecomFaqExpand(faqId: string) {
  trackGtagEvent("telecom_faq_expand", { faq_id: faqId, page_path: resolvePagePath() });
}

export function trackTelecomSimulatorUse(dataGb: string) {
  trackGtagEvent("telecom_simulator_use", { data_gb: dataGb, page_path: resolvePagePath() });
}
