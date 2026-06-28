"use client"

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { trackHomeSimulatorUse } from '@/lib/home/analytics';
import {
  monthlyDiscountFromBill,
  projectedAnnualSavingsFromMonthly,
} from '@/lib/conexao-green-savings';

export interface SimulatorSectionProps {
  onCTAClick: () => void;
  /** Valor mensal da conta (R$), entre 100 e 3000 — controlado pela página */
  billValue: number;
  onBillValueChange: (value: number) => void;
}

export {
  monthlyDiscountFromBill,
  projectedAnnualSavingsFromMonthly,
} from '@/lib/conexao-green-savings';

export function SimulatorSection({
  onCTAClick,
  billValue,
  onBillValueChange,
}: SimulatorSectionProps) {
  const monthlySavings = monthlyDiscountFromBill(billValue);
  const yearlySavings = projectedAnnualSavingsFromMonthly(billValue);

  const handleBillChange = (value: number) => {
    onBillValueChange(value);
    trackHomeSimulatorUse(value);
  };

  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
              Quanto você pode economizar?
            </h2>
            <p className="text-lg text-muted-foreground">
              Simule com o valor da sua conta (Conexão Green) e veja o potencial de economia sem investimento e sem fidelidade.
            </p>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-neutral-800 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-lg font-bold text-muted-foreground uppercase tracking-wider">
                      Simule com o valor da sua conta
                    </label>
                    <span className="text-4xl font-black text-primary">
                      R$ {billValue.toFixed(0)}
                    </span>
                  </div>
                  <Slider
                    value={[billValue]}
                    max={3000}
                    min={100}
                    step={10}
                    onValueChange={(vals) => handleBillChange(vals[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs font-bold text-muted-foreground">
                    <span>R$ 100</span>
                    <span>R$ 3.000</span>
                  </div>
                </div>

                <div className="rounded-3xl p-8 md:p-10 text-center space-y-3 bg-emerald-600 text-white shadow-xl shadow-emerald-200/40 border border-emerald-500/30">
                  <p className="text-sm font-bold opacity-90 uppercase tracking-widest">
                    Poupança anual projetada (15% na fatura)
                  </p>
                  <p className="text-4xl sm:text-6xl font-black tracking-tight">
                    R$ {yearlySavings.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm opacity-90 max-w-md mx-auto">
                    Equivale a cerca de{' '}
                    <span className="font-bold">
                      R$ {monthlySavings.toFixed(2).replace('.', ',')}
                    </span>{' '}
                    por mês a menos na conta — só para você ter uma ideia do
                    tamanho do benefício antes de continuar.
                  </p>
                </div>

                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    onClick={onCTAClick}
                    className="h-16 px-12 text-xl font-black rounded-2xl w-full max-w-full md:w-auto shadow-xl hover:scale-[1.02] transition-all whitespace-normal md:whitespace-nowrap text-center h-auto min-h-16 md:min-h-0 md:h-16 py-3 md:py-0 dark:text-white"
                  >
                    <span className="min-w-0 text-center">Faça parte da maior transição energética do Brasil agora</span>
                    <Zap className="ml-2 fill-current shrink-0" />
                  </Button>
                  <div className="mt-8 space-y-3 text-sm text-muted-foreground text-left md:text-center">
                    <p>Agora pensa no que você poderia fazer com esse dinheiro:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Pagar uma escola melhor para o seu filho</li>
                      <li>Fazer aquela viagem que você adia há anos</li>
                      <li>Investir em algo que realmente importa</li>
                      <li>Ou simplesmente ter mais tranquilidade no fim do mês</li>
                    </ul>
                    <p className="text-xs italic">
                      * Simulação ilustrativa (15% ao ano sobre o valor mensal × 12). Conexão Green: sem investimento em instalação. Valores podem variar conforme região e consumo.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
