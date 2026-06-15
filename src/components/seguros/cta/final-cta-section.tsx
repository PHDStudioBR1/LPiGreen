"use client";

import { MessageCircle, Users } from "lucide-react";
import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { SEGUROS_CLIENT_COUNT, SEGUROS_WHATSAPP_URL } from "@/lib/seguros/constants";
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
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 seguros-gradient-hero opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,83,0.15),transparent)]" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <MotionBlock className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-seguros-headline text-4xl sm:text-5xl md:text-6xl font-extrabold text-seguros-text leading-tight">
            Proteja seu veículo hoje mesmo.
          </h2>
          <p className="text-lg sm:text-xl text-seguros-muted">
            Faça sua cotação gratuita em menos de 2 minutos.
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full seguros-glass text-seguros-accent">
            <Users className="w-5 h-5 text-seguros-primary" />
            <span className="font-semibold text-seguros-text">
              <AnimatedCounter target={SEGUROS_CLIENT_COUNT} /> clientes já protegidos
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href={SEGUROS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="seguros-btn-outline h-14 px-8 rounded-2xl text-lg font-bold inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={onQuoteClick}
              className="seguros-btn-primary h-14 px-8 rounded-2xl text-lg font-extrabold"
            >
              Fazer Cotação Gratuita
            </button>
          </div>
        </MotionBlock>
      </div>
    </section>
  );
}
