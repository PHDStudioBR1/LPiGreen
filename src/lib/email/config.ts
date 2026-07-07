function cleanEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

function parseBool(value: string | undefined, defaultValue = false): boolean {
  const normalized = cleanEnv(value).toLowerCase();
  if (!normalized) return defaultValue;
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function parsePort(value: string | undefined, defaultValue: number): number {
  const parsed = Number.parseInt(cleanEnv(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

export type EmailConfig = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  fromName: string;
};

export function getEmailConfig(): EmailConfig {
  return {
    enabled: parseBool(process.env.NOTIFY_REPRESENTATIVE_ENABLED, false),
    host: cleanEnv(process.env.SMTP_HOST),
    port: parsePort(process.env.SMTP_PORT, 587),
    secure: parseBool(process.env.SMTP_SECURE, false),
    user: cleanEnv(process.env.SMTP_USER),
    pass: cleanEnv(process.env.SMTP_PASS),
    from: cleanEnv(process.env.MAIL_FROM),
    fromName: cleanEnv(process.env.MAIL_FROM_NAME) || "LPiGreen",
  };
}

export function isEmailConfigured(): boolean {
  const config = getEmailConfig();
  return config.enabled && Boolean(config.host) && Boolean(config.from);
}
