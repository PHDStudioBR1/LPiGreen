import type { ChannelEventPayload } from "@/lib/analytics/channels";

export type PostHogCapture = (
  event: string,
  properties?: Record<string, string | number | boolean | undefined>
) => void;

/**
 * Espelha evento de canal no PostHog (browser).
 * Aceita capture injetável para testes sem posthog-js.
 */
export function mirrorChannelEventToPostHog(
  payload: ChannelEventPayload,
  capture?: PostHogCapture | null
): void {
  if (!capture) return;

  const { event, ...properties } = payload;
  capture(event, properties);
}
