import { SEGUROS_FAQ } from "@/lib/seguros/data";
import { SEGUROS_SITE_URL } from "@/lib/seguros/constants";

export function getInsuranceAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: "Seguro iGreen",
    description:
      "Seguro para carro, moto e caminhão sem consulta SPC/Serasa, sem análise de perfil e sem fidelidade.",
    url: `${SEGUROS_SITE_URL}/seguros`,
    logo: `${SEGUROS_SITE_URL}/favicon.svg`,
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

export function getBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: SEGUROS_SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Seguro iGreen",
        item: `${SEGUROS_SITE_URL}/seguros`,
      },
    ],
  };
}
