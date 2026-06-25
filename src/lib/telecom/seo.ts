import { TELECOM_FAQ } from "@/lib/telecom/data";
import { TELECOM_SITE_URL } from "@/lib/telecom/constants";

type TelecomPageSeo = {
  siteUrl?: string;
  pagePath?: string;
  pageName?: string;
};

function resolveSiteUrl(siteUrl?: string) {
  return siteUrl ?? TELECOM_SITE_URL;
}

export function getOrganizationSchema(options?: TelecomPageSeo) {
  const siteUrl = resolveSiteUrl(options?.siteUrl);
  const pagePath = options?.pagePath ?? "/telecom";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Telecom iGreen",
    description:
      "Operadora digital com planos de telefonia móvel 4G/5G, portabilidade gratuita e cashback mensal.",
    url: `${siteUrl}${pagePath}`,
    logo: `${siteUrl}/favicon.svg`,
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Portuguese",
      areaServed: "BR",
    },
  };
}

export function getTelecomServiceSchema(options?: TelecomPageSeo) {
  const siteUrl = resolveSiteUrl(options?.siteUrl);
  const pagePath = options?.pagePath ?? "/telecom";

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Planos de Telefonia Móvel iGreen",
    description:
      "Planos de celular 4G/5G sem fidelidade, com portabilidade gratuita e cashback.",
    provider: {
      "@type": "Organization",
      name: "Telecom iGreen",
    },
    url: `${siteUrl}${pagePath}`,
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: "Telefonia Móvel MVNO",
  };
}

export function getTelecomFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TELECOM_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getTelecomBreadcrumbSchema(options?: TelecomPageSeo) {
  const siteUrl = resolveSiteUrl(options?.siteUrl);
  const pagePath = options?.pagePath ?? "/telecom";
  const pageName = options?.pageName ?? "Telecom iGreen";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: `${siteUrl}${pagePath}`,
      },
    ],
  };
}
