/** Pixel Meta por funil. /seguros usa ID próprio; /seguro-auto mantém o anterior. */
export const META_PIXEL_IDS = {
  seguros: "1051522610657600",
  "seguro-auto": "2456316114837467",
} as const;

export type MetaPixelFunnel = keyof typeof META_PIXEL_IDS;

export const META_PIXEL_ID = META_PIXEL_IDS["seguro-auto"];

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: FbqFunction;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
    __igreenMetaPixelInit?: string;
  }
}

export type MetaEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

const onceKeys = new Set<string>();

function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function sanitizeParams(params?: MetaEventParams): Record<string, string | number | boolean> {
  if (!params) return {};
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    clean[key] = value;
  }
  return clean;
}

function shouldFireOnce(onceKey?: string): boolean {
  if (!onceKey) return true;
  if (onceKeys.has(onceKey)) return false;
  onceKeys.add(onceKey);
  return true;
}

/** Clears once-keys for a new pageview (SPA navigation within the segment). */
export function resetMetaPixelOnceKeys(prefix?: string) {
  if (!prefix) {
    onceKeys.clear();
    return;
  }
  for (const key of onceKeys) {
    if (key.startsWith(prefix)) onceKeys.delete(key);
  }
}

export function getMetaPageContext() {
  if (typeof window === "undefined") {
    return {
      page_path: "",
      page_url: "",
      referrer: "",
      timestamp: new Date().toISOString(),
    };
  }

  return {
    page_path: window.location.pathname,
    page_url: window.location.href,
    referrer: document.referrer || "",
    timestamp: new Date().toISOString(),
  };
}

/** Standard Meta event (PageView, Lead, CompleteRegistration, etc.) */
export function trackMetaStandard(
  eventName: string,
  params?: MetaEventParams,
  options?: { onceKey?: string }
) {
  if (!canTrack() || !shouldFireOnce(options?.onceKey)) return;
  window.fbq!("track", eventName, sanitizeParams(params));
}

/** Custom Meta event (LandingVisited, CTA_Click, ScrollDepth, etc.) */
export function trackMetaCustom(
  eventName: string,
  params?: MetaEventParams,
  options?: { onceKey?: string }
) {
  if (!canTrack() || !shouldFireOnce(options?.onceKey)) return;
  window.fbq!("trackCustom", eventName, sanitizeParams(params));
}

export function trackMetaPageView(extra?: MetaEventParams) {
  const ctx = getMetaPageContext();
  trackMetaStandard("PageView", { ...ctx, ...extra });
  trackMetaCustom("LandingVisited", { ...ctx, ...extra }, {
    onceKey: `LandingVisited:${ctx.page_path}`,
  });
}
