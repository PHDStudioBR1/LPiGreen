import { trackChannelEvent } from "@/lib/analytics/track-channel";

const CHANNEL = "home" as const;
const LANDING_VARIANT = "home";

function homeExtra(
  extra: Record<string, string | number | boolean | undefined> = {}
) {
  return {
    page_path: "/",
    landing_variant: LANDING_VARIANT,
    ...extra,
  };
}

export function trackHomePageView() {
  trackChannelEvent(CHANNEL, "home_page_view", homeExtra({ step: "page_view" }));
}

function trackHomeConversion(location: string, ctaType: "cta" | "whatsapp_float") {
  const params = homeExtra({
    step: "cta_click",
    location,
    cta_type: ctaType,
    destination: "whatsapp_redirect",
  });

  trackChannelEvent(CHANNEL, "home_cta_click", params);
  trackChannelEvent(CHANNEL, "home_redirect_click", params);
  trackChannelEvent(CHANNEL, "generate_lead", {
    ...params,
    step: "lead_created",
    lead_source: "home_redirect",
    currency: "BRL",
    value: 1,
  });
}

export function trackHomeCTAClick(location: string) {
  trackHomeConversion(location, "cta");
}

export function trackHomeWhatsAppClick(location: string) {
  trackHomeConversion(location, "whatsapp_float");
}

export function trackHomeFaqExpand(faqId: string) {
  trackChannelEvent(CHANNEL, "home_faq_expand", homeExtra({ faq_id: faqId }));
}

export function trackHomeSimulatorUse(billValue: number) {
  trackChannelEvent(CHANNEL, "home_simulator_use", homeExtra({ bill_value: billValue }));
}

export function trackHomeModalOpen() {
  trackChannelEvent(CHANNEL, "home_modal_open", homeExtra({ step: "quote_started" }));
}

export function trackHomeModalClose() {
  trackChannelEvent(CHANNEL, "home_modal_close", homeExtra());
}

export function trackHomeFormStep(step: number) {
  trackChannelEvent(CHANNEL, "home_form_step", homeExtra({ step: "form_step", form_step: step }));
}

export function trackHomeFormSubmit(params: { valor_medio_fatura: number }) {
  const eventParams = homeExtra({
    step: "form_submit",
    valor_medio_fatura: params.valor_medio_fatura,
  });

  trackChannelEvent(CHANNEL, "home_form_submit", eventParams);
  trackChannelEvent(CHANNEL, "generate_lead", {
    ...eventParams,
    step: "lead_created",
    lead_source: "home_form",
    currency: "BRL",
    value: 1,
  });
}
