"use client";

import { BadgePercent, Zap } from "lucide-react";
import {
  LivreBadge,
  LivreCardTitle,
  LivreSection,
  LivreSectionHeader,
  MotionItem,
  MotionStagger,
} from "@/components/livre/ui";
import { cn } from "@/lib/utils";
import {
  SegmentoIllustration,
  type SegmentoId,
} from "./segmento-illustration";

type Segmento = {
  id: SegmentoId;
  title: string;
};

const SEGMENTOS: Segmento[] = [
  { id: "industrias", title: "Indústrias" },
  { id: "supermercados", title: "Supermercados" },
  { id: "hoteis", title: "Hotéis" },
  { id: "hospitais", title: "Hospitais" },
  { id: "condominios", title: "Condomínios" },
  { id: "academias", title: "Academias" },
  { id: "transformador", title: "Empresas com transformador próprio" },
];

const CONTENT = {
  description:
    "Empresas atendidas em média e alta tensão — Grupo A de consumo.",
  incentivo:
    "Empresas com demanda inferior a 1.500 kW possuem direito legal a desconto de 50% na tarifa de demanda ao contratar energia incentivada.",
} as const;

export function QuemPodeAderirSection() {
  return (
    <LivreSection
      id="quem-pode-aderir"
      aria-labelledby="quem-pode-aderir-heading"
      animate={false}
      className="relative overflow-hidden bg-livre-bg-base"
    >
      <div
        className="pointer-events-none absolute inset-0 livre-hero-mesh opacity-35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 livre-hero-grid opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-primary/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 top-1/3 size-96 rounded-full bg-livre-accent/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-1/4 size-80 rounded-full bg-livre-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <LivreSectionHeader
          id="quem-pode-aderir-heading"
          eyebrow="Público"
          title="Quem pode aderir"
          description={CONTENT.description}
          badge={
            <LivreBadge variant="accent" size="sm" icon={<Zap className="size-3" aria-hidden />}>
              Grupo A
            </LivreBadge>
          }
        />

        <MotionStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
          {SEGMENTOS.map((segmento, index) => (
            <MotionItem
              key={segmento.id}
              className={cn(
                index === SEGMENTOS.length - 1 &&
                  "sm:col-span-2 lg:col-span-1 xl:col-span-1"
              )}
            >
              <SegmentoCard segmento={segmento} />
            </MotionItem>
          ))}
        </MotionStagger>

        <MotionItem className="mt-10 lg:mt-14">
          <IncentivoI5Banner />
        </MotionItem>
      </div>
    </LivreSection>
  );
}

function SegmentoCard({ segmento }: { segmento: Segmento }) {
  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-lv-xl",
        "border border-livre-petrol-500/70",
        "bg-gradient-to-b from-livre-bg-surface/90 to-livre-bg-elevated",
        "shadow-lv-sm",
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-livre-primary/35 hover:shadow-lv-glow",
        "motion-reduce:hover:translate-y-0"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-lv-xl bg-gradient-to-br from-livre-primary/[0.06] via-transparent to-livre-accent/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
        aria-hidden
      />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <SegmentoIllustration id={segmento.id} className="mb-4" />
        <LivreCardTitle className="text-base sm:text-lg text-balance">
          {segmento.title}
        </LivreCardTitle>
      </div>
    </article>
  );
}

function IncentivoI5Banner() {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lv-2xl",
        "border border-livre-primary/30",
        "bg-gradient-to-br from-livre-primary/10 via-livre-bg-surface/80 to-livre-bg-elevated",
        "p-6 shadow-lv-glow sm:p-8 lg:p-10"
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-livre-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 size-36 rounded-full bg-livre-accent/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-primary/40 to-transparent"
        aria-hidden
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex shrink-0 items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-lv-xl border border-livre-primary/30 bg-livre-primary/15 shadow-lv-sm sm:size-[4.5rem]">
            <BadgePercent className="size-7 text-livre-primary sm:size-8" aria-hidden />
          </div>
          <div className="flex flex-col gap-1 sm:hidden">
            <LivreBadge variant="popular" size="sm">
              Incentivo i5
            </LivreBadge>
            <span className="font-lv-headline text-3xl font-extrabold text-livre-primary">
              50%
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 hidden items-center gap-3 sm:flex">
            <LivreBadge variant="popular" size="sm">
              Incentivo i5
            </LivreBadge>
            <span className="font-lv-headline text-3xl font-extrabold tracking-tight text-livre-primary lg:text-4xl">
              50%
            </span>
            <span className="text-sm font-medium text-livre-muted">
              de desconto na tarifa de demanda
            </span>
          </div>
          <p className="text-sm leading-relaxed text-livre-text/90 sm:text-base text-pretty">
            {CONTENT.incentivo}
          </p>
          <p className="mt-2 text-xs text-livre-muted sm:hidden">
            Desconto na tarifa de demanda
          </p>
        </div>
      </div>
    </div>
  );
}
