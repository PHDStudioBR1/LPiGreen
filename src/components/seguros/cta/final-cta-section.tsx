"use client";

import { MessageCircle, Users } from "lucide-react";
import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { SEGUROS_CLIENT_COUNT, SEGUROS_WHATSAPP_URL } from "@/lib/seguros/constants";
import { trackSegurosQuoteClick, trackSegurosWhatsAppClick } from "@/lib/seguros/analytics";
import { MotionBlock } from "@/components/seguros/ui/motion";

type FinalCtaSectionProps = {
  onQuoteClick: () => void;
};

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const spring = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    spring.set(target);
    const unsub = spring.on("change", (v) => setCount(Math.round(v)));
    return unsub;
  }, [spring, target]);

  return <motion.span>{count.toLocaleString("pt-BR")}</motion.span>;
}

export function FinalCtaSection({ onQuoteClick }: FinalCtaSectionProps) {
  return (
    <section className="seguros-section relative overflow-hidden pb-28 md:pb-32">
      <div className="absolute inset-0 seguros-gradient-hero opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,83,0.15),transparent)]" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <MotionBlock className="mx-auto max-w-3xl space-y-6 text-center sm:space-y-8">
          <h2 className="font-seguros-headline text-3xl font-extrabold leading-tight text-seguros-text sm:text-5xl md:text-6xl">
            Proteja seu veículo hoje mesmo.
          </h2>
          <p className="text-base text-seguros-muted sm:text-lg md:text-xl">
            Faça sua cotação gratuita em menos de 2 minutos.
          </p>

          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full px-4 py-2.5 seguros-glass text-seguros-accent sm:px-5 sm:py-3">
            <Users className="h-5 w-5 shrink-0 text-seguros-primary" />
            <span className="text-sm font-semibold text-seguros-text sm:text-base">
              <AnimatedCounter target={SEGUROS_CLIENT_COUNT} /> clientes já protegidos
            </span>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center sm:gap-4">
            <a
              href={SEGUROS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSegurosWhatsAppClick("final_cta")}
              className="seguros-btn-outline inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
            >
              <MessageCircle className="h-5 w-5 shrink-0" />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                trackSegurosQuoteClick("final_cta", "Fazer Cotação Gratuita");
                onQuoteClick();
              }}
              className="seguros-btn-primary h-12 w-full rounded-2xl px-6 text-base font-extrabold sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
            >
              Fazer Cotação Gratuita
            </button>
          </div>
        </MotionBlock>
      </div>
    </section>
  );
}
