"use client";

import React from "react";
import { Plane, Ship, Snowflake } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const STEPS = [
  { role: "Sênior", desc: "Primeiro patamar consolidado — base e consistência." },
  { role: "Gestor", desc: "Liderança de equipe e metas de volume." },
  { role: "Executivo", desc: "Visão regional e bônus ampliados." },
  { role: "Diretor", desc: "Estrutura de rede madura e premiações de elite." },
  { role: "Acionista", desc: "Topo do plano — participação e legado no negócio." },
] as const;

const TRIPS = [
  { icon: Ship, label: "Cruzeiro" },
  { icon: Snowflake, label: "Snow" },
  { icon: Plane, label: "Destinos internacionais" },
] as const;

export function CareerPlanSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Plano de carreira
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-foreground leading-tight">
            Da evolução às viagens exclusivas
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            A iGreen premia o desempenho com experiências inesquecíveis: cruzeiro, snow e destinos internacionais para quem avança nos níveis.
          </p>
        </ScrollReveal>

        <ScrollReveal className="relative max-w-5xl mx-auto">
          <div className="hidden md:block absolute left-[8%] right-[8%] top-8 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" aria-hidden />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {STEPS.map((step, i) => (
              <div key={step.role} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-lg mb-4 md:mb-6 border-4 border-background">
                  {i + 1}
                </div>
                <h3 className="font-black text-foreground text-lg">{step.role}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed px-1">
                  {step.desc}
                </p>
                {i < STEPS.length - 1 && (
                  <div className="md:hidden w-px h-8 bg-border my-2" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={120} className="mt-14 md:mt-20">
          <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-card p-6 md:p-10 shadow-lg">
            <p className="text-center font-bold text-foreground mb-6">Viagens e experiências</p>
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4">
              {TRIPS.map((t) => (
                <div
                  key={t.label}
                  className="flex-1 flex items-center gap-3 justify-center sm:justify-start rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <t.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-foreground text-sm md:text-base">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
