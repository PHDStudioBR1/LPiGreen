import { trackGtagEvent } from "@/lib/analytics/gtag";

const PAGE_PATH = "/seguros";

export function trackSegurosPageView() {
  trackGtagEvent("seguros_page_view", { page_path: PAGE_PATH });
}

export function trackSegurosQuoteClick(location: string) {
  trackGtagEvent("seguros_quote_click", { location, page_path: PAGE_PATH });
}

export function trackSegurosWhatsAppClick(location: string) {
  trackGtagEvent("seguros_whatsapp_click", { location, page_path: PAGE_PATH });
}

export function trackSegurosNavClick(section: string) {
  trackGtagEvent("seguros_nav_click", { section, page_path: PAGE_PATH });
}

export function trackSegurosExitIntent(action: "show" | "dismiss" | "quote" | "whatsapp") {
  trackGtagEvent("seguros_exit_intent", { action, page_path: PAGE_PATH });
}

export function trackSegurosModalOpen() {
  trackGtagEvent("seguros_modal_open", { page_path: PAGE_PATH });
}

export function trackSegurosModalClose() {
  trackGtagEvent("seguros_modal_close", { page_path: PAGE_PATH });
}

export function trackSegurosFormStep(step: number) {
  trackGtagEvent("seguros_form_step", { step, page_path: PAGE_PATH });
}

export function trackSegurosPlanSelect(plan: string) {
  trackGtagEvent("seguros_plan_select", { plan, page_path: PAGE_PATH });
}

export function trackSegurosFormSubmit(params: {
  plan: string;
  vehicle_type: string;
  vehicle_use: string;
}) {
  trackGtagEvent("seguros_form_submit", {
    ...params,
    page_path: PAGE_PATH,
  });
}

export function trackSegurosFaqExpand(faqId: string) {
  trackGtagEvent("seguros_faq_expand", { faq_id: faqId, page_path: PAGE_PATH });
}
