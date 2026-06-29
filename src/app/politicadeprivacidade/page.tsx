import type { Metadata } from "next";
import Link from "next/link";
import { PoliticaPrivacidadeContent } from "@/components/legal/politica-privacidade-content";
import { HomePageViewTracker } from "@/components/analytics/home-page-view-tracker";

export const metadata: Metadata = {
  title: "Política de Privacidade | iGreen Energy",
  description:
    "Política de privacidade da iGreen Energy. Saiba como coletamos, usamos e protegemos suas informações pessoais.",
};

export default function HomePoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen font-body bg-background text-foreground">
      <HomePageViewTracker />
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            ← Voltar para iGreen Energy
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-12 text-muted-foreground sm:px-6">
        <PoliticaPrivacidadeContent linkClassName="text-primary underline-offset-2 hover:underline" />
      </main>
    </div>
  );
}
