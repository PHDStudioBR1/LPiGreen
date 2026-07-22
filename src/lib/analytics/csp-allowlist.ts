/**
 * Hosts extras usados por tracking (Meta CAPI Gateway / PostHog).
 * Espelhar em infra/k8s/middlewares/security-headers*.yaml (connect-src / script-src).
 */
export const META_CONNECT_EXTRA = [
  "https://*.facebook.com",
  "https://*.facebook.net",
  "https://graph.facebook.com",
  "https://*.on.aws",
  "https://*.run.app",
] as const;

export const POSTHOG_CONNECT_EXTRA = [
  "https://*.posthog.com",
  "https://*.i.posthog.com",
  "https://us.i.posthog.com",
  "https://us-assets.i.posthog.com",
] as const;

export const POSTHOG_SCRIPT_EXTRA = [
  "https://*.i.posthog.com",
  "https://us-assets.i.posthog.com",
] as const;
