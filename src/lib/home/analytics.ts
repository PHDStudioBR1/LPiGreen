import { trackChannelEvent } from "@/lib/analytics/track-channel";
import { buildChannelEvent, type ChannelEventPayload } from "@/lib/analytics/channels";
import { buildFormSubmitEvents } from "@/lib/analytics/lead-conversion";

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

/** Pure builder — usado por trackHomeWhatsAppClick e testes (GTM Contact = .*whatsapp_click). */
export function buildHomeWhatsAppClickEvents(
  location: string
): ChannelEventPayload[] {
  const base = homeExtra({
    step: "whatsapp_click",
    location,
    cta_type: "whatsapp_float",
    destination: "whatsapp_redirect",
  });

  return [
    buildChannelEvent(CHANNEL, "home_whatsapp_click", base),
    buildChannelEvent(CHANNEL, "generate_lead", {
      ...base,
      step: "lead_created",
      lead_source: "home_whatsapp",
      currency: "BRL",
      value: 1,
    }),
  ];
}

export function trackHomePageView() {
  trackChannelEvent(CHANNEL, "home_page_view", homeExtra({ step: "page_view" }));
}

function trackHomeCtaConversion(location: string) {
  const params = homeExtra({
    step: "cta_click",
    location,
    cta_type: "cta",
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
  trackHomeCtaConversion(location);
}

export function trackHomeWhatsAppClick(location: string) {
  for (const payload of buildHomeWhatsAppClickEvents(location)) {
    const { event, ...extra } = payload;
    trackChannelEvent(CHANNEL, event, extra);
  }
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

export function trackHomeFormSubmit(params: {
  valor_medio_fatura: number;
  lead_id?: string | number;
  event_id?: string;
}) {
  const events = buildFormSubmitEvents({
    channel: CHANNEL,
    formEvent: "home_form_submit",
    leadSource: "home_form",
    pagePath: "/",
    leadId: params.lead_id,
    extra: {
      landing_variant: LANDING_VARIANT,
      valor_medio_fatura: params.valor_medio_fatura,
      ...(params.event_id ? { event_id: params.event_id } : {}),
    },
  });

  for (const payload of events) {
    const { event, ...extra } = payload;
    trackChannelEvent(CHANNEL, event, extra);
  }
}
