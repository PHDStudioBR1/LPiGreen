"use client"

import React from 'react';
import { Smartphone, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">Como funciona a Energia por Assinatura?</h2>
          <p className="text-lg text-muted-foreground">
            É como a portabilidade do seu celular. Você continua usando a mesma rede, mas escolhe pagar para quem oferece o melhor preço.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="rounded-3xl border-none shadow-xl hover:shadow-2xl transition-shadow bg-white overflow-hidden group">
            <CardContent className="p-8 space-y-4">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold">Modelo Tradicional</h3>
              <p className="text-muted-foreground">
                Você é obrigado a comprar energia da concessionária local, aceitando as bandeiras tarifárias abusivas e taxas de distribuição caras.
              </p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <ArrowRight size={48} className="text-primary hidden md:block animate-pulse" />
            <ArrowRight size={48} className="text-primary md:hidden rotate-90 my-4 animate-pulse" />
          </div>

          <Card className="rounded-3xl border-2 border-primary shadow-2xl bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black py-1 px-4 rounded-bl-xl uppercase tracking-widest">
              Recomendado
            </div>
            <CardContent className="p-8 space-y-4">
              <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary">Modelo iGreen Energy</h3>
              <p className="text-foreground font-medium">
                Nós injetamos energia limpa gerada em nossas usinas direto na rede. A distribuidora abate esse valor da sua conta e você paga apenas o que consumiu com desconto garantido.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="glass rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto shadow-2xl">
          <div className="md:w-1/3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Smartphone size={160} className="text-primary relative z-10 mx-auto" strokeWidth={1} />
            </div>
          </div>
          <div className="md:w-2/3 space-y-6 text-center md:text-left">
            <h4 className="text-2xl font-bold">A Analogia da Operadora</h4>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Imagine que sua rede de energia é como o sinal de celular. A antena (distribuidora) é a mesma para todos, mas você pode assinar um plano mais barato com a iGreen. <span className="text-primary font-bold">A luz nunca cai</span>, o que muda é apenas o código de barras que você paga!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
