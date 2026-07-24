import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import {
  getOrganizationSchema,
  getTelecomBreadcrumbSchema,
  getTelecomFaqSchema,
  getTelecomServiceSchema,
} from "@/lib/telecom/seo";
import { TELECOM_SITE_URL } from "@/lib/telecom/constants";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import "./telecom.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const title = "Telecom iGreen | Planos de celular 5G sem fidelidade";
const description =
  "Operadora digital com planos 4G/5G, portabilidade gratuita, cashback mensal e clube de benefícios. Contrate 100% online em minutos.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "telecom iGreen",
    "operadora digital",
    "plano de celular",
    "portabilidade",
    "MVNO",
    "5G",
    "sem fidelidade",
    "cashback celular",
  ],
  alternates: {
    canonical: `${TELECOM_SITE_URL}/telecom`,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${TELECOM_SITE_URL}/telecom`,
    siteName: "Telecom iGreen",
    title,
    description,
    images: [
      {
        url: `${TELECOM_SITE_URL}/images/telecom/og-telecom.png`,
        width: 1200,
        height: 630,
        alt: "Telecom iGreen — Operadora digital 5G",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TelecomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemas = [
    getOrganizationSchema({ siteUrl: TELECOM_SITE_URL, pagePath: "/telecom" }),
    getTelecomServiceSchema({ siteUrl: TELECOM_SITE_URL, pagePath: "/telecom" }),
    getTelecomFaqSchema(),
    getTelecomBreadcrumbSchema({
      siteUrl: TELECOM_SITE_URL,
      pagePath: "/telecom",
      pageName: "Telecom iGreen",
    }),
  ];

  return (
    <div className={`${inter.variable} ${plusJakarta.variable}`}>
      <MetaPixel funnel="telecom" />
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </div>
  );
}
