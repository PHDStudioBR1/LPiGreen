export const HOME_WHATSAPP_REDIRECT_URL_DEV =
  "https://redirect-to-whatsapp-dev.546digitalservices.com/";

export const HOME_WHATSAPP_REDIRECT_URL_PROD =
  "https://redirect-to-whatsapp.546digitalservices.com/";

/** @deprecated Use getHomeWhatsAppRedirectUrl() */
export const HOME_WHATSAPP_URL =
  "https://wa.me/5511993801471?text=Ol%C3%A1%21%20Quero%20economizar%20na%20minha%20conta%20de%20luz%20com%20a%20iGreen%20Energy.";

function isDevEnvironment(): boolean {
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    return (
      host.includes("lpigreendev") ||
      host === "localhost" ||
      host.startsWith("127.0.0.1")
    );
  }

  const appEnv = (
    process.env.PHDCRM_ENV ||
    process.env.NEXT_PUBLIC_PHDCRM_ENV ||
    process.env.NEXT_PUBLIC_APP_ENV ||
    "dev"
  ).toLowerCase();

  return appEnv !== "prod" && appEnv !== "production";
}

export function getHomeWhatsAppRedirectUrl(): string {
  const override = process.env.NEXT_PUBLIC_HOME_WHATSAPP_REDIRECT_URL?.trim();
  if (override) return override;

  return isDevEnvironment()
    ? HOME_WHATSAPP_REDIRECT_URL_DEV
    : HOME_WHATSAPP_REDIRECT_URL_PROD;
}
