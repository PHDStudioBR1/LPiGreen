"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { SEGUROS_COMPARISON } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionBlock } from "@/components/seguros/ui/motion";
import { cn } from "@/lib/utils";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";

type WhyChooseSectionProps = {
  onQuoteClick?: () => void;
};

type ComparisonColumnProps = {
  title: string;
  variant: "neutral" | "igreen" | "traditional";
  items: string[];
};

function ComparisonIcon({ variant }: { variant: "igreen" | "traditional" }) {
  if (variant === "igreen") {
    return (
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-seguros-primary/20">
        <Check className="h-3 w-3 text-seguros-primary" strokeWidth={3} />
      </span>
    );
  }

  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15">
      <X className="h-3 w-3 text-red-400" strokeWidth={3} />
    </span>
  );
}

function ComparisonColumn({ title, variant, items }: ComparisonColumnProps) {
  return (
    <div
      className={cn(
        "seguros-comparison-column flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl",
        variant === "igreen" && "seguros-comparison-column--igreen"
      )}
    >
      <div
        className={cn(
          "border-b px-4 py-4 sm:px-6 sm:py-5",
          variant === "igreen"
            ? "border-seguros-primary/20 bg-seguros-primary/10"
            : "border-seguros-primary/10 bg-seguros-secondary/30"
        )}
      >
        <h3
          className={cn(
            "font-seguros-headline text-base font-bold sm:text-lg",
            variant === "igreen" && "text-seguros-primary",
            variant === "traditional" && "text-seguros-muted",
            variant === "neutral" && "text-seguros-text"
          )}
        >
          {title}
        </h3>
      </div>

      <ul className="flex flex-1 flex-col">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className={cn(
              "flex min-h-[3.25rem] items-center gap-3 border-b border-seguros-primary/8 px-4 py-3 last:border-b-0 sm:min-h-[3.5rem] sm:px-6 sm:py-3.5",
              index % 2 === 0 && "bg-seguros-bg/25"
            )}
          >
            {variant !== "neutral" && <ComparisonIcon variant={variant} />}
            <span
              className={cn(
                "text-sm leading-snug sm:text-[0.9375rem]",
                variant === "igreen" && "font-medium text-seguros-text",
                variant === "traditional" && "text-seguros-muted",
                variant === "neutral" && "font-medium text-seguros-text"
              )}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhyChooseSection({ onQuoteClick }: WhyChooseSectionProps) {
  const characteristics = SEGUROS_COMPARISON.map((row) => row.characteristic);
  const igreenItems = SEGUROS_COMPARISON.map((row) => row.igreen);
  const traditionalItems = SEGUROS_COMPARISON.map((row) => row.traditional);

  return (
    <section id="comparacao" className="seguros-section bg-seguros-dark/50">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Comparativo"
          title={
            <>
              Seguro iGreen vs.{" "}
              <span className="seguros-text-gradient">Seguro Tradicional</span>
            </>
          }
          description="Veja por que o seguro auto mensal iGreen está revolucionando o mercado — especialmente para quem sempre foi barrado."
          className="mb-10 sm:mb-14"
        />

        <MotionBlock>
          {/* Mobile: cards por característica */}
          <div className="space-y-3 md:hidden">
            {SEGUROS_COMPARISON.map((row) => (
              <article
                key={row.characteristic}
                className="seguros-glass overflow-hidden rounded-2xl"
              >
                <div className="border-b border-seguros-primary/10 bg-seguros-secondary/30 px-4 py-3">
                  <p className="text-sm font-semibold text-seguros-text">{row.characteristic}</p>
                </div>
                <div className="divide-y divide-seguros-primary/8">
                  <div className="flex items-center gap-3 bg-seguros-primary/5 px-4 py-3">
                    <ComparisonIcon variant="igreen" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-seguros-primary">
                        Seguro iGreen
                      </p>
                      <p className="text-sm font-medium text-seguros-text">{row.igreen}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <ComparisonIcon variant="traditional" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-seguros-muted">
                        Seguro Tradicional
                      </p>
                      <p className="text-sm text-seguros-muted">{row.traditional}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Tablet / Desktop: três colunas */}
          <div className="hidden grid-cols-1 gap-4 md:grid md:grid-cols-3 md:gap-5 lg:gap-6">
            <ComparisonColumn title="Característica" variant="neutral" items={characteristics} />
            <ComparisonColumn title="Seguro iGreen" variant="igreen" items={igreenItems} />
            <ComparisonColumn
              title="Seguro Tradicional"
              variant="traditional"
              items={traditionalItems}
            />
          </div>

          {onQuoteClick && (
            <div className="mt-10 hidden justify-center md:flex">
              <button
                type="button"
                onClick={() => {
                  trackSegurosQuoteClick("why_choose");
                  onQuoteClick?.();
                }}
                className="seguros-btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-extrabold"
              >
                Receber cotação grátis
                <ArrowRight className="h-5 w-5 shrink-0" />
              </button>
            </div>
          )}
        </MotionBlock>
      </div>
    </section>
  );
}
