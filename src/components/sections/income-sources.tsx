"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Smartphone, Sun, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const SOURCES = [
  {
    icon: Leaf,
    title: "Green",
    text: "Ganhos sobre a economia mensal de terceiros — recorrência ligada à Conexão Green e ao ecossistema de energia limpa.",
  },
  {
    icon: Smartphone,
    title: "Telecom",
    text: "Recorrência sobre planos de internet e celular — comissões que se renovam mês a mês na sua base.",
  },
  {
    icon: Sun,
    title: "Livre / Solar",
    text: "Altas comissões em projetos de grande escala e usinas sem investimento do cliente final.",
  },
  {
    icon: Users,
    title: "Expansão",
    text: "Bônus por novos licenciados na equipe — cresça a rede e potencialize os ganhos indiretos.",
  },
] as const;

export function IncomeSourcesSection() {
  return (
    <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-950 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Ecossistema iGreen
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-foreground leading-tight">
            Suas fontes de ganho
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Um portfólio completo para você monetizar energia, telecom e expansão — com o peso de uma marca líder em sustentabilidade.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map((item, i) => (
            <ScrollReveal key={item.title} delayMs={i * 80}>
              <Card className="h-full rounded-3xl border border-border bg-white dark:bg-zinc-900/80 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-6 md:p-7 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
                    <item.icon className="w-6 h-6" strokeWidth={2.25} />
                  </div>
                  <h3 className="text-lg font-black text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
