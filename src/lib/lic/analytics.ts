import { trackGtagEvent } from "@/lib/analytics/gtag";

const PAGE_PATH = "/lic";

function licEventParams(
  extra: Record<string, string | number | boolean> = {}
): Record<string, string | number | boolean> {
  return { page_path: PAGE_PATH, landing_variant: "lic", ...extra };
}

function resolvePagePath(): string {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return PAGE_PATH;
}

export function trackLicPageView() {
  trackGtagEvent("lic_page_view", licEventParams({ page_path: resolvePagePath() }));
}

export function trackLicCTAClick(location: string) {
  const params = licEventParams({ location, cta_type: "form" });
  trackGtagEvent("lic_cta_click", params);
  trackGtagEvent("generate_lead", {
    ...params,
    lead_source: "lic_form",
    currency: "BRL",
    value: 1,
  });
}

export function trackLicWhatsAppClick(location: string) {
  const params = licEventParams({ location, cta_type: "whatsapp" });
  trackGtagEvent("lic_whatsapp_click", params);
  trackGtagEvent("generate_lead", {
    ...params,
    lead_source: "whatsapp",
    currency: "BRL",
    value: 1,
  });
}

export function trackLicFaqExpand(faqId: string) {
  trackGtagEvent("lic_faq_expand", licEventParams({ faq_id: faqId }));
}

export function trackLicModalOpen() {
  trackGtagEvent("lic_modal_open", licEventParams());
}

export function trackLicModalClose() {
  trackGtagEvent("lic_modal_close", licEventParams());
}

export function trackLicFormStep(step: number) {
  trackGtagEvent("lic_form_step", licEventParams({ step }));
}

export function trackLicFormSubmit(params: { cep?: string; valor_conta?: string }) {
  const eventParams = licEventParams(params);

  trackGtagEvent("lic_form_submit", eventParams);
  trackGtagEvent("generate_lead", {
    ...eventParams,
    lead_source: "lic_form",
    currency: "BRL",
    value: 1,
  });
}
