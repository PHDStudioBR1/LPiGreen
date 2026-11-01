export const TELECOM_COLORS = {
  primary: "#6C3AED",
  primaryHover: "#5B21B6",
  secondary: "#1E1B4B",
  accent: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
} as const;

export const TELECOM_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://centraldobeneficioenergia.com.br";

export const TELECOM_WHATSAPP_URL =
  "https://wa.me/5500000000000?text=Ol%C3%A1%21%20Quero%20contratar%20o%20Telecom%20iGreen.";

/** Extrai o número de `TELECOM_WHATSAPP_URL` e monta um link com mensagem customizada. */
export function buildTelecomWhatsAppUrl(message: string): string {
  const match = TELECOM_WHATSAPP_URL.match(/wa\.me\/(\d+)/);
  const number = match?.[1] ?? "5500000000000";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const TELECOM_PROMO_ESIM_WHATSAPP_MESSAGE =
  "Olá! Vi a promoção de 1º Mês Grátis no site. Quero fazer a portabilidade do meu número para o eSIM no Plano Start e ativar meu voucher!";

/** Flag global da campanha eSIM — desative aqui ou passe `isPromoActive={false}` no componente. */
export const TELECOM_PROMO_ESIM_ACTIVE = true;

export const TELECOM_HEADER_OFFSET = 110;

export const TELECOM_LOGO_SRC = "/images/logo_igreen_telecom_branco.png";

export const TELECOM_CLIENT_COUNT = 28450;

export const TELECOM_TRUST_ITEMS = [
  { id: "anatel", label: "Regulamentado ANATEL" },
  { id: "5g", label: "Rede 5G nacional" },
  { id: "24h", label: "Suporte digital 24h" },
] as const;

export const TELECOM_NAV_ITEMS = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Planos", href: "#planos" },
  { label: "Comparativo", href: "#comparativo" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "iGreen Club", href: "#clube" },
  { label: "FAQ", href: "#faq" },
] as const;

export const TELECOM_UTILITY_LINKS = [
  { label: "Portabilidade", href: "#como-funciona" },
  { label: "Cobertura", href: "#faq" },
  { label: "Baixe o App", href: "#como-funciona" },
  { label: "Central de Ajuda", href: "#faq" },
] as const;
