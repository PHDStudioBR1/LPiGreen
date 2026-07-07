"use client";

import { BadgeCheck, Gift, Home, Sparkles, type LucideIcon } from "lucide-react";
import {
  LivreBadge,
  LivreCardDescription,
  LivreCardTitle,
  LivreIconBox,
  LivreSection,
  LivreSectionHeader,
  MotionItem,
  MotionStagger,
} from "@/components/livre/ui";
import { cn } from "@/lib/utils";
import { IgreenClubVisual } from "./igreen-club-visual";

type Beneficio = {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: string;
};

const BENEFICIOS: Beneficio[] = [
  {
    icon: Gift,
    title: "Mais de 600 mil ofertas",
    description:
      "Descontos exclusivos em farmácias, cinemas, viagens, restaurantes e centenas de marcas parceiras.",
    highlight: "600 mil+",
  },
  {
    icon: Home,
    title: "Descontos em energia residencial",
    description:
      "Colaboradores também economizam na conta de luz em casa, ampliando o impacto do benefício.",
    highlight: "Energia",
  },
  {
    icon: BadgeCheck,
    title: "Sem custo adicional para a empresa",
    description:
      "Benefício incluso para todos os colaboradores ao contratar a Conexão Livre — zero impacto no orçamento.",
    highlight: "Grátis",
  },
];

const CONTENT = {
  description:
    "Ao contratar a Conexão Livre, os colaboradores recebem acesso ao iGreen Club — o maior clube de benefícios do Brasil.",
} as const;

export function IgreenClubSection() {
  return (
    <LivreSection
      id="igreen-club"
      aria-labelledby="igreen-club-heading"
      animate={false}
      className="relative overflow-hidden bg-gradient-to-b from-livre-bg-default via-livre-petrol-800/40 to-livre-bg-base"
    >
      <div
        className="pointer-events-none absolute inset-0 livre-hero-mesh opacity-25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-accent/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/3 size-[28rem] rounded-full bg-livre-accent/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 size-80 rounded-full bg-livre-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <LivreSectionHeader
          id="igreen-club-heading"
          eyebrow="Benefício adicional"
          title="iGreen Club"
          description={CONTENT.description}
          badge={
            <LivreBadge
              variant="accent"
              size="sm"
              icon={<Sparkles className="size-3" aria-hidden />}
            >
              Incluso
            </LivreBadge>
          }
        />

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <MotionItem className="order-2 lg:order-1">
            <MotionStagger className="flex flex-col gap-4">
              {BENEFICIOS.map((beneficio) => (
                <MotionItem key={beneficio.title}>
                  <BeneficioCard beneficio={beneficio} />
                </MotionItem>
              ))}
            </MotionStagger>
          </MotionItem>

          <MotionItem className="order-1 lg:order-2">
            <IgreenClubVisual />
          </MotionItem>
        </div>
      </div>
    </LivreSection>
  );
}

function BeneficioCard({ beneficio }: { beneficio: Beneficio }) {
  const { icon, title, description, highlight } = beneficio;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-lv-xl",
        "border border-livre-primary/15",
        "bg-gradient-to-br from-livre-primary/[0.06] via-livre-bg-surface/40 to-livre-bg-elevated/60",
        "p-5 sm:p-6",
        "shadow-lv-sm",
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-livre-primary/30 hover:shadow-lv-glow",
        "motion-reduce:hover:translate-y-0"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-lv-xl bg-gradient-to-br from-livre-accent/[0.04] via-transparent to-livre-primary/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-accent/20 to-transparent"
        aria-hidden
      />

      <div className="relative flex gap-4 sm:gap-5">
        <LivreIconBox
          icon={icon}
          variant="default"
          size="lg"
          className="border-livre-primary/15 bg-livre-primary/[0.08] transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <LivreCardTitle className="text-base sm:text-lg">{title}</LivreCardTitle>
            {highlight && (
              <span className="rounded-full border border-livre-accent/20 bg-livre-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-livre-accent">
                {highlight}
              </span>
            )}
          </div>
          <LivreCardDescription className="text-livre-text/75">
            {description}
          </LivreCardDescription>
        </div>
      </div>
    </article>
  );
}
