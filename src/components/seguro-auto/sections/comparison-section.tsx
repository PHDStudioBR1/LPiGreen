"use client";

import { Check, X } from "lucide-react";
import { SEGUROS_COMPARISON } from "@/lib/seguros/data";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { Button } from "@/components/seguro-auto/ui/button";
import { PremiumCard } from "@/components/seguro-auto/ui/premium-card";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

type ComparisonSectionProps = {
  onQuoteClick?: () => void;
};

function CellValue({ value, variant }: { value: string; variant: "igreen" | "traditional" }) {
  if (variant === "igreen") {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <Check className="h-4 w-4 shrink-0 text-seguros-primary" strokeWidth={2.5} />
        <span className="font-medium text-sa-text">{value}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <X className="h-4 w-4 shrink-0 text-red-500" strokeWidth={2.5} />
      <span className="text-sa-muted">{value}</span>
    </span>
  );
}

export function ComparisonSection({ onQuoteClick }: ComparisonSectionProps) {
  return (
    <section id="comparacao" className="bg-white py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Comparativo"
            title="Por que escolher a iGreen?"
            description="Veja como nosso modelo digital se diferencia das seguradoras tradicionais."
          />
        </MotionBlock>

        <MotionBlock delay={0.1}>
          <PremiumCard padding="lg" hover={false} className="overflow-hidden p-0">
            <div className="hidden md:grid md:grid-cols-[1.2fr_1fr_1fr] md:gap-0">
              <div className="border-b border-sa-border/60 bg-sa-surface/40 px-8 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-sa-muted">
                  Característica
                </p>
              </div>
              <div className="border-b border-sa-border/60 px-8 py-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-seguros-primary">
                  iGreen
                </p>
              </div>
              <div className="border-b border-sa-border/60 px-8 py-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                  Tradicional
                </p>
              </div>

              {SEGUROS_COMPARISON.map((row, i) => (
                <div key={row.characteristic} className="contents">
                  <div
                    className={`px-8 py-5 ${i < SEGUROS_COMPARISON.length - 1 ? "border-b border-sa-border/40" : ""}`}
                  >
                    <p className="text-sm font-medium text-sa-text">{row.characteristic}</p>
                  </div>
                  <div
                    className={`px-8 py-5 ${i < SEGUROS_COMPARISON.length - 1 ? "border-b border-sa-border/40" : ""}`}
                  >
                    <CellValue value={row.igreen} variant="igreen" />
                  </div>
                  <div
                    className={`px-8 py-5 ${i < SEGUROS_COMPARISON.length - 1 ? "border-b border-sa-border/40" : ""}`}
                  >
                    <CellValue value={row.traditional} variant="traditional" />
                  </div>
                </div>
              ))}
            </div>

            <div className="divide-y divide-sa-border/40 md:hidden">
              {SEGUROS_COMPARISON.map((row) => (
                <div key={row.characteristic} className="p-5">
                  <p className="mb-4 text-sm font-semibold text-sa-text">{row.characteristic}</p>
                  <div className="space-y-3">
                    <div className="rounded-xl bg-sa-surface p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-seguros-primary">
                        iGreen
                      </p>
                      <CellValue value={row.igreen} variant="igreen" />
                    </div>
                    <div className="rounded-xl bg-sa-surface p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-red-500">
                        Tradicional
                      </p>
                      <CellValue value={row.traditional} variant="traditional" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </MotionBlock>

        <MotionBlock delay={0.2} className="mt-12 text-center">
          <Button
            onClick={() => {
              trackSegurosQuoteClick("comparison");
              onQuoteClick?.();
            }}
          >
            Cotar agora
          </Button>
        </MotionBlock>
      </Container>
    </section>
  );
}
