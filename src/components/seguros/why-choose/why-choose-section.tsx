"use client";

import { Check, X } from "lucide-react";
import { SEGUROS_COMPARISON } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionBlock } from "@/components/seguros/ui/motion";

function StatusIcon({ value, positive }: { value: boolean; positive: boolean }) {
  const show = positive ? value : !value;
  if (show) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-seguros-primary/20">
        <Check className="h-4 w-4 text-seguros-primary" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15">
      <X className="h-4 w-4 text-red-400" />
    </span>
  );
}

export function WhyChooseSection() {
  return (
    <section id="comparacao" className="seguros-section bg-seguros-dark/50">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Por que escolher"
          title="Seguro Digital vs Seguro Tradicional"
          description="Veja por que milhares de brasileiros estão migrando para o modelo digital."
          className="mb-10 sm:mb-14"
        />

        <MotionBlock className="mx-auto max-w-4xl">
          {/* Mobile: cards empilhados */}
          <div className="space-y-3 md:hidden">
            {SEGUROS_COMPARISON.map((row) => (
              <div key={row.label} className="seguros-glass rounded-2xl p-4">
                <p className="mb-3 text-sm font-medium leading-snug text-seguros-text">
                  {row.label}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-seguros-primary">Digital</span>
                    <StatusIcon value={row.digital} positive />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-seguros-muted">Tradicional</span>
                    <StatusIcon value={row.traditional} positive={false} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabela */}
          <div className="seguros-glass seguros-glow hidden overflow-hidden rounded-3xl md:block">
            <div className="grid grid-cols-3 gap-4 border-b border-seguros-primary/10 bg-seguros-secondary/30 p-4 sm:p-6">
              <div className="text-sm font-medium text-seguros-muted">Critério</div>
              <div className="text-center font-seguros-headline font-bold text-seguros-primary">
                Seguro Digital
              </div>
              <div className="text-center font-seguros-headline font-bold text-seguros-muted">
                Tradicional
              </div>
            </div>

            {SEGUROS_COMPARISON.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 items-center gap-4 px-4 py-4 sm:px-6 ${
                  i % 2 === 0 ? "bg-seguros-bg/40" : ""
                }`}
              >
                <div className="text-sm font-medium text-seguros-text sm:text-base">{row.label}</div>
                <div className="flex justify-center">
                  <StatusIcon value={row.digital} positive />
                </div>
                <div className="flex justify-center">
                  <StatusIcon value={row.traditional} positive={false} />
                </div>
              </div>
            ))}
          </div>
        </MotionBlock>
      </div>
    </section>
  );
}
