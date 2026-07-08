import { LIC_WHATSAPP_URL } from "@/lib/lic/constants";
import { trackLicWhatsAppClick } from "@/lib/lic/analytics";

/** CTAs sem captura de lead usam URL fixa de WhatsApp (fallback por design). */
export function openLicWhatsApp(location: string) {
  trackLicWhatsAppClick(location);
  window.open(LIC_WHATSAPP_URL, "_blank", "noopener,noreferrer");
}
