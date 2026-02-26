"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PRESS_ITEMS = [
  {
    outlet: 'Portal G1',
    title: '\"Nova lei permite que brasileiros economizem até 50% na conta de luz sem instalar painéis\"',
    quote:
      '\"A Lei 14.300/2022 regulamenta a geração compartilhada de energia limpa no Brasil, permitindo que consumidores residenciais tenham acesso a créditos energéticos de usinas remotas de energia limpa.\"',
  },
  {
    outlet: 'Folha de S.Paulo',
    title: '\"Energia limpa compartilhada cresce 340% no Brasil após nova regulamentação\"',
    quote:
      '\"Modelo que já é realidade nos EUA e Europa ganha força no país. Consumidores podem economizar sem fazer investimento inicial.\"',
  },
  {
    outlet: 'O Globo',
    title: '\"Geração compartilhada: a revolução silenciosa na conta de luz dos brasileiros\"',
    quote:
      '\"Especialistas apontam que o modelo pode beneficiar mais de 15 milhões de famílias brasileiras nos próximos 5 anos.\"',
  },
  {
    outlet: 'InfoMoney',
    title: '\"Como funciona a energia limpa por assinatura que já atende milhares de brasileiros\"',
    quote:
      '\"Sem custo de instalação e sem obras, consumidores recebem descontos diretos na fatura de energia. Modelo importado dos EUA chega com força ao Brasil.\"',
  },
  {
    outlet: 'Globo News / CNN Brasil',
    title: '\"Reportagem sobre energia limpa compartilhada\"',
    quote:
      '\"A reportagem mostra famílias que já economizam centenas de reais por mês usando energia limpa sem ter painéis em casa. O modelo, comum em países desenvolvidos, agora é acessível no Brasil.\"',
  },
  {
    outlet: 'Site do Governo / ANEEL',
    title: '\"ANEEL regulamenta geração compartilhada de energia renovável\"',
    quote:
      '\"Resolução permite que consumidores recebam créditos de usinas remotas de energia limpa. Medida visa democratizar acesso à energia limpa e barata.\"',
  },
];

export function PressProofSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            Veja o que a imprensa diz sobre esse modelo regulamentado
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {PRESS_ITEMS.map((item) => (
            <Card key={item.outlet} className="rounded-3xl border border-border shadow-lg">
              <CardContent className="p-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {item.outlet}
                </p>
                <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.quote}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-10 max-w-3xl mx-auto text-center text-sm md:text-base text-muted-foreground">
          <span className="font-bold">
            G1, Folha, O Globo, InfoMoney, CNN Brasil e ANEEL
          </span>{' '}
          — quando todos os grandes veículos confirmam, não restam dúvidas:{' '}
          <span className="font-bold">esse modelo é real, regulamentado e funciona.</span>
        </p>

        <div className="mt-10 max-w-3xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-headline font-bold text-foreground">
            E é exatamente isso que a iGreen Energy oferece para você
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            A iGreen trouxe esse modelo internacional para o Brasil.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <span className="font-bold">Parceria Vibra e Comerc Energia</span> •{' '}
            <span className="font-bold">Selo Great Place to Work (GPTW 2025-2026)</span> •{' '}
            <span className="font-bold">Mais de 500.000 clientes no Brasil</span>
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            A iGreen foi fundada em 2021; em 2023, 50% da empresa foi adquirida por gigantes do setor. Você está entrando em algo que já provou funcionar no mundo inteiro.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Com a lei brasileira do seu lado, você pode economizar na conta de luz sem investimento, sem burocracia e sem fidelidade — energia limpa injetada na rede da sua distribuidora.
          </p>
        </div>
      </div>
    </section>
  );
}

