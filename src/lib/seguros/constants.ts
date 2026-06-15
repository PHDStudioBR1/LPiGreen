export const SEGUROS_COLORS = {
  primary: "#00C853",
  dark: "#061B12",
  secondary: "#0D3D2A",
  accent: "#9FFFCE",
  background: "#020B07",
  text: "#FFFFFF",
  textMuted: "#B7C9C0",
} as const;

export const SEGUROS_WHATSAPP_URL =
  "https://wa.me/5500000000000?text=Ol%C3%A1%21%20Quero%20fazer%20uma%20cota%C3%A7%C3%A3o%20de%20seguro%20iGreen.";

export const SEGUROS_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://centraldobeneficioenergia.com.br";

export const SEGUROS_CLIENT_COUNT = 12847;

export const SEGUROS_TRUST_ITEMS = [
  { id: "susep", label: "Regulamentado SUSEP" },
  { id: "reclame", label: "Reclame Aqui" },
  { id: "nacional", label: "Atendimento Nacional" },
  { id: "24h", label: "Proteção 24h" },
] as const;

export const SEGUROS_HERO_BADGES = [
  "Sem consulta SPC",
  "Motorista de App",
  "Carro de Leilão",
  "Ativação em 10 minutos",
  "Regulamentado SUSEP",
] as const;

export const SEGUROS_NAV_ITEMS = [
  { id: "beneficios", label: "Benefícios" },
  { id: "comparacao", label: "Comparativo" },
  { id: "como-funciona", label: "Como Funciona" },
  { id: "planos", label: "Planos" },
  { id: "depoimentos", label: "Depoimentos" },
  { id: "faq", label: "FAQ" },
] as const;

export const SEGUROS_HEADER_OFFSET = 80;
