import type { Metadata } from "next";
import Link from "next/link";
import { TermosDeUsoContent } from "@/components/legal/termos-de-uso-content";
import { TelecomPageViewTracker } from "@/components/analytics/telecom-page-view-tracker";

export const metadata: Metadata = {
  title: "Termos de Uso | Telecom iGreen",
  description:
    "Termos de uso da Telecom iGreen. Leia as condições de acesso e utilização do site.",
};

export default function TelecomTermosDeUsoPage() {
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
        <TermosDeUsoContent linkClassName="text-telecom-primary underline-offset-2 hover:underline" />
      </main>
    </div>
  );
}
