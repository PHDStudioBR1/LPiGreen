export const HOME_LOGO_SRC = "/images/logo_igreen_verde.png";

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

  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    if (
      host.includes("lpigreendev") ||
      host === "localhost" ||
      host.startsWith("127.0.0.1")
    ) {
      return HOME_WHATSAPP_REDIRECT_URL_DEV;
    }
  }

  return HOME_WHATSAPP_REDIRECT_URL_PROD;
}
