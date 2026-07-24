import { trackGtagEvent } from "@/lib/analytics/gtag";
import { pushDataLayer } from "@/lib/analytics/data-layer";
import { isGtmContainerConfigured } from "@/lib/analytics/gtm-mode";
import { mirrorChannelEventToPostHog, type PostHogCapture } from "@/lib/analytics/posthog-mirror";
import {
  buildChannelEvent,
  type ChannelEventPayload,
  type MarketingChannel,
  type ConversionStep,
} from "@/lib/analytics/channels";

type Extra = Record<string, string | number | boolean | undefined>;

function browserPostHogCapture(): PostHogCapture | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    posthog?: {
      capture?: (event: string, properties?: Record<string, unknown>) => void;
      __loaded?: boolean;
    };
  };
  const client = w.posthog;
  if (!client?.capture) return null;
  return (event, properties) => {
    client.capture?.(event, properties);
  };
}

/**
 * Dispara evento de canal em dataLayer (GTM) + PostHog.
 * Com GTM configurado, não envia gtag direto (evita duplicar GA4 Channel Events).
 * Sem GTM, mantém gtag direto como fallback.
 */
export function trackChannelEvent(
  channel: MarketingChannel,
  eventName: string,
  extra: Extra & { step?: ConversionStep; page_path?: string; location?: string } = {}
) {
  const payload: ChannelEventPayload = buildChannelEvent(channel, eventName, extra);

  if (!isGtmContainerConfigured()) {
    const gtagParams: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (key === "event") continue;
      if (value === undefined) continue;
      gtagParams[key] = value;
    }
    trackGtagEvent(eventName, gtagParams);
  }

  pushDataLayer(payload);
  mirrorChannelEventToPostHog(payload, browserPostHogCapture());
}
