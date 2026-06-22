import { HOME_WHATSAPP_URL } from "@/lib/home/constants";
import { trackHomeWhatsAppClick } from "@/lib/home/analytics";

export function openHomeWhatsApp(location: string) {
  trackHomeWhatsAppClick(location);
  window.open(HOME_WHATSAPP_URL, "_blank", "noopener,noreferrer");
}
