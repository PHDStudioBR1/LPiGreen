"use client";

import React from "react";
import Link from "next/link";
import { ctaGlowClasses } from "@/lib/cro-cta";

export function Footer({ onCTAClick }: { onCTAClick?: () => void }) {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-14 md:py-16 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="space-y-4 text-center mb-8">
          <h3 className="text-xl font-headline font-bold text-white">
            iGreen Energy — Licenciamento & expansão 2026
          </h3>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            +450 mil clientes no ecossistema • Presença nacional • Expansão internacional • Modelo regulado pela ANEEL
            (Lei 14.300/2022)
          </p>
          <p className="text-sm text-zinc-500">WhatsApp • E-mail • @igreenenergy</p>
          {onCTAClick && (
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/formulario"
                className={`inline-flex h-12 px-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 ${ctaGlowClasses}`}
              >
                Quero ser um Licenciado
              </Link>
              <button
                type="button"
                onClick={onCTAClick}
                className="inline-flex h-12 px-8 items-center justify-center rounded-xl border border-primary/60 text-primary font-bold hover:bg-primary/10 transition-colors"
              >
                Conhecer o Plano de Negócios
              </button>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs space-y-3 text-zinc-500">
          <p className="font-semibold text-zinc-300">Licenciado Autorizado iGreen Energy</p>
          <p>
            iGreen Energy LTDA. Todos os direitos reservados. A iGreen Energy atua em conformidade com a Lei 14.300/2022 e
            as resoluções da ANEEL para geração distribuída de energia limpa.
          </p>
        </div>
      </div>
    </footer>
  );
}
