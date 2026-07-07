export const LIVRE_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://centraldobeneficioenergia.com.br";

export const LIVRE_HEADER_OFFSET = 110;
export const LIVRE_HEADER_OFFSET_MOBILE = 88;

export const LIVRE_LOGO_SRC = "/images/livre/logo_igreen_livre_branco.svg";
export const LIVRE_LOGO_ALT = "Conexão Livre iGreen";

export const LIVRE_WHATSAPP_URL =
  "https://wa.me/5500000000000?text=Ol%C3%A1%21%20Quero%20saber%20mais%20sobre%20a%20Conex%C3%A3o%20Livre%20iGreen.";

export const LIVRE_CONTACT_EMAIL = "contato@igreenenergy.com.br";
export const LIVRE_CONTACT_PHONE = "0800 183 0080";

export const LIVRE_CTA_LABEL = "Solicitar Simulação";
export const LIVRE_HERO_CTA_LABEL = "Quero uma Simulação Gratuita agora!";
export const LIVRE_CTA_SECTION_ID = "simulacao";

export const LIVRE_INSTITUTIONAL_TEXT =
  "Migração para o Mercado Livre de Energia oferecida por licenciado independente iGreen. Modelo 100% regulamentado pela ANEEL (Lei 14.300/2022). Consulte condições e disponibilidade na sua região antes da contratação.";

export const LIVRE_LEGAL_NOTE =
  "iGreen Energy LTDA. Todos os direitos reservados. Atuação em conformidade com a Lei 14.300/2022 e resoluções da ANEEL.";

export type LivreNavItem = {
  label: string;
  href: string;
};

export const LIVRE_NAV_ITEMS: LivreNavItem[] = [
  { label: "O que é", href: "#o-que-e" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "FAQ", href: "#faq" },
];

export type LivreFooterLink = {
  label: string;
  href: string;
};

export type LivreFooterLinkGroup = {
  title: string;
  links: LivreFooterLink[];
};

export type LivreContactItem = {
  label: string;
  value: string;
  href: string;
};

export const LIVRE_FOOTER_LINK_GROUPS: LivreFooterLinkGroup[] = [
  {
    title: "Navegação",
    links: [
      { label: "O que é", href: "#o-que-e" },
      { label: "Benefícios", href: "#beneficios" },
      { label: "iGreen Club", href: "#igreen-club" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "FAQ", href: "#faq" },
      { label: "Solicitar simulação", href: "#simulacao" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de privacidade", href: "/livre/politicadeprivacidade" },
      { label: "Termos de uso", href: "/livre/termosdeuso" },
    ],
  },
];

export const LIVRE_CONTACT_ITEMS: LivreContactItem[] = [
  {
    label: "WhatsApp",
    value: "Fale conosco",
    href: LIVRE_WHATSAPP_URL,
  },
  {
    label: "E-mail",
    value: LIVRE_CONTACT_EMAIL,
    href: `mailto:${LIVRE_CONTACT_EMAIL}`,
  },
  {
    label: "Telefone",
    value: LIVRE_CONTACT_PHONE,
    href: "tel:08001830080",
  },
];

export const LIVRE_SOCIAL_LINKS = [
  { label: "WhatsApp", href: LIVRE_WHATSAPP_URL },
  { label: "Instagram", href: "https://instagram.com/igreenenergy" },
] as const;
