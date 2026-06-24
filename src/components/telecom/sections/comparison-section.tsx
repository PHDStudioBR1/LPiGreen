"use client";

import { Check, X } from "lucide-react";
import { TELECOM_COMPARISON } from "@/lib/telecom/data";
import { trackTelecomQuoteClick } from "@/lib/telecom/analytics";
import { Container } from "@/components/telecom/ui/container";
import { SectionHeading } from "@/components/telecom/ui/section-heading";
import { Button } from "@/components/telecom/ui/button";
import { PremiumCard } from "@/components/telecom/ui/premium-card";
import { MotionBlock } from "@/components/telecom/ui/motion";

type ComparisonSectionProps = {
  onQuoteClick?: () => void;
};

function CellValue({ value, positive }: { value: string; positive?: boolean }) {
  const isPositive =
    positive ??
    (value.toLowerCase().includes("sim") ||
      value.toLowerCase().includes("sem") ||
      value.toLowerCase().includes("100%") ||
      value.toLowerCase().includes("online") ||
      value.toLowerCase().includes("24") ||
      value.toLowerCase().includes("grátis") ||
      value.toLowerCase().includes("gratuita") ||
      value.toLowerCase().includes("incluso") ||
      value.toLowerCase().includes("até"));

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      {isPositive ? (
        <Check className="h-4 w-4 shrink-0 text-[#00e676]" strokeWidth={2.5} />
      ) : (
        <X className="h-4 w-4 shrink-0 text-white/30" strokeWidth={2.5} />
      )}
      <span className={isPositive ? "font-medium text-white" : "text-white/50"}>
        {value}
      </span>
    </span>
  );
}

export function ComparisonSection({ onQuoteClick }: ComparisonSectionProps) {
  return (
    <section id="comparativo" className="relative py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Comparativo"
            title="Por que migrar para a Telecom iGreen?"
            description="Veja como nosso modelo digital se diferencia das operadoras tradicionais."
          />
        </MotionBlock>

        <MotionBlock delay={0.1}>
          <PremiumCard padding="lg" hover={false} className="overflow-hidden p-0">
            <div className="hidden md:grid md:grid-cols-[1.2fr_1fr_1fr] md:gap-0">
              <div className="border-b border-white/[0.08] bg-white/[0.04] px-8 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Característica
                </p>
              </div>
              <div className="border-b border-white/[0.08] bg-[#00e676]/[0.06] px-8 py-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-[#00e676]">
                  Telecom iGreen
                </p>
              </div>
              <div className="border-b border-white/[0.08] px-8 py-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Tradicional
                </p>
              </div>

              {TELECOM_COMPARISON.map((row, i) => (
                <div key={row.characteristic} className="contents">
                  <div
                    className={`px-8 py-5 ${i < TELECOM_COMPARISON.length - 1 ? "border-b border-white/[0.06]" : ""}`}
                  >
                    <p className="text-sm font-medium text-white">{row.characteristic}</p>
                  </div>
                  <div
                    className={`bg-[#00e676]/[0.04] px-8 py-5 ${i < TELECOM_COMPARISON.length - 1 ? "border-b border-white/[0.06]" : ""}`}
                  >
                    <CellValue value={row.igreen} positive />
                  </div>
                  <div
                    className={`px-8 py-5 ${i < TELECOM_COMPARISON.length - 1 ? "border-b border-white/[0.06]" : ""}`}
                  >
                    <CellValue value={row.traditional} positive={false} />
                  </div>
                </div>
              ))}
            </div>

            <div className="divide-y divide-white/[0.06] md:hidden">
              {TELECOM_COMPARISON.map((row) => (
                <div key={row.characteristic} className="p-5">
                  <p className="mb-4 text-sm font-semibold text-white">{row.characteristic}</p>
                  <div className="space-y-3">
                    <div className="rounded-xl bg-[#00e676]/[0.06] p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#00e676]">
                        Telecom iGreen
                      </p>
                      <CellValue value={row.igreen} positive />
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                        Tradicional
                      </p>
                      <CellValue value={row.traditional} positive={false} />
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
              trackTelecomQuoteClick("comparison");
              onQuoteClick?.();
            }}
          >
            Contratar agora
          </Button>
        </MotionBlock>
      </Container>
    </section>
  );
}
