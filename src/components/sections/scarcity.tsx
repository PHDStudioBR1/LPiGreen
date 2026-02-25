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
            Número de vagas é limitado
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-end">
              <span className="font-bold text-gray-600">Neste momento, na sua região:</span>
              <span className="text-2xl font-black text-red-600">77% das vagas preenchidas</span>
            </div>
            <Progress value={77} className="h-4 bg-red-100" />
          </div>

          <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed text-left">
            <p>
              A capacidade de geração das nossas usinas de energia limpa não é infinita. Cada usina produz uma
              quantidade específica de energia, o que significa que só podemos atender um{' '}
              <span className="font-bold">número limitado de pessoas</span> em cada região.
            </p>
            <p>
              Isso significa que milhares de pessoas já garantiram o desconto... e as vagas restantes estão diminuindo
              todos os dias.
            </p>
            <p className="font-semibold">
              Por que isso acontece?
            </p>
            <p>
              Simples: a demanda está explodindo. Todo dia, mais pessoas descobrem que podem economizar até 50% na
              conta de luz sem fazer nada — e obviamente, querem entrar. Mas a produção de energia das usinas tem
              limite técnico. <span className="font-bold">Quando as vagas da sua região acabarem, não há mais o que fazer.</span>
            </p>
          </div>

          <p className="mt-6 text-red-700 font-bold">
            Com 77% das vagas já preenchidas, o tempo está acabando.
          </p>
        </div>
      </div>
    </section>
  );
}
