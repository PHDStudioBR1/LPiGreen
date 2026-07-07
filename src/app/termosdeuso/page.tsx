import type { Metadata } from "next";
import Link from "next/link";
import { TermosDeUsoContent } from "@/components/legal/termos-de-uso-content";
import { HomePageViewTracker } from "@/components/analytics/home-page-view-tracker";

export const metadata: Metadata = {
  title: "Termos de Uso | iGreen Energy",
  description:
    "Termos de uso da iGreen Energy. Leia as condições de acesso e utilização do site.",
};

export default function HomeTermosDeUsoPage() {
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
        <TermosDeUsoContent linkClassName="text-primary underline-offset-2 hover:underline" />
      </main>
    </div>
  );
}
