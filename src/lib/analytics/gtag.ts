export const GOOGLE_TAG_ID = "GT-KTRG7CHQ";
export const GA4_MEASUREMENT_ID = "G-6S3NG2330K";

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackGtagEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    ...params,
    send_to: GA4_MEASUREMENT_ID,
  });
}
