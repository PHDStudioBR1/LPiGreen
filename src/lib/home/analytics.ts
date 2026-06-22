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
