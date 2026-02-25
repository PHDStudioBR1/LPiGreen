"use client"

import React from 'react';

export function GlobalTrendSection() {
  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            Energia limpa por assinatura já é realidade em diversos países
          </h2>
          <p className="text-lg text-muted-foreground">
            O Brasil agora faz parte do grupo de países que regulamentaram a geração distribuída de energia limpa.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 text-lg text-muted-foreground leading-relaxed">
          <p>Nos Estados Unidos, isso existe desde 2006.</p>
          <p>
            Lá eles chamam de <span className="italic">Community Solar</span> (Energia Limpa Comunitária). Milhões de
            americanos já economizam na conta de luz sem ter um painel sequer no telhado.
          </p>
          <p>Na Alemanha, desde 2012.</p>
          <p>
            Os alemães desenvolveram o conceito de <span className="italic">Bürgerenergie</span> (Energia Cidadã), onde
            as pessoas compartilham energia de usinas de energia limpa coletivas.
          </p>
          <p>Na Austrália, desde 2015.</p>
          <p>
            Um dos países mais ensolarados do mundo usa esse modelo em larga escala — e hoje mais de 30% dos
            australianos têm acesso a energia limpa compartilhada.
          </p>
          <p>No Japão, desde 2017.</p>
          <p>
            Depois do desastre nuclear de Fukushima, o governo japonês incentivou fortemente a energia limpa
            compartilhada como alternativa segura e acessível.
          </p>
          <p>Na Espanha, Portugal, Inglaterra, Canadá...</p>
          <p>
            É um modelo consolidado, testado e comprovado. E agora, finalmente, chegou ao Brasil de forma regulamentada.
          </p>
          <p className="font-medium">
            Logo abaixo você fará o teste para saber se está apto para o desconto.
          </p>
        </div>
      </div>
    </section>
  );
}

