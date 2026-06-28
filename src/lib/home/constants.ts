export const HOME_WHATSAPP_REDIRECT_URL_DEV =
  "https://redirect-to-whatsapp-dev.546digitalservices.com/";

export const HOME_WHATSAPP_REDIRECT_URL_PROD =
  "https://redirect-to-whatsapp.546digitalservices.com/";

/** @deprecated Use getHomeWhatsAppRedirectUrl() */
export const HOME_WHATSAPP_URL =
  "https://wa.me/5511993801471?text=Ol%C3%A1%21%20Quero%20economizar%20na%20minha%20conta%20de%20luz%20com%20a%20iGreen%20Energy.";

export function getHomeWhatsAppRedirectUrl(): string {
  const override = process.env.NEXT_PUBLIC_HOME_WHATSAPP_REDIRECT_URL?.trim();
  if (override) return override;

  const appEnv = (
    process.env.NEXT_PUBLIC_APP_ENV ||
    process.env.NEXT_PUBLIC_PHDCRM_ENV ||
    process.env.NODE_ENV ||
    "development"
  ).toLowerCase();

  if (appEnv === "production" || appEnv === "prod") {
    return HOME_WHATSAPP_REDIRECT_URL_PROD;
  }

  return HOME_WHATSAPP_REDIRECT_URL_DEV;
}
