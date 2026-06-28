"use client"

import React from 'react';
import { Button } from '@/components/ui/button';

export function Footer({ onCTAClick }: { onCTAClick?: () => void }) {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16">
      <div className="container mx-auto px-6">
        <div className="space-y-4 text-center">
          <h3 className="text-xl font-headline font-bold text-white">
            iGreen Energy — Energia limpa por assinatura
          </h3>
          <p className="text-sm text-gray-400">
            Parceria Vibra e Comerc Energia • Mais de 500.000 clientes no Brasil • Selo Great Place to Work (GPTW 2025-2026) • Modelo 100% regulamentado pela ANEEL
          </p>
          {onCTAClick && (
            <div className="pt-4">
              <Button
                onClick={onCTAClick}
                className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-lg hover:bg-primary/90 transition-all dark:text-white"
              >
                Faça parte da transição energética
              </Button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
