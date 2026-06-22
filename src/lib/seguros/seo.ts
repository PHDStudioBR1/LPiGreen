import { SEGUROS_FAQ } from "@/lib/seguros/data";
import { SEGUROS_SITE_URL } from "@/lib/seguros/constants";

type SegurosPageSeo = {
  siteUrl?: string;
  pagePath?: string;
  pageName?: string;
};

function resolveSiteUrl(siteUrl?: string) {
  return siteUrl ?? SEGUROS_SITE_URL;
}

export function getInsuranceAgencySchema(options?: SegurosPageSeo) {
  const siteUrl = resolveSiteUrl(options?.siteUrl);
  const pagePath = options?.pagePath ?? "/seguros";

  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: "Seguro iGreen",
    description:
      "Seguro para carro, moto e caminhão sem consulta SPC/Serasa, sem análise de perfil e sem fidelidade.",
    url: `${siteUrl}${pagePath}`,
    logo: `${siteUrl}/favicon.svg`,
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: ["Seguro Auto", "Seguro Moto", "Seguro Caminhão"],
    priceRange: "R$",
    telephone: "+55-00-0000-0000",
  };
}

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SEGUROS_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(options?: SegurosPageSeo) {
  const siteUrl = resolveSiteUrl(options?.siteUrl);
  const pagePath = options?.pagePath ?? "/seguros";
  const pageName = options?.pageName ?? "Seguro iGreen";

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
