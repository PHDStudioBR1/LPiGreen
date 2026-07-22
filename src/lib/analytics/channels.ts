/**
 * Taxonomia de canais iGreen — fonte única para CRM, GTM, GA4 e PostHog.
 * Google Ads: fora do escopo até alerta explícito do operador.
 */

export const MARKETING_CHANNELS = [
  "bot",
  "telecom",
  "seguros",
  "seguro_auto",
  "home",
] as const;

export type MarketingChannel = (typeof MARKETING_CHANNELS)[number];

/** Mapeia channel → leads.source no phd-crm (SoT). */
export const CHANNEL_CRM_SOURCE: Record<MarketingChannel, string> = {
  bot: "whatsapp_evolution",
  telecom: "site_telecom",
  seguros: "site_seguros",
  seguro_auto: "site_seguro_auto",
  home: "site_captacao",
};

/** Paths de LP → channel. */
export const PATH_TO_CHANNEL: Record<string, MarketingChannel> = {
  "/": "home",
  "/seguros": "seguros",
  "/seguro-auto": "seguro_auto",
  "/telecom": "telecom",
};

export type ConversionStep =
  | "page_view"
  | "cta_click"
  | "quote_started"
  | "form_step"
  | "form_submit"
  | "whatsapp_click"
  | "lead_created"
  | "lead_qualified"
  | "deal_won"
  | "bot_session_started"
  | "bot_step"
  | "bot_handoff"
  | "bot_abandoned";

export type ChannelEventPayload = {
  event: string;
  channel: MarketingChannel;
  crm_source: string;
  step?: ConversionStep;
  page_path?: string;
  location?: string;
  lead_id?: string | number;
  conversation_id?: string;
  [key: string]: string | number | boolean | undefined;
};

export function resolveChannelFromPath(pathname: string): MarketingChannel | null {
  const path = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  if (path === "") return "home";
  return PATH_TO_CHANNEL[path] ?? PATH_TO_CHANNEL[pathname] ?? null;
}

export function buildChannelEvent(
  channel: MarketingChannel,
  eventName: string,
  extra: Omit<Partial<ChannelEventPayload>, "event" | "channel" | "crm_source"> = {}
): ChannelEventPayload {
  return {
    event: eventName,
    channel,
    crm_source: CHANNEL_CRM_SOURCE[channel],
    ...extra,
  };
}

/** SQL filter helper (documentação / scripts). */
export function crmSourcesForChannels(channels: MarketingChannel[]): string[] {
  return channels.map((c) => CHANNEL_CRM_SOURCE[c]);
}
