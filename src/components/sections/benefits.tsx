"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const BENEFITS = [
  {
    title: 'Conexão Club',
    text: 'Clube de benefícios gratuito para clientes: mais de 600 mil ofertas com descontos de até 70% em farmácias (Drogasil, Pague Menos) e cinemas (Cinemark).',
  },
  {
    title: 'Cashback Indicou, Ganhou',
    text: 'Indique amigos e ganhe: você pode zerar a própria conta de luz com o programa de indicação da Conexão Green.',
  },
  {
    title: 'Energia Limpa na Rede',
    text: 'Energia limpa injetada na rede da sua distribuidora (Cemig, CPFL, Equatorial). Sem investimento, sem burocracia e sem fidelidade.',
  },
  {
    title: 'Contribuição Ambiental',
    text: 'Ao usar energia limpa, você ajuda o planeta — e ainda pode usar isso na sua imagem.',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            Além de economizar na conta de luz, você ainda ganha:
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <Card key={benefit.title} className="rounded-3xl border border-border shadow-lg bg-white">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-base font-bold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center text-sm text-muted-foreground leading-relaxed">
          <p>Simples, sem fidelidade e com benefícios reais. Faça parte da maior transição energética do Brasil.</p>
          <p className="mt-2">
            Confira depoimentos e cases reais de quem já está economizando:
          </p>
        </div>
      </div>
    </section>
  );
}

