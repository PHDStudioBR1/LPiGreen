import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getInsuranceAgencySchema,
} from "@/lib/seguros/seo";
import { SEGUROS_SITE_URL } from "@/lib/seguros/constants";
import "./seguros.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const title = "Seguro iGreen | Carro, Moto e Caminhão sem SPC";
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
    canonical: `${SEGUROS_SITE_URL}/seguros`,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${SEGUROS_SITE_URL}/seguros`,
    siteName: "Seguro iGreen",
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

export default function SegurosLayout({
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
    <div className={poppins.variable}>
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
