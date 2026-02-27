"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function LegalSection() {
  return (
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            Como você aproveita a Lei 14.300/2022 para economizar na conta de luz?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Existe uma regulamentação no Brasil, a{' '}
            <span className="font-bold">Lei nº 14.300/2022</span>, que permite:
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Usar energia limpa na sua casa ou empresa sem investimento, sem burocracia e sem fidelidade — a energia é injetada na rede da distribuidora (Cemig, CPFL, Equatorial e outras).
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 text-lg text-muted-foreground leading-relaxed">
          <p>Isso mesmo.</p>
          <p>Você não precisa fazer obra.</p>
          <p>Não precisa investir em equipamento.</p>
          <p>Não precisa mudar nada na sua casa.</p>
          <p>
            E ainda assim, você pode <span className="font-bold">economizar na sua conta de luz</span> e ter acesso ao Cashback Indicou, Ganhou.
          </p>
          <p>Como?</p>
          <p>
            Através de um modelo chamado <span className="font-bold">geração compartilhada de energia limpa</span>.
          </p>
          <p>E é exatamente isso que a iGreen Energy oferece para você.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl border border-border shadow-lg">
            <CardContent className="p-6 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Regulamentada pelo Governo
              </h3>
              <p className="text-sm text-muted-foreground">
                A Lei 14.300/2022 garante o direito de todo brasileiro acessar energia limpa por assinatura, sem
                burocracia.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border shadow-lg">
            <CardContent className="p-6 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Geração Distribuída
              </h3>
              <p className="text-sm text-muted-foreground">
                Fazendas de energia limpa produzem e injetam na rede. Você recebe os créditos direto na sua conta de
                luz.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border shadow-lg">
            <CardContent className="p-6 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Sem Instalação
              </h3>
              <p className="text-sm text-muted-foreground">
                Você não precisa instalar nada na sua casa ou empresa. A energia é gerada remotamente e compensada na
                sua fatura.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border shadow-lg">
            <CardContent className="p-6 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Sem Custo para Aderir
              </h3>
              <p className="text-sm text-muted-foreground">
                Você não paga taxa de adesão, instalação ou mensalidade extra. Não precisa fazer nenhum pagamento
                adicional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

