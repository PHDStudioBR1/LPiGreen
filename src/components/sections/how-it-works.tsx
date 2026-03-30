"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const STEPS = [
  {
    n: "01",
    title: "Cadastro e onboarding",
    text: "Você formaliza o licenciamento e recebe acesso a treinamentos, app e materiais de prospecção.",
  },
  {
    n: "02",
    title: "Prospecção multicanal",
    text: "Ofereça Green, Telecom e Solar com o apoio da marca — do físico ao digital, com foco em mobile.",
  },
  {
    n: "03",
    title: "Recorrência e expansão",
    text: "Monetize vendas e rede: bônus diretos, indiretos e evolução no plano de carreira até o topo.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-950/80">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal className="max-w-3xl mx-auto text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-foreground">
            Como funciona para o licenciado
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Três etapas claras — da entrada ao crescimento da sua operação com a iGreen.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.n} delayMs={i * 100}>
              <Card className="h-full rounded-[2rem] border border-border shadow-lg bg-card">
                <CardContent className="p-8 space-y-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-black text-lg">
                    {step.n}
                  </span>
                  <h3 className="text-xl font-black text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.text}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
