/** Meta Pixel exclusivo da LP `/seguros`. */
export const SEGUROS_META_PIXEL_ID = "1051522610657600";

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
    __igreenSegurosMetaPixelInit?: string;
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

export function resetMetaPixelOnceKeys(prefix?: string) {
  if (!prefix) {
    onceKeys.clear();
    return;
  }
  for (const key of onceKeys) {
    if (key.startsWith(prefix)) onceKeys.delete(key);
  }
}

export function trackMetaStandard(
  eventName: string,
  params?: MetaEventParams,
  options?: { onceKey?: string }
) {
  if (!canTrack() || !shouldFireOnce(options?.onceKey)) return;
  window.fbq!("track", eventName, sanitizeParams(params));
}

export function trackMetaCustom(
  eventName: string,
  params?: MetaEventParams,
  options?: { onceKey?: string }
) {
  if (!canTrack() || !shouldFireOnce(options?.onceKey)) return;
  window.fbq!("trackCustom", eventName, sanitizeParams(params));
}

export function trackSegurosMetaPageView() {
  trackMetaStandard("PageView", undefined, { onceKey: "PageView:/seguros" });
}

export function trackSegurosMetaScroll(percent: 50 | 90) {
  trackMetaCustom(`Scroll_${percent}`, undefined, {
    onceKey: `Scroll_${percent}:/seguros`,
  });
}

export function trackSegurosMetaClickCta(buttonLabel: string) {
  const label = buttonLabel.replace(/\s+/g, " ").trim().slice(0, 120) || "CTA";
  trackMetaCustom("Click_CTA", { button_label: label });
}

export function trackSegurosMetaInitiateCheckout() {
  trackMetaStandard("InitiateCheckout", undefined, {
    onceKey: "InitiateCheckout:/seguros",
  });
}

export function trackSegurosMetaStep2(params: {
  vehicle_brand: string;
  usage_type: string;
}) {
  trackMetaCustom("Step_2_DadosPessoais", params, {
    onceKey: "Step_2_DadosPessoais:/seguros",
  });
}

export function trackSegurosMetaStep3() {
  trackMetaCustom("Step_3_Resumo", undefined, {
    onceKey: "Step_3_Resumo:/seguros",
  });
}

function splitName(fullName: string): { fn: string; ln: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    fn: parts[0] || "",
    ln: parts.slice(1).join(" "),
  };
}

export function extractVehicleYear(model: string): string {
  const match = model.match(/\b(19|20)\d{2}\b/);
  return match?.[0] ?? "";
}

export function mapUsageType(vehicleUse: string): string {
  if (vehicleUse === "Sim") return "Aplicativo";
  if (vehicleUse === "Não") return "Passeio";
  return vehicleUse;
}

/** Re-init com Advanced Matching + Lead (conversão) após sucesso no formulário. */
export function trackSegurosMetaLead(params: {
  email: string;
  phone: string;
  name: string;
  vehicle_brand: string;
  vehicle_year: string;
  usage_type: string;
}) {
  if (!canTrack() || !shouldFireOnce("Lead:/seguros")) return;

  const { fn, ln } = splitName(params.name);
  const em = params.email.toLowerCase().trim();
  const ph = params.phone.replace(/\D/g, "");

  window.fbq!("init", SEGUROS_META_PIXEL_ID, {
    em,
    ph,
    fn,
    ln,
  });

  window.fbq!("track", "Lead", {
    content_name: "iGreen Auto Mensal",
    content_category: "Seguro Veicular por Assinatura",
    vehicle_brand: params.vehicle_brand,
    vehicle_year: params.vehicle_year,
    usage_type: params.usage_type,
    currency: "BRL",
    value: 0.0,
  });
}
