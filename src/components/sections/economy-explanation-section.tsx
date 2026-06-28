"use client";

import { HeroVideo } from "@/components/sections/hero-video";

export function EconomyExplanationSection() {
  return (
    <section className="border-t border-border bg-white py-20 dark:bg-neutral-950 dark:border-neutral-800">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="space-y-4 text-center">
            <h2 className="font-headline text-2xl font-black text-foreground md:text-4xl">
              Como essa economia é possível?
            </h2>
            <p className="text-lg text-muted-foreground">
              A mídia testou e comprovou: entenda como a energia por assinatura reduz a sua conta
              sem que você precise instalar placas ou investir um centavo.
            </p>
          </div>

          <HeroVideo videoId="1169991922" />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-6 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 h-8 w-8 shrink-0 text-primary"
              >
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
              <div>
                <h4 className="text-lg font-bold text-foreground">Economia Comprovada</h4>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                  A economia média em comparação ao que é cobrado pelas concessionárias é de 15%.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-6 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 h-8 w-8 shrink-0 text-primary"
              >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
              <div>
                <h4 className="text-lg font-bold text-foreground">Dinheiro no Bolso</h4>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                  &quot;É como se por ano eu economizasse quase duas contas de energia&quot; – relata
                  cliente na reportagem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
