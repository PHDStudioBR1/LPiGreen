import type { Metadata } from "next";
import Link from "next/link";
import { PoliticaPrivacidadeContent } from "@/components/legal/politica-privacidade-content";

export const metadata: Metadata = {
  title: "Política de Privacidade | Seguro iGreen",
  description:
    "Política de privacidade do representanteigreen.com.br. Saiba como coletamos, usamos e protegemos suas informações pessoais.",
};

export default function SegurosPoliticaDePrivacidadePage() {
  return (
    <div className="seguros-page min-h-screen font-body">
      <header className="border-b border-seguros-primary/10">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/seguros"
            className="text-sm font-semibold text-seguros-primary transition-colors hover:text-seguros-accent"
          >
            ← Voltar para Seguros
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-12 text-seguros-muted sm:px-6">
        <PoliticaPrivacidadeContent linkClassName="text-seguros-primary underline-offset-2 hover:underline" />
      </main>
    </div>
  );
}
