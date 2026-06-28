import { getHomeWhatsAppRedirectUrl } from "@/lib/home/constants";
import { trackHomeCTAClick, trackHomeWhatsAppClick } from "@/lib/home/analytics";

export function redirectHomeConversion(location: string) {
  trackHomeCTAClick(location);
  window.location.href = getHomeWhatsAppRedirectUrl();
}

export function redirectHomeWhatsAppFloat() {
  trackHomeWhatsAppClick("float");
  window.location.href = getHomeWhatsAppRedirectUrl();
}

/** @deprecated Use redirectHomeConversion or redirectHomeWhatsAppFloat */
export function openHomeWhatsApp(location: string) {
  redirectHomeConversion(location);
}
