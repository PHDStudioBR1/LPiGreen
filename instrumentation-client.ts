import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

/**
 * Next.js 15.3+ client instrumentation — init antes do React tree.
 * Projeto PostHog 522696.
 */
if (typeof window !== "undefined" && key) {
  posthog.init(key, {
    api_host: host,
    defaults: "2025-05-24",
    person_profiles: "always",
    request_batching: false,
    disable_compression: true,
    loaded: (client) => {
      (window as Window & { posthog?: typeof posthog }).posthog = client;
    },
  });
}
