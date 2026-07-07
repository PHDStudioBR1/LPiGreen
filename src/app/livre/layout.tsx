import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./livre.css";

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

export const metadata: Metadata = {
  title:
    "Reduza em até 30% a conta de energia da sua empresa | Mercado Livre de Energia iGreen",
  description:
    "Migre para o Mercado Livre de Energia e garanta sustentabilidade, praticidade e previsibilidade orçamentária para o seu negócio.",
};

export default function LivreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${plusJakarta.variable}`}>{children}</div>
  );
}
