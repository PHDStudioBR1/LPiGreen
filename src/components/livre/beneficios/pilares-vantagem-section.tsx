"use client";

import {
  BadgePercent,
  CalendarClock,
  Leaf,
  ShieldOff,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  LivreCardDescription,
  LivreCardTitle,
  LivreIconBox,
  LivreSection,
  LivreSectionHeader,
  MotionItem,
  MotionStagger,
} from "@/components/livre/ui";
import { cn } from "@/lib/utils";

type Pilar = {
  icon: LucideIcon;
  title: string;
  lines: string[];
};

const PILARES: Pilar[] = [
  {
    icon: BadgePercent,
    title: "Economia Garantida",
    lines: ["Desconto de até 30% sobre o valor líquido da fatura."],
  },
  {
    icon: Wallet,
    title: "Investimento Zero",
    lines: [
      "Sem obras.",
      "Sem instalação.",
      "Sem placas solares.",
      "Sem manutenção.",
    ],
  },
  {
    icon: CalendarClock,
    title: "Previsibilidade",
    lines: [
      "Contratos de 5 a 10 anos.",
      "Proteção contra inflação energética.",
    ],
  },
  {
    icon: ShieldOff,
    title: "Livre das Bandeiras Tarifárias",
    lines: ["Preço contratado.", "Sem cobrança de bandeiras."],
  },
  {
    icon: Leaf,
    title: "ESG",
    lines: ["Energia 100% limpa e renovável.", "Fortalece a marca."],
  },
];

export function PilaresVantagemSection() {
  return (
    <LivreSection
      id="beneficios"
      aria-labelledby="pilares-vantagem-heading"
      animate={false}
      className="relative overflow-hidden bg-livre-bg-default"
    >
      <div
        className="pointer-events-none absolute inset-0 livre-hero-mesh opacity-30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-primary/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-livre-primary/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-1/4 size-80 rounded-full bg-livre-accent/5 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <LivreSectionHeader
          id="pilares-vantagem-heading"
          eyebrow="Benefícios"
          title="5 Pilares de Vantagem"
        />

        <MotionStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {PILARES.map((pilar, index) => (
            <MotionItem
              key={pilar.title}
              className={cn(
                index < 3 ? "lg:col-span-2" : "sm:col-span-1 lg:col-span-3"
              )}
            >
              <PilarVantagemCard pilar={pilar} index={index} />
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </LivreSection>
  );
}

function PilarVantagemCard({ pilar, index }: { pilar: Pilar; index: number }) {
  const { icon, title, lines } = pilar;

  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-lv-xl",
        "border border-livre-petrol-500/70",
        "bg-gradient-to-b from-livre-bg-surface/95 to-livre-bg-elevated",
        "p-6 sm:p-8",
        "shadow-lv-md",
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1.5 hover:border-livre-primary/40 hover:shadow-lv-glow-lg",
        "motion-reduce:hover:translate-y-0",
        "[transform-style:preserve-3d] [perspective:1000px]"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-lv-xl bg-gradient-to-br from-livre-primary/[0.07] via-transparent to-livre-accent/[0.06] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 left-1/2 h-20 w-4/5 -translate-x-1/2 rounded-full bg-livre-primary/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-livre-accent/5 blur-2xl transition-all duration-500 group-hover:bg-livre-primary/10"
        aria-hidden
      />

      <div className="relative flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-4">
          <LivreIconBox
            icon={icon}
            variant="filled"
            size="lg"
            className="shadow-lv-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-lv-glow motion-reduce:group-hover:scale-100"
          />
          <span
            className="font-lv-headline text-2xl font-bold leading-none text-livre-text/10 transition-colors duration-500 group-hover:text-livre-primary/25"
            aria-hidden
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <LivreCardTitle className="mb-3 text-balance">{title}</LivreCardTitle>

        <div className="mt-auto space-y-1">
          {lines.map((line) => (
            <LivreCardDescription key={line} className="text-livre-muted/90">
              {line}
            </LivreCardDescription>
          ))}
        </div>
      </div>
    </article>
  );
}
