import { trackGtagEvent } from "@/lib/analytics/gtag";

const LANDING_VARIANT = "home";

function homeEventParams(
  extra: Record<string, string | number | boolean> = {}
): Record<string, string | number | boolean> {
  return {
    page_path: "/",
    landing_variant: LANDING_VARIANT,
    ...extra,
  };
}

export function trackHomePageView() {
  trackGtagEvent("home_page_view", homeEventParams());
}

export function trackHomeCTAClick(location: string) {
  trackGtagEvent("home_cta_click", homeEventParams({ location, cta_type: "form" }));
}

export function trackHomeWhatsAppClick(location: string) {
  const params = homeEventParams({ location, cta_type: "whatsapp" });

  trackGtagEvent("home_whatsapp_click", params);
  trackGtagEvent("generate_lead", {
    ...params,
    lead_source: "whatsapp",
    currency: "BRL",
    value: 1,
  });
}

export function trackHomeFaqExpand(faqId: string) {
  trackGtagEvent("home_faq_expand", homeEventParams({ faq_id: faqId }));
}

export function trackHomeModalOpen() {
  trackGtagEvent("home_modal_open", homeEventParams());
}

export function trackHomeModalClose() {
  trackGtagEvent("home_modal_close", homeEventParams());
}

export function trackHomeFormStep(step: number) {
  trackGtagEvent("home_form_step", homeEventParams({ step }));
}

export function trackHomeFormSubmit(params: { valor_medio_fatura: number }) {
  const eventParams = homeEventParams({
    valor_medio_fatura: params.valor_medio_fatura,
  });

  trackGtagEvent("home_form_submit", eventParams);
  trackGtagEvent("generate_lead", {
    ...eventParams,
    lead_source: "home_form",
    currency: "BRL",
    value: 1,
  });
}
