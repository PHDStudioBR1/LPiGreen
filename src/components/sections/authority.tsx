"use client"

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const NEWS_ITEMS = [
  {
    outlet: 'CNN Brasil',
    title: 'Contas de luz vão subir até o triplo do IPCA em 2026',
  },
  {
    outlet: 'Canal Solar',
    title: 'Conta de luz acumula alta de 16% e deve subir 8% em 2026',
  },
  {
    outlet: 'Gazeta do Povo',
    title: 'Conta de luz deve subir em 2026 para bancar R$ 47,8 bilhões em subsídios',
  },
  {
    outlet: 'Portal Solar',
    title: 'Tarifa residencial de energia deve subir 5,4% em média em 2026',
  },
];

export function AuthoritySection({ onCTAClick }: { onCTAClick?: () => void }) {
  return (
    <section className="py-20 bg-white dark:bg-neutral-950 border-y border-border dark:border-neutral-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-neutral-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-700 dark:text-red-400">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Atenção
          </div>
          <h2 className="text-2xl md:text-3xl font-headline font-black text-gray-900 dark:text-gray-100">
            A imprensa já alertou: a conta de luz em 2026 subiu e pode chegar a aumentos de até 8% a 13% na tarifa!
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Proteja-se dos aumentos: veja o que a mídia está dizendo:
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {NEWS_ITEMS.map((item) => (
            <Link key={item.outlet} href="/formulario">
              <Card className="group overflow-hidden rounded-2xl border border-border dark:border-neutral-800 shadow-lg hover:shadow-xl transition-shadow h-full bg-white dark:bg-neutral-900">
                <CardContent className="flex h-full flex-col justify-between p-6 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                    {item.outlet}
                  </div>
                  <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-primary mt-2">
                    <span>Ver matéria completa</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Faça parte da maior transição energética do Brasil: descubra como se proteger desses aumentos e economizar na sua conta de luz.
        </p>
        {onCTAClick && (
          <div className="mt-6 text-center">
            <Link
              href="/formulario"
              className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-lg hover:bg-primary/90 transition-all"
            >
              Quero economizar na conta de luz
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
