"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ctaGlowClasses } from "@/lib/cro-cta";

const PILLARS = [
  {
    title: "Abertura do Mercado",
    text: "O Mercado Livre de Energia abriu. São mais de 90 milhões de unidades consumidoras prontas para escolherem seu fornecedor até 2028.",
  },
  {
    title: "Sociedade Forte",
    text: "A iGreen é sócia da Comerc/Vibra, que aportou bilhões em capacidade energética para garantir a nossa liderança isolada no Brasil.",
  },
  {
    title: "Expansão 2026",
    text: "Saímos de 100 mil para mais de 500 mil clientes rapidamente e, em 2026, iniciamos nossa Expansão Internacional começando pelos Estados Unidos.",
  },
] as const;

export function AuthoritySection({ onCTAClick }: { onCTAClick?: () => void }) {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-zinc-950 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal className="max-w-4xl mx-auto text-center space-y-4 mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Prova social e autoridade
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-foreground leading-tight">
            O Mercado Bilionário Apoiado por Gigantes
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Estrutura, escala e credibilidade para você vender com segurança e acelerar sua operação no B2B.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {PILLARS.map((item, i) => (
            <ScrollReveal key={item.title} delayMs={i * 70}>
              <Card className="h-full rounded-3xl border border-border shadow-md bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-base font-black text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {onCTAClick && (
          <ScrollReveal className="mt-12 text-center space-y-4">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Solicite o material completo do plano de negócios e veja como licenciar na sua região.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link
                href="/formulario"
                className={`inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 ${ctaGlowClasses}`}
              >
                Quero ser um Licenciado
              </Link>
              <button
                type="button"
                onClick={onCTAClick}
                className="inline-flex h-12 px-8 items-center justify-center rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/10 transition-colors"
              >
                Conhecer o Plano de Negócios
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
