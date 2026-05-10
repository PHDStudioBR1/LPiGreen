"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Leaf, Smartphone, Sun, Users, type LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type IncomeSourceItem = {
  icon: LucideIcon;
  title: string;
  text: React.ReactNode;
};

const SOURCES: IncomeSourceItem[] = [
  {
    icon: Leaf,
    title: "Conexão Green",
    text: (
      <>
        Renda recorrente de até{" "}
        <span className="font-bold text-primary">4%</span> todos os meses sobre faturas de residências.
      </>
    ),
  },
  {
    icon: Building2,
    title: "Conexão Livre",
    text: (
      <>
        Bônus imediato de <span className="font-bold text-primary">10%</span> + recorrência de{" "}
        <span className="font-bold text-primary">2%</span> em grandes indústrias.
      </>
    ),
  },
  {
    icon: Smartphone,
    title: "Conexão Telecom",
    text: (
      <>
        A maior cobertura 5G do Brasil. Ganhe{" "}
        <span className="font-bold text-primary">100% da primeira fatura</span> na portabilidade +{" "}
        <span className="font-bold text-primary">até R$ 14,00 mensais</span> por linha.
      </>
    ),
  },
  {
    icon: Sun,
    title: "Conexão Placas & Solar",
    text: (
      <>
        Comissões agressivas de até{" "}
        <span className="font-bold text-primary">10%</span> sobre vendas de usinas de alto valor.
      </>
    ),
  },
  {
    icon: Users,
    title: "Conexão Expansão",
    text: (
      <>
        Ganhe <span className="font-bold text-primary">R$ 300</span> à vista por indicação de novos licenciados +
        royalties de equipa.
      </>
    ),
  },
];

export function IncomeSourcesSection() {
  return (
    <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-950 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-16">
          <p className="text-base font-bold uppercase tracking-[0.2em] text-primary">
            Ecossistema iGreen
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-black text-foreground leading-tight">
            Muito além da energia: Um portfólio completo para você lucrar.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Cinco frentes de receita para acelerar o faturamento imediato e a recorrência mensal.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {SOURCES.map((item, i) => (
            <ScrollReveal key={item.title} delayMs={i * 80}>
              <Card className="h-full rounded-3xl border border-border bg-white dark:bg-zinc-900/80 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-6 md:p-7 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
                    <item.icon className="w-6 h-6" strokeWidth={2.25} />
                  </div>
                  <h3 className="text-xl font-black text-foreground">{item.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
