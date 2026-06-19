import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getInsuranceAgencySchema,
} from "@/lib/seguros/seo";
import { SEGURO_AUTO_SITE_URL } from "@/lib/seguro-auto/constants";
import "./seguro-auto.css";

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

const title = "Seguro Auto iGreen | Proteção veicular completa";
const description =
  "Seguro para carro, moto e caminhão sem consulta SPC/Serasa, sem análise de perfil e sem fidelidade. Cotação gratuita em 2 minutos. Regulamentado SUSEP.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "seguro auto",
    "seguro sem SPC",
    "seguro motorista app",
    "seguro carro leilão",
    "seguro iGreen",
    "seguro digital",
    "seguro sem fidelidade",
  ],
  alternates: {
    canonical: `${SEGURO_AUTO_SITE_URL}/seguro-auto`,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${SEGURO_AUTO_SITE_URL}/seguro-auto`,
    siteName: "Seguro Auto iGreen",
    title,
    description,
    images: [
      {
        url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Seguro iGreen — Proteção veicular digital",
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

export default function SeguroAutoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemas = [
    getInsuranceAgencySchema(),
    getFaqSchema(),
    getBreadcrumbSchema(),
  ];

  return (
    <div className={`${inter.variable} ${plusJakarta.variable}`}>
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
