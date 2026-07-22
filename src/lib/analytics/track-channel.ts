import { trackGtagEvent } from "@/lib/analytics/gtag";
import { pushDataLayer } from "@/lib/analytics/data-layer";
import {
  buildChannelEvent,
  type ChannelEventPayload,
  type MarketingChannel,
  type ConversionStep,
} from "@/lib/analytics/channels";

type Extra = Record<string, string | number | boolean | undefined>;

/**
 * Dispara evento de canal em GA4 (gtag) + dataLayer (GTM).
 * Mantém gtag direto até o container GTM assumir 100% das tags.
 */
export function trackChannelEvent(
  channel: MarketingChannel,
  eventName: string,
  extra: Extra & { step?: ConversionStep; page_path?: string; location?: string } = {}
) {
  const payload: ChannelEventPayload = buildChannelEvent(channel, eventName, extra);

  const gtagParams: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (key === "event") continue;
    if (value === undefined) continue;
    gtagParams[key] = value;
  }

  trackGtagEvent(eventName, gtagParams);
  pushDataLayer(payload);
}
