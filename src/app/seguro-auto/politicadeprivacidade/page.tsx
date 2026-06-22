import type { Metadata } from "next";
import Link from "next/link";
import { PoliticaPrivacidadeContent } from "@/components/legal/politica-privacidade-content";

export const metadata: Metadata = {
  title: "Política de Privacidade | Seguro Auto iGreen",
  description:
    "Política de privacidade do representanteigreen.com.br. Saiba como coletamos, usamos e protegemos suas informações pessoais.",
};

export default function SeguroAutoPoliticaDePrivacidadePage() {
  return (
    <div className="seguro-auto-page min-h-screen font-sa-body">
      <header className="border-b border-sa-border bg-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link
            href="/seguro-auto"
            className="text-sm font-semibold text-sa-primary transition-colors hover:text-sa-primary-hover"
          >
            ← Voltar para Seguro Auto
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-12 text-sa-muted">
        <PoliticaPrivacidadeContent linkClassName="text-sa-primary underline-offset-2 hover:underline" />
      </main>
    </div>
  );
}
