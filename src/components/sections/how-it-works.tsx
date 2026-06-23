"use client"

import React from 'react';
import { Sun, Zap, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const STEPS = [
  {
    icon: Sun,
    title: '1. Nós geramos',
    description:
      'A iGreen produz energia 100% limpa em fazendas solares e injeta na rede pública.',
  },
  {
    icon: Zap,
    title: '2. A Distribuidora entrega',
    description:
      'A Cemig/CPFL continua a levar a energia até sua casa. Nada muda na sua instalação.',
  },
  {
    icon: TrendingDown,
    title: '3. Você lucra',
    description:
      'Os créditos da nossa energia são vinculados ao seu CPF/CNPJ e a sua conta chega mais barata.',
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground leading-tight">
            É como mudar de operadora de telemóvel (só que mais fácil).
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Você já não escolhe qual plano de internet usar? Agora pode escolher pagar menos na sua energia. Sem trocar
            nenhum fio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {STEPS.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6 sm:p-8 flex flex-col gap-4">
                <Icon className="w-14 h-14 sm:w-16 sm:h-16 text-primary shrink-0" strokeWidth={1.25} aria-hidden />
                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-bold text-foreground tracking-tight">{title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
