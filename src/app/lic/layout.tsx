import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seja um Licenciado iGreen Energy - B2B",
  description:
    "Seja um Licenciado iGreen Energy - B2B. Construa renda recorrente vitalícia conectando consumidores a fazendas solares, com operação digital e modelo regulamentado.",
};

export default function LicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
