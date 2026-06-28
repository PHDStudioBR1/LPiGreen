import type { Metadata } from "next";
import Link from "next/link";
import { PoliticaPrivacidadeContent } from "@/components/legal/politica-privacidade-content";
import { TelecomPageViewTracker } from "@/components/analytics/telecom-page-view-tracker";

export const metadata: Metadata = {
  title: "Política de Privacidade | Telecom iGreen",
  description:
    "Política de privacidade da Telecom iGreen. Saiba como coletamos, usamos e protegemos suas informações pessoais.",
};

export default function TelecomPoliticaDePrivacidadePage() {
  return (
    <div className="telecom-page min-h-screen font-tc-body bg-white">
      <TelecomPageViewTracker />
      <header className="border-b border-telecom-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/telecom"
            className="text-sm font-semibold text-telecom-primary transition-colors hover:text-telecom-accent"
          >
            ← Voltar para Telecom
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-12 text-telecom-muted sm:px-6">
        <PoliticaPrivacidadeContent linkClassName="text-telecom-primary underline-offset-2 hover:underline" />
      </main>
    </div>
  );
}
