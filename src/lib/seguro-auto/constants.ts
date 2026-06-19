export const SEGURO_AUTO_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://igreen.com.br";

export const SEGURO_AUTO_HEADER_OFFSET = 108;

export const SEGURO_AUTO_UTILITY_LINKS = [
  { label: "Sobre nós", href: "#" },
  { label: "Ajuda", href: "#" },
  { label: "Baixe o App", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Sinistro", href: "#" },
  { label: "Encontre um Corretor", href: "#" },
  { label: "Seja um Corretor", href: "#" },
] as const;

export const SEGURO_AUTO_NAV_ITEMS = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Comparativo", href: "#comparacao" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "FAQ", href: "#faq" },
] as const;

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
  cta: string;
};

export const SEGURO_AUTO_HERO_SLIDES: HeroSlide[] = [
  {
    id: "premium",
    title: "Seguros Auto Premium e Privilege",
    description:
      "Proteção para quem valoriza cada detalhe do seu carro e a liberdade de viver experiências exclusivas.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&h=900&fit=crop&q=80",
    cta: "Saiba mais",
  },
  {
    id: "essencial",
    title: "Seguro Auto Essencial",
    description:
      "Coberturas essenciais para colisão, incêndio, roubo e furto com assistência 24h.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&h=900&fit=crop&q=80",
    cta: "Saiba mais",
  },
  {
    id: "moto",
    title: "Seguro para Motos",
    description:
      "Proteção completa para quem vive sobre duas rodas, com assistência e coberturas flexíveis.",
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1400&h=900&fit=crop&q=80",
    cta: "Saiba mais",
  },
  {
    id: "caminhao",
    title: "Seguro para Caminhões",
    description:
      "Soluções para frotas e caminhoneiros autônomos com cobertura nacional e suporte dedicado.",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&h=900&fit=crop&q=80",
    cta: "Saiba mais",
  },
];
