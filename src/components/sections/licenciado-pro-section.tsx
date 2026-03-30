"use client";

import React from "react";
import { Crown, Smartphone, Gift, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const BENEFITS = [
  {
    icon: Smartphone,
    text: "Saques ilimitados via app — controle total do seu fluxo financeiro na palma da mão.",
  },
  {
    icon: Sparkles,
    text: "Bônus indiretos na Expansão e Telecom — premiação em profundidade na rede.",
  },
  {
    icon: Gift,
    text: "Pulseira exclusiva PRO entregue na Convenção Anual — status visível, comunidade forte.",
  },
] as const;

export function LicenciadoProSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.25),transparent)] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal className="max-w-3xl mx-auto text-center space-y-5 mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-sm">
            <Crown className="w-4 h-4" />
            Status aspiracional
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black leading-tight">
            Licenciado PRO
          </h2>
          <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
            O próximo nível da sua jornada na iGreen: benefícios premium, reconhecimento e ferramentas que aceleram resultados.
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <ScrollReveal key={i} delayMs={i * 100}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 space-y-4 hover:border-primary/40 transition-colors duration-300">
                <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <b.icon className="w-5 h-5" />
                </div>
                <p className="text-sm md:text-base text-zinc-200 leading-relaxed">{b.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
