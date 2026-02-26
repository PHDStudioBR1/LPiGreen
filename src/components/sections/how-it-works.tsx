"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            Veja o exemplo abaixo para entender:
          </h2>
        </div>

        <Card className="max-w-4xl mx-auto mb-12 rounded-[2.5rem] border-none shadow-2xl bg-white">
          <CardContent className="p-8 md:p-12 space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              Você conhece operadora de celular, certo? Claro, Vivo, TIM, Oi...
            </p>
            <p>
              Todas elas <span className="font-bold">não produzem a internet</span>. A internet não é "fabricada" por elas. Elas usam a infraestrutura de antenas e cabos (que muitas vezes nem são delas) para entregar o sinal até você.
            </p>
            <p>
              Mas cada operadora tem parcerias, acordos e formas diferentes de te cobrar pelo mesmo serviço.
            </p>
            <p>
              É por isso que:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>A Claro pode te oferecer 50GB por R$ 100</li>
              <li>A Vivo pode te oferecer 50GB por R$ 120</li>
            </ul>
            <p>
              É a mesma internet. A mesma rede. O mesmo sinal.{' '}
              <span className="font-bold">A diferença está em quem está intermediando e qual é o modelo de negócio.</span>
            </p>
          </CardContent>
        </Card>

        <Card className="max-w-4xl mx-auto rounded-[2.5rem] border border-primary/20 shadow-xl bg-primary/5">
          <CardContent className="p-8 md:p-12 space-y-4 text-lg text-muted-foreground leading-relaxed">
            <h3 className="text-2xl font-bold text-primary">
              Agora transfere isso para a energia elétrica
            </h3>
            <p>
              A energia que chega na sua casa <span className="font-bold">não é "produzida" pela distribuidora</span>. A distribuidora (Cemig, CPFL, Equatorial, Enel, Light...) é só o "entregador" da energia.
            </p>
            <p>
              Essas empresas pegam energia de fontes (hidrelétricas), ou seja, onde o consumo é muito maior, e consequentemente o lucro deles também será muito maior ao repassar para a sua casa.
            </p>
            <h3 className="text-2xl font-bold text-primary mt-6">
              Entra a iGreen Energy
            </h3>
            <p>
              E aí que nós entramos.
            </p>
            <p>
              A iGreen tem <span className="font-bold">usinas de energia limpa</span>; a energia é produzida e <span className="font-bold">injetada na rede da distribuidora</span> (Cemig, CPFL, Equatorial e outras) — a mesma rede que já existe.
            </p>
            <p>
              E a gente faz um <span className="font-bold">acordo com a distribuidora</span> para vincular créditos de energia à sua conta.
            </p>
            <p className="font-medium">
              Resultado?
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Você continua recebendo energia da mesma distribuidora</li>
              <li>Pela mesma fiação</li>
              <li>Com a mesma qualidade</li>
              <li>Mas paga menos, porque agora está usando energia limpa</li>
            </ul>
            <p>
              Nada vai mudar na qualidade da sua energia, pelo contrário, será uma energia{' '}
              <span className="font-bold">mais limpa, sustentável e barata</span>!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
