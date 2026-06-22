import type { Metadata } from "next";
import Link from "next/link";
import { TermosDeUsoContent } from "@/components/legal/termos-de-uso-content";

export const metadata: Metadata = {
  title: "Termos de Uso | Seguro Auto iGreen",
  description:
    "Termos de uso do representanteigreen.com.br. Leia as condições de acesso e utilização do site.",
};

export default function SeguroAutoTermosDeUsoPage() {
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
        <TermosDeUsoContent linkClassName="text-sa-primary underline-offset-2 hover:underline" />
      </main>
    </div>
  );
}
