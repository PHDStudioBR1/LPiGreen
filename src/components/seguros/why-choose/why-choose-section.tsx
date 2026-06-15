"use client";

import { Check, X } from "lucide-react";
import { SEGUROS_COMPARISON } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionBlock } from "@/components/seguros/ui/motion";

function StatusIcon({ value, positive }: { value: boolean; positive: boolean }) {
  const show = positive ? value : !value;
  if (show) {
    return (
      <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-seguros-primary/20">
        <Check className="w-4 h-4 text-seguros-primary" />
      </span>
    );
  }
  return (
    <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-red-500/15">
      <X className="w-4 h-4 text-red-400" />
    </span>
  );
}

export function WhyChooseSection() {
  return (
    <section id="comparacao" className="py-20 md:py-28 bg-seguros-dark/50">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Por que escolher"
          title="Seguro Digital vs Seguro Tradicional"
          description="Veja por que milhares de brasileiros estão migrando para o modelo digital."
          className="mb-14"
        />

        <MotionBlock className="max-w-4xl mx-auto">
          <div className="seguros-glass rounded-3xl overflow-hidden seguros-glow">
            <div className="grid grid-cols-3 gap-4 p-4 sm:p-6 border-b border-seguros-primary/10 bg-seguros-secondary/30">
              <div className="text-seguros-muted text-sm font-medium">Critério</div>
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
                className={`grid grid-cols-3 gap-4 px-4 sm:px-6 py-4 items-center ${
                  i % 2 === 0 ? "bg-seguros-bg/40" : ""
                }`}
              >
                <div className="text-seguros-text text-sm sm:text-base font-medium">{row.label}</div>
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
