export const ATTRIBUTION_STORAGE_KEY = "lpigreen-attribution-v1";

export const ATTRIBUTION_CUSTOM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_CUSTOM_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const KEY_SET = new Set<string>(ATTRIBUTION_CUSTOM_KEYS);

function cleanValue(value: unknown, max = 500): string {
  if (value == null) return "";
  return String(value).trim().slice(0, max);
}

export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object") return {};
  const out: Attribution = {};
  for (const key of ATTRIBUTION_CUSTOM_KEYS) {
    const value = cleanValue((input as Record<string, unknown>)[key]);
    if (value) out[key] = value;
  }
  return out;
}

export function parseAttributionFromSearch(
  search: string | URLSearchParams
): Attribution {
  const params =
    typeof search === "string"
      ? new URLSearchParams(search.startsWith("?") ? search : `?${search}`)
      : search;

  const raw: Record<string, string> = {};
  for (const key of ATTRIBUTION_CUSTOM_KEYS) {
    const value = cleanValue(params.get(key));
    if (value) raw[key] = value;
  }
  return sanitizeAttribution(raw);
}

/** First-touch: keep existing keys, fill only missing ones. */
export function mergeAttribution(
  existing: Attribution,
  incoming: Attribution
): Attribution {
  const out: Attribution = { ...sanitizeAttribution(existing) };
  for (const [key, value] of Object.entries(sanitizeAttribution(incoming))) {
    if (!KEY_SET.has(key)) continue;
    const typed = key as AttributionKey;
    if (!out[typed] && value) out[typed] = value;
  }
  return out;
}

export function attributionToCustomValues(
  attribution: Attribution
): Record<string, string> {
  const custom: Record<string, string> = {};
  for (const key of ATTRIBUTION_CUSTOM_KEYS) {
    const value = attribution[key];
    if (value) custom[key] = value;
  }
  return custom;
}

export function readStoredAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return {};
    return sanitizeAttribution(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function captureAttributionFromLocation(
  search: string = typeof window !== "undefined" ? window.location.search : ""
): Attribution {
  const incoming = parseAttributionFromSearch(search);
  if (typeof window === "undefined") return incoming;

  const merged = mergeAttribution(readStoredAttribution(), incoming);
  try {
    if (Object.keys(merged).length > 0) {
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {
    // ignore quota / private mode
  }
  return merged;
}
