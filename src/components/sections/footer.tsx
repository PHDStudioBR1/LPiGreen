"use client"

import React from 'react';
import Link from 'next/link';

export function Footer({ onCTAClick }: { onCTAClick?: () => void }) {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16">
      <div className="container mx-auto px-6">
        <div className="space-y-4 text-center mb-8">
          <h3 className="text-xl font-headline font-bold text-white">
            iGreen Energy — Energia limpa por assinatura
          </h3>
          <p className="text-sm text-gray-400">
            Parceria Vibra e Comerc Energia • Mais de 500.000 clientes no Brasil • Selo Great Place to Work (GPTW 2025-2026) • Modelo 100% regulamentado pela ANEEL
          </p>
          <p className="text-sm text-gray-400">
            WhatsApp • E-mail • @igreenenergy
          </p>
          {onCTAClick && (
            <div className="pt-4">
              <Link
                href="/formulario"
                className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-lg hover:bg-primary/90 transition-all"
              >
                Faça parte da transição energética
              </Link>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs space-y-3">
          <p className="font-semibold text-gray-300">
          Licenciado Autorizado iGreen Energy
          </p>
          <p>
            iGreen Energy LTDA. Todos os direitos reservados. A iGreen Energy atua em conformidade com a Lei 14.300/2022
            e as resoluções da ANEEL para geração distribuída de energia limpa.
          </p>
        </div>
      </div>
    </footer>
  );
}
