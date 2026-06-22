import type { Metadata } from "next";
import Link from "next/link";
import { TermosDeUsoContent } from "@/components/legal/termos-de-uso-content";

export const metadata: Metadata = {
  title: "Termos de Uso | Seguro iGreen",
  description:
    "Termos de uso do representanteigreen.com.br. Leia as condições de acesso e utilização do site.",
};

export default function SegurosTermosDeUsoPage() {
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
        <TermosDeUsoContent linkClassName="text-seguros-primary underline-offset-2 hover:underline" />
      </main>
    </div>
  );
}
