"use client"

import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export function SimulatorSection({ onCTAClick }: { onCTAClick: () => void }) {
  const [billValue, setBillValue] = useState(400);

  // Simulação baseada em desconto de 14%
  const monthlySavings = billValue * 0.14;
  const yearlySavings = monthlySavings * 12;

  return (
    <>
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
                      defaultValue={[400]}
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
                      <p className="text-sm font-bold text-primary uppercase tracking-widest">
                        Economia mensal
                      </p>
                      <p className="text-5xl font-black text-primary">
                        R$ {monthlySavings.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div className="bg-emerald-600 rounded-3xl p-8 text-center space-y-2 text-white shadow-xl shadow-emerald-200">
                      <p className="text-sm font-bold opacity-80 uppercase tracking-widest">
                        Economia em 1 ano
                      </p>
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
                      Faça parte da maior transição energética do Brasil agora <Zap className="ml-2 fill-current" />
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
                        * Simulação ilustrativa. Conexão Green: economia na conta sem investimento. Valores podem variar conforme região e consumo.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-neutral-950 border-t border-border dark:border-neutral-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-4xl font-headline font-black text-foreground">Como essa economia é possível?</h2>
              <p className="text-lg text-muted-foreground">A mídia testou e comprovou: entenda como a energia por assinatura reduz a sua conta sem que você precise instalar placas ou investir um centavo.</p>
            </div>

            <div className="w-full aspect-video rounded-2xl shadow-2xl border border-border dark:border-neutral-800 overflow-hidden relative bg-black">
              <iframe src="https://player.vimeo.com/video/1169991922?title=0&byline=0&portrait=0" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-start gap-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-down w-8 h-8 text-primary shrink-0 mt-1"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Economia Comprovada</h4>
                  <p className="text-sm md:text-base text-muted-foreground mt-1">A economia média em comparação ao que é cobrado pelas concessionárias é de 15%.</p>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-start gap-4 shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-8 h-8 text-primary shrink-0 mt-1"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Dinheiro no Bolso</h4>
                  <p className="text-sm md:text-base text-muted-foreground mt-1">"É como se por ano eu economizasse quase duas contas de energia" – relata cliente na reportagem.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
