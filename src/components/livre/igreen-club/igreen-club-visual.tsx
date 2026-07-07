"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Film,
  Gift,
  Home,
  Percent,
  Pill,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

type IgreenClubVisualProps = {
  className?: string;
};

const OFFER_CATEGORIES = [
  { icon: Pill, label: "Farmácias", discount: "até 70%" },
  { icon: Film, label: "Cinemas", discount: "2 por 1" },
  { icon: ShoppingBag, label: "Varejo", discount: "até 50%" },
  { icon: Home, label: "Energia", discount: "residencial" },
] as const;

export function IgreenClubVisual({ className }: IgreenClubVisualProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-livre-accent/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 top-1/4 size-40 rounded-full bg-livre-primary/[0.08] blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col items-center gap-6 lg:items-end">
        <FloatingBadge
          icon={Gift}
          label="600 mil+ ofertas"
          className="-left-2 top-8 lg:-left-12 lg:top-16"
          delay={0.3}
          animate={!prefersReducedMotion}
        />
        <FloatingBadge
          icon={Percent}
          label="Sem custo extra"
          className="-right-2 top-1/3 lg:-right-10"
          delay={0.5}
          variant="accent"
          animate={!prefersReducedMotion}
        />

        <ClubPhoneMockup animate={!prefersReducedMotion} />

        <OffersGridMockup animate={!prefersReducedMotion} />
      </div>
    </div>
  );
}

function FloatingBadge({
  icon: Icon,
  label,
  className,
  delay = 0,
  variant = "default",
  animate,
}: {
  icon: typeof Gift;
  label: string;
  className?: string;
  delay?: number;
  variant?: "default" | "accent";
  animate: boolean;
}) {
  const content = (
    <div
      className={cn(
        "absolute z-20 flex items-center gap-2 rounded-full border px-3 py-2 shadow-lv-md backdrop-blur-md",
        variant === "default"
          ? "border-livre-primary/25 bg-livre-primary/10"
          : "border-livre-accent/25 bg-livre-accent/10"
      )}
    >
      <Icon
        className={cn(
          "size-3.5 shrink-0",
          variant === "default" ? "text-livre-primary" : "text-livre-accent"
        )}
        aria-hidden
      />
      <span className="text-xs font-semibold text-livre-text/90">{label}</span>
    </div>
  );

  if (!animate) return <div className={className}>{content}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9, y: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{ y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.5, ease, delay },
        scale: { duration: 0.5, ease, delay },
        y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
      }}
    >
      {content}
    </motion.div>
  );
}

function ClubPhoneMockup({ animate }: { animate: boolean }) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.7, ease },
      }
    : {};

  return (
    <Wrapper
      className="relative z-10 mx-auto w-full max-w-[300px] sm:max-w-[320px]"
      {...wrapperProps}
    >
      <div
        className="relative overflow-hidden rounded-[2.25rem] border border-white/12 bg-livre-petrol-800/80 p-2 shadow-lv-lg"
        role="img"
        aria-label="Mockup do aplicativo iGreen Club com ofertas e descontos em energia residencial"
      >
        <div className="absolute left-1/2 top-2 z-20 h-4 w-20 -translate-x-1/2 rounded-full bg-black/60" />

        <div className="overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-livre-petrol-700/90 to-livre-petrol-800">
          <div className="flex items-center justify-between px-4 pb-2 pt-7">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-wider text-livre-accent/70">
                iGreen Club
              </p>
              <p className="font-lv-headline text-sm font-bold text-livre-text">
                Olá, colaborador
              </p>
            </div>
            <div className="flex size-7 items-center justify-center rounded-full bg-livre-primary/15">
              <Sparkles className="size-3.5 text-livre-primary" aria-hidden />
            </div>
          </div>

          <div className="mx-3.5 mb-3 rounded-xl border border-livre-primary/20 bg-livre-primary/[0.08] p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-medium uppercase tracking-wider text-livre-primary/80">
                Ofertas disponíveis
              </span>
              <Gift className="size-3 text-livre-primary" aria-hidden />
            </div>
            <p className="font-lv-headline text-2xl font-extrabold tracking-tight text-livre-primary">
              600<span className="text-lg"> mil+</span>
            </p>
            <p className="mt-0.5 text-[10px] text-livre-muted">Descontos exclusivos para você</p>
          </div>

          <div className="mx-3.5 mb-3 flex items-center gap-2.5 rounded-xl border border-livre-accent/15 bg-livre-accent/[0.06] p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lv-md bg-livre-accent/10">
              <Zap className="size-4 text-livre-accent" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-livre-text/90">
                Energia residencial
              </p>
              <p className="text-[9px] text-livre-muted">Desconto na conta de luz em casa</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-livre-accent/15 px-2 py-0.5 text-[9px] font-bold text-livre-accent">
              -30%
            </span>
          </div>

          <div className="mx-3.5 mb-4 grid grid-cols-2 gap-2">
            {OFFER_CATEGORIES.slice(0, 2).map(({ icon: Icon, label, discount }) => (
              <div
                key={label}
                className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5"
              >
                <Icon className="mb-1 size-3.5 text-livre-primary/70" aria-hidden />
                <p className="text-[10px] font-medium text-livre-text/80">{label}</p>
                <p className="text-[9px] text-livre-accent">{discount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {animate && (
        <motion.div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-livre-primary/[0.08] blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      )}
    </Wrapper>
  );
}

function OffersGridMockup({ animate }: { animate: boolean }) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.6, ease, delay: 0.15 },
      }
    : {};

  return (
    <Wrapper
      className="relative z-10 w-full max-w-[300px] sm:max-w-[320px]"
      {...wrapperProps}
    >
      <div className="overflow-hidden rounded-lv-xl border border-white/10 bg-white/[0.04] p-4 shadow-lv-sm backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2">
          <ShoppingBag className="size-3.5 text-livre-accent" aria-hidden />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-livre-accent/80">
            Categorias em destaque
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {OFFER_CATEGORIES.map(({ icon: Icon, label, discount }) => (
            <div
              key={label}
              className="group flex flex-col gap-1.5 rounded-lv-lg border border-livre-primary/10 bg-livre-primary/[0.04] p-3 transition-colors hover:border-livre-primary/25 hover:bg-livre-primary/[0.07]"
            >
              <div className="flex size-7 items-center justify-center rounded-lv-md bg-livre-primary/10">
                <Icon className="size-3.5 text-livre-primary" aria-hidden />
              </div>
              <p className="text-[11px] font-medium text-livre-text/85">{label}</p>
              <p className="text-[10px] text-livre-accent">{discount}</p>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
