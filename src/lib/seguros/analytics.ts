import { trackGtagEvent } from "@/lib/analytics/gtag";

function resolvePagePath(): string {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return "/seguros";
}

export function trackSegurosPageView() {
  trackGtagEvent("seguros_page_view", { page_path: resolvePagePath() });
}

export function trackSegurosQuoteClick(location: string) {
  trackGtagEvent("seguros_quote_click", { location, page_path: resolvePagePath() });
}

export function trackSegurosWhatsAppClick(location: string) {
  trackGtagEvent("seguros_whatsapp_click", { location, page_path: resolvePagePath() });
}

export function trackSegurosNavClick(section: string) {
  trackGtagEvent("seguros_nav_click", { section, page_path: resolvePagePath() });
}

export function trackSegurosExitIntent(action: "show" | "dismiss" | "quote" | "whatsapp") {
  trackGtagEvent("seguros_exit_intent", { action, page_path: resolvePagePath() });
}

export function trackSegurosModalOpen() {
  trackGtagEvent("seguros_modal_open", { page_path: resolvePagePath() });
}

export function trackSegurosModalClose() {
  trackGtagEvent("seguros_modal_close", { page_path: resolvePagePath() });
}

export function trackSegurosFormStep(step: number) {
  trackGtagEvent("seguros_form_step", { step, page_path: resolvePagePath() });
}

export function trackSegurosPlanSelect(plan: string) {
  trackGtagEvent("seguros_plan_select", { plan, page_path: resolvePagePath() });
}

export function trackSegurosFormSubmit(params: {
  vehicle_type: string;
  vehicle_use: string;
}) {
  trackGtagEvent("seguros_form_submit", {
    ...params,
    page_path: resolvePagePath(),
  });
}

export function trackSegurosFaqExpand(faqId: string) {
  trackGtagEvent("seguros_faq_expand", { faq_id: faqId, page_path: resolvePagePath() });
}
