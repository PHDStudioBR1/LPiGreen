"use client"

import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export function SimulatorSection({ onCTAClick }: { onCTAClick: () => void }) {
  const [billValue, setBillValue] = useState(500);

  // Typical savings calculation (15% is a safe realistic average for GDR)
  const monthlySavings = billValue * 0.15;
  const yearlySavings = monthlySavings * 12;

  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">Simulador de Economia</h2>
            <p className="text-lg text-muted-foreground">
              Descubra quanto você pode deixar de pagar todos os meses.
            </p>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                      Valor Médio da sua Conta:
                    </label>
                    <span className="text-4xl font-black text-primary">
                      R$ {billValue}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[500]}
                    max={2000}
                    min={100}
                    step={50}
                    onValueChange={(vals) => setBillValue(vals[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs font-bold text-muted-foreground">
                    <span>R$ 100</span>
                    <span>R$ 2.000+</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-primary/10 rounded-3xl p-8 text-center space-y-2 border border-primary/20">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Sua Economia Mensal</p>
                    <p className="text-5xl font-black text-primary">
                      R$ {monthlySavings.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="bg-emerald-600 rounded-3xl p-8 text-center space-y-2 text-white shadow-xl shadow-emerald-200">
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Economia em 1 Ano</p>
                    <p className="text-5xl font-black">
                      R$ {yearlySavings.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    size="lg"
                    onClick={onCTAClick}
                    className="h-16 px-12 text-xl font-black rounded-2xl w-full md:w-auto shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Quero Garantir Essa Economia <Zap className="ml-2 fill-current" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
