import type { ChannelEventPayload } from "@/lib/analytics/channels";

/**
 * Empilha eventos no dataLayer (GTM). Seguro no SSR (no-op).
 * Tipo de window.dataLayer declarado em gtag.ts.
 */
export function pushDataLayer(payload: ChannelEventPayload | Record<string, unknown>) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...payload,
    event_timestamp: new Date().toISOString(),
  });
}
