import { createHash } from "node:crypto";
import { META_PIXEL_IDS, type MetaPixelFunnel } from "@/lib/analytics/meta-pixel";

export type MetaCapiFunnel = MetaPixelFunnel;

export type MetaCapiEnv = Record<string, string | undefined>;

export type MetaCapiUserData = {
  em?: string[];
  ph?: string[];
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
};

export type MetaCapiEvent = {
  event_name: string;
  event_time: number;
  event_id: string;
  action_source: "website";
  event_source_url?: string;
  user_data: MetaCapiUserData;
  custom_data?: Record<string, string | number>;
};

export function normalizeEmailForCapi(email: string): string {
  return email.trim().toLowerCase();
}

/** E.164-ish BR: digits only, prefix 55 when missing. */
export function normalizePhoneForCapi(phone: string, defaultCountry = "55"): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith(defaultCountry)) return digits;
  return `${defaultCountry}${digits}`;
}

export function hashForCapi(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function buildMetaCapiEventId(leadId: string | number, eventName: string): string {
  return `igreen-lead-${leadId}-${eventName}`;
}

export type BuildMetaCapiLeadInput = {
  eventName?: "Lead" | "CompleteRegistration";
  leadId: string | number;
  email?: string;
  phone?: string;
  eventSourceUrl?: string;
  funnel: MetaCapiFunnel;
  clientIp?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
  eventTime?: number;
};

export function buildMetaCapiLeadEvent(input: BuildMetaCapiLeadInput): MetaCapiEvent {
  const eventName = input.eventName ?? "Lead";
  const user_data: MetaCapiUserData = {};

  if (input.email?.trim()) {
    user_data.em = [hashForCapi(normalizeEmailForCapi(input.email))];
  }
  if (input.phone?.trim()) {
    const phone = normalizePhoneForCapi(input.phone);
    if (phone) user_data.ph = [hashForCapi(phone)];
  }
  if (input.clientIp) user_data.client_ip_address = input.clientIp;
  if (input.clientUserAgent) user_data.client_user_agent = input.clientUserAgent;
  if (input.fbc) user_data.fbc = input.fbc;
  if (input.fbp) user_data.fbp = input.fbp;

  return {
    event_name: eventName,
    event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: buildMetaCapiEventId(input.leadId, eventName),
    action_source: "website",
    event_source_url: input.eventSourceUrl,
    user_data,
    custom_data: {
      lead_id: String(input.leadId),
      funnel: input.funnel,
      currency: "BRL",
      value: 1,
    },
  };
}

export function resolveMetaCapiConfig(
  funnel: MetaCapiFunnel,
  env: MetaCapiEnv = process.env
): { pixelId: string; accessToken: string; testEventCode?: string } | null {
  const accessToken = env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!accessToken) return null;

  const pixelId = (META_PIXEL_IDS[funnel] || "").trim();
  if (!pixelId) return null;

  const testEventCode = env.META_CAPI_TEST_EVENT_CODE?.trim() || undefined;
  return { pixelId, accessToken, testEventCode };
}

export type SendMetaCapiLeadInput = BuildMetaCapiLeadInput & {
  env?: MetaCapiEnv;
  fetchImpl?: typeof fetch;
};

export type SendMetaCapiLeadResult = {
  ok: boolean;
  skipped: boolean;
  eventId?: string;
  status?: number;
  error?: string;
};

/**
 * Envia Lead (CAPI) para o pixel do funil. No-op seguro se token/pixel ausentes.
 * Não lança — falhas de rede/API são logadas pelo caller via result.error.
 */
export async function sendMetaCapiLead(
  input: SendMetaCapiLeadInput
): Promise<SendMetaCapiLeadResult> {
  const env = input.env ?? process.env;
  const config = resolveMetaCapiConfig(input.funnel, env);
  if (!config) {
    return { ok: true, skipped: true };
  }

  const event = buildMetaCapiLeadEvent(input);
  const fetchImpl = input.fetchImpl ?? fetch;

  const url = new URL(`https://graph.facebook.com/v21.0/${config.pixelId}/events`);
  url.searchParams.set("access_token", config.accessToken);

  const body: Record<string, unknown> = { data: [event] };
  if (config.testEventCode) {
    body.test_event_code = config.testEventCode;
  }

  try {
    const response = await fetchImpl(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        ok: false,
        skipped: false,
        eventId: event.event_id,
        status: response.status,
        error: text.slice(0, 300) || `HTTP ${response.status}`,
      };
    }

    return { ok: true, skipped: false, eventId: event.event_id, status: response.status };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      eventId: event.event_id,
      error: error instanceof Error ? error.message : "CAPI request failed",
    };
  }
}

/** Extrai IP do request (proxy-aware). */
export function clientIpFromHeaders(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || undefined;
}
