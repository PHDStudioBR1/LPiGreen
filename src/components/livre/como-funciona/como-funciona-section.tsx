"use client";

import {
  Building2,
  FileSignature,
  FileText,
  Leaf,
  Presentation,
  Receipt,
  SearchCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  LivreBadge,
  LivreCardDescription,
  LivreCardTitle,
  LivreCta,
  LivreIconBox,
  LivreSection,
  LivreSectionHeader,
  MotionItem,
  MotionStagger,
} from "@/components/livre/ui";
import { LIVRE_CTA_LABEL } from "@/lib/livre/constants";
import { scrollToLivreCta } from "@/lib/livre/scroll";
import { cn } from "@/lib/utils";

type JornadaStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  highlight?: boolean;
};

const JORNADA_STEPS: JornadaStep[] = [
  {
    id: "envio-fatura",
    title: "Envio da fatura",
    description:
      "Envie sua fatura de energia para iniciarmos a análise do seu perfil de consumo.",
    icon: FileText,
  },
  {
    id: "estudo-viabilidade",
    title: "Estudo de viabilidade",
    description:
      "Analisamos demanda, tarifas e elegibilidade para identificar a melhor oportunidade de economia.",
    icon: SearchCheck,
  },
  {
    id: "reuniao-apresentacao",
    title: "Reunião de apresentação",
    description:
      "Apresentamos a proposta personalizada e esclarecemos todas as dúvidas da sua equipe.",
    icon: Presentation,
  },
  {
    id: "assinatura",
    title: "Assinatura",
    description:
      "Formalizamos o contrato de forma digital, com total transparência e segurança jurídica.",
    icon: FileSignature,
  },
  {
    id: "processo-regulatorio",
    title: "Processo regulatório",
    description:
      "Acompanhamos todo o trâmite junto à distribuidora e aos órgãos reguladores.",
    icon: Building2,
    badge: "~ 6 meses",
  },
  {
    id: "inicio-economia",
    title: "Início da economia",
    description:
      "Sua empresa passa a consumir energia limpa com desconto garantido no valor da fatura.",
    icon: Sparkles,
    highlight: true,
  },
];

type BoletoInfo = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const BOLETOS: BoletoInfo[] = [
  {
    id: "distribuidora",
    title: "Distribuidora",
    description: "Cobrança referente ao uso da rede de distribuição de energia elétrica.",
    icon: Zap,
  },
  {
    id: "igreen",
    title: "iGreen",
    description: "Cobrança referente à energia consumida pela sua empresa.",
    icon: Leaf,
  },
];

export function ComoFuncionaSection() {
  return (
    <LivreSection
      id="como-funciona"
      aria-labelledby="como-funciona-heading"
      animate={false}
      className="relative overflow-hidden bg-livre-bg-default"
    >
      <div
        className="pointer-events-none absolute inset-0 livre-hero-mesh opacity-25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-primary/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 top-1/4 size-[28rem] rounded-full bg-livre-primary/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-1/3 size-80 rounded-full bg-livre-accent/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <LivreSectionHeader
          id="como-funciona-heading"
          eyebrow="Como funciona"
          title="Sua jornada até a economia"
          description="Do envio da fatura ao início da economia — acompanhamos cada etapa com você."
        />

        <JornadaTimeline />

        <MotionItem className="mt-14 lg:mt-20">
          <BoletosDuplosCallout />
        </MotionItem>

        <MotionItem className="mt-14 lg:mt-16">
          <LivreCta
            title="Pronto para começar sua jornada?"
            description="Envie sua fatura e receba uma simulação personalizada — o primeiro passo é gratuito e sem compromisso."
            ctaLabel={LIVRE_CTA_LABEL}
            onCtaClick={scrollToLivreCta}
            microcopy="Simulação 100% gratuita · Resposta em até 24h"
            variant="outline"
          />
        </MotionItem>
      </div>
    </LivreSection>
  );
}

function JornadaTimeline() {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div
        className="pointer-events-none absolute bottom-8 left-[1.375rem] top-8 w-px bg-gradient-to-b from-livre-primary/50 via-livre-primary/30 to-livre-accent/40 sm:left-7"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-8 left-[1.375rem] top-8 w-px bg-livre-primary/20 blur-sm sm:left-7"
        aria-hidden
      />

      <MotionStagger className="flex flex-col gap-5 sm:gap-6">
        {JORNADA_STEPS.map((step, index) => (
          <MotionItem key={step.id}>
            <TimelineStepCard step={step} index={index} />
          </MotionItem>
        ))}
      </MotionStagger>
    </div>
  );
}

function TimelineStepCard({
  step,
  index,
}: {
  step: JornadaStep;
  index: number;
}) {
  const { icon, title, description, badge, highlight } = step;

  return (
    <article
      className={cn(
        "group relative flex gap-4 sm:gap-6",
        highlight && "scroll-mt-24"
      )}
    >
      <div className="relative z-10 flex shrink-0 flex-col items-center">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-full border-2 sm:size-14",
            "font-lv-headline text-sm font-bold sm:text-base",
            "transition-all duration-500",
            highlight
              ? "border-livre-primary bg-gradient-to-br from-livre-primary to-livre-primary-hover text-livre-petrol-900 shadow-lv-glow"
              : "border-livre-primary/40 bg-livre-bg-elevated text-livre-primary group-hover:border-livre-primary group-hover:shadow-lv-glow"
          )}
        >
          {index + 1}
        </div>
        {index < JORNADA_STEPS.length - 1 && (
          <div
            className="mt-2 hidden h-full min-h-4 w-px bg-livre-primary/20 sm:block"
            aria-hidden
          />
        )}
      </div>

      <div
        className={cn(
          "relative min-w-0 flex-1 overflow-hidden rounded-lv-xl",
          "border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "p-5 sm:p-6 lg:p-7",
          highlight
            ? "border-livre-primary/40 bg-gradient-to-br from-livre-primary/12 via-livre-bg-surface/90 to-livre-bg-elevated shadow-lv-glow"
            : "border-livre-petrol-500/70 bg-gradient-to-b from-livre-bg-surface/95 to-livre-bg-elevated shadow-lv-md group-hover:-translate-y-0.5 group-hover:border-livre-primary/35 group-hover:shadow-lv-glow motion-reduce:group-hover:translate-y-0"
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
          aria-hidden
        />
        {highlight && (
          <div
            className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-livre-primary/10 blur-2xl"
            aria-hidden
          />
        )}

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <LivreIconBox
            icon={icon}
            variant={highlight ? "filled" : "surface"}
            size="md"
            className={cn(
              "shrink-0 transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100",
              highlight && "shadow-lv-sm"
            )}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-2.5">
              <LivreCardTitle className="text-lg sm:text-xl">
                {title}
              </LivreCardTitle>
              {badge && (
                <LivreBadge variant="accent" size="sm">
                  {badge}
                </LivreBadge>
              )}
            </div>
            <LivreCardDescription className="text-sm sm:text-base text-pretty">
              {description}
            </LivreCardDescription>
          </div>
        </div>
      </div>
    </article>
  );
}

function BoletosDuplosCallout() {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lv-2xl",
        "border border-livre-petrol-500/70",
        "bg-gradient-to-br from-livre-bg-surface/90 via-livre-bg-elevated to-livre-bg-base",
        "p-6 shadow-lv-lg sm:p-8 lg:p-10"
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-accent/30 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-1/2 size-64 -translate-x-1/2 rounded-full bg-livre-primary/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="relative mb-8 text-center sm:mb-10">
        <div className="mb-3 inline-flex items-center justify-center rounded-full border border-livre-primary/25 bg-livre-primary/10 p-2.5">
          <Receipt className="size-5 text-livre-primary" aria-hidden />
        </div>
        <h3 className="font-lv-headline text-xl font-bold text-livre-text sm:text-2xl text-balance">
          O cliente recebe dois boletos
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-livre-muted sm:text-base text-pretty">
          Após a migração, a cobrança é dividida de forma transparente entre
          distribuidora e fornecedor de energia.
        </p>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2 sm:gap-5">
        {BOLETOS.map((boleto, index) => (
          <BoletoCard key={boleto.id} boleto={boleto} index={index} />
        ))}
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-[calc(50%+1.5rem)] hidden h-px w-8 -translate-x-1/2 bg-gradient-to-r from-livre-primary/40 to-livre-accent/40 sm:block"
        aria-hidden
      />
    </div>
  );
}

function BoletoCard({ boleto, index }: { boleto: BoletoInfo; index: number }) {
  const { icon, title, description } = boleto;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-lv-xl",
        "border border-livre-petrol-500/60",
        "bg-gradient-to-b from-livre-bg-surface/80 to-livre-bg-elevated/90",
        "p-5 shadow-lv-sm sm:p-6",
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-livre-primary/35 hover:shadow-lv-glow",
        "motion-reduce:hover:translate-y-0"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-lv-xl bg-gradient-to-br from-livre-primary/[0.05] via-transparent to-livre-accent/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative flex items-start gap-4">
        <div className="flex flex-col items-center gap-2">
          <LivreIconBox
            icon={icon}
            variant={index === 0 ? "surface" : "filled"}
            size="md"
            className="transition-transform duration-500 group-hover:scale-110 motion-reduce:group-hover:scale-100"
          />
          <span
            className="font-lv-headline text-[10px] font-semibold uppercase tracking-widest text-livre-muted/70"
            aria-hidden
          >
            Boleto {index + 1}
          </span>
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="mb-1 flex items-center gap-2">
            <LivreCardTitle className="text-base sm:text-lg">{title}</LivreCardTitle>
            <span className="text-livre-primary" aria-hidden>
              →
            </span>
          </div>
          <LivreCardDescription className="text-sm text-pretty">
            {description}
          </LivreCardDescription>
        </div>
      </div>
    </article>
  );
}
