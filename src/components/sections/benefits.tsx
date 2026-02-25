"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const BENEFITS = [
  {
    title: 'Sorteios Mensais',
    text: 'Já entregamos prêmios em valores financeiros, carro, moto, casa e muito mais para nossos clientes.',
  },
  {
    title: 'Descontos em Parceiros',
    text: 'Rede de benefícios exclusivos em produtos e serviços de empresas parceiras.',
  },
  {
    title: 'Programa de Indicação',
    text: 'Indique amigos e ganhe bônus toda vez que alguém aderir ao programa.',
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
            Além de economizar todo mês na conta de luz, você ainda ganha:
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
          <p>Veja como é simples e os benefícios que você tem:</p>
          <p className="mt-2">
            Dá só uma olhada nesse caso real de uma pessoa que ganhou um carro ZERO KM:
          </p>
        </div>
      </div>
    </section>
  );
}

