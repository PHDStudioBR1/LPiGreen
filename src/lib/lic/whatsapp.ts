import { LIC_WHATSAPP_URL } from "@/lib/lic/constants";
import { trackLicWhatsAppClick } from "@/lib/lic/analytics";

export function openLicWhatsApp(location: string) {
  trackLicWhatsAppClick(location);
  window.open(LIC_WHATSAPP_URL, "_blank", "noopener,noreferrer");
}
