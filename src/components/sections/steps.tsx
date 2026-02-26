"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const STEPS = [
  {
    number: 1,
    title: 'Preencha o cadastro',
    text: 'Você preenche o cadastro aqui embaixo com seus dados.',
  },
  {
    number: 2,
    title: 'Consultor entra em contato',
    text: 'Um consultor da iGreen entra em contato com você.',
  },
  {
    number: 3,
    title: 'Análise de elegibilidade',
    text: 'Ele analisa e vê se você está apto e dentro das condições para receber o desconto.',
  },
  {
    number: 4,
    title: 'Vinculação dos créditos',
    text: 'Caso esteja, a gente vincula os créditos à sua conta.',
  },
  {
    number: 5,
    title: 'Comece a economizar',
    text: 'A partir do mês seguinte, você já começa a pagar menos.',
  },
];

export function StepsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            Como você entra
          </h2>
          <p className="text-lg text-muted-foreground">
            Sem investimento. Sem burocracia. Sem fidelidade.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {STEPS.map((step) => (
            <Card key={step.number} className="rounded-3xl border border-border shadow-lg">
              <CardContent className="p-6 text-center space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                  {step.number}
                </div>
                <h3 className="text-sm font-bold">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

