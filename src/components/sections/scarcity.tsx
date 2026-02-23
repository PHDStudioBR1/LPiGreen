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
            Atenção: Vagas limitadas
          </div>
          
          <h2 className="text-3xl md:text-4xl font-headline font-black text-gray-900 mb-8">
            Nossa capacidade de geração por usina é finita.
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-end">
              <span className="font-bold text-gray-600">Disponibilidade na sua região:</span>
              <span className="text-2xl font-black text-red-600">77% das vagas preenchidas</span>
            </div>
            <Progress value={77} className="h-4 bg-red-100" />
          </div>

          <p className="text-gray-600 leading-relaxed italic">
            "A demanda por energia limpa superou nossas expectativas este mês. Para garantir o desconto de todos os assinantes, precisamos limitar novas adesões conforme a capacidade das nossas usinas solares e biomassa."
          </p>
        </div>
      </div>
    </section>
  );
}
