"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Leaf, Smartphone, Sun, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const SOURCES = [
  {
    icon: Leaf,
    title: "Conexão Green",
    text: "Desconto para residências (baixa tensão). Você ganha até 4% de recorrência todo mês.",
  },
  {
    icon: Building2,
    title: "Conexão Livre",
    text: "Até 30% de desconto para grandes empresas. Ganhe bônus imediato de 10% sobre a conta líquida + até 2% de recorrência (contratos longos).",
  },
  {
    icon: Smartphone,
    title: "Conexão Telecom",
    text: "A maior cobertura 5G do Brasil. Ganhe 100% da primeira fatura na portabilidade + até R$ 14,00 mensais por linha.",
  },
  {
    icon: Sun,
    title: "Conexão Placas & Solar",
    text: "Venda de usinas para quem quer gerar a própria energia (com ou sem investimento do cliente). Comissões de até 10% sobre o projeto.",
  },
  {
    icon: Users,
    title: "Conexão Expansão",
    text: "Construa seu time comercial. Ganhe R$ 300 imediatos por novo licenciado direto + royalties sobre a produção da sua equipe.",
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
            Muito além da energia: Um portfólio completo para você lucrar.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Cinco frentes de receita para acelerar o faturamento imediato e a recorrência mensal.
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
