"use client"

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';

export function ScarcitySection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center bg-red-50 border border-red-100 rounded-[2.5rem] p-8 md:p-12 shadow-inner">
          <div className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-sm mb-6">
            <AlertCircle size={20} />
            Atenção
          </div>
          
          <h2 className="text-3xl md:text-4xl font-headline font-black text-gray-900 mb-8">
            O oceano azul da energia no Brasil
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-end">
              <span className="font-bold text-gray-600">Mercado no Brasil:</span>
              <span className="text-2xl font-black text-red-600">+101 milhões de unidades consumidoras</span>
            </div>
            <Progress value={77} className="h-4 bg-red-100" />
            <p className="text-sm text-gray-600 font-semibold">A iGreen já atende mais de 500.000 clientes — e atingiu apenas 0,49% do mercado. Oportunidade gigante.</p>
          </div>

          <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed text-left">
            <p>
              O mercado brasileiro tem mais de <span className="font-bold">101 milhões de unidades consumidoras</span>. A iGreen já ultrapassou a marca de 500.000 clientes e atingiu apenas <span className="font-bold">0,49%</span> desse mercado — um verdadeiro oceano azul.
            </p>
            <p>
              Milhares de pessoas já garantiram economia na conta de luz sem investimento e sem fidelidade. A capacidade de atendimento por região pode ser limitada.
            </p>
            <p className="font-semibold">
              Por que agir agora?
            </p>
            <p>
              A demanda por energia limpa e economia na conta de luz só cresce. A iGreen conta com o selo Great Place to Work (GPTW 2025-2026) e parceria com Vibra e Comerc Energia. <span className="font-bold">Verifique se sua região tem vagas disponíveis e faça parte da maior transição energética do Brasil.</span>
            </p>
          </div>

          <p className="mt-6 text-red-700 font-bold">
            Mais de 500.000 brasileiros já estão economizando. Sua vez pode ser agora.
          </p>
        </div>
      </div>
    </section>
  );
}
