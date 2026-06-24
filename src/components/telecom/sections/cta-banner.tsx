"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { trackTelecomQuoteClick } from "@/lib/telecom/analytics";
import { TELECOM_CLIENT_COUNT } from "@/lib/telecom/constants";
import { Container } from "@/components/telecom/ui/container";
import { Button } from "@/components/telecom/ui/button";
import { MotionBlock } from "@/components/telecom/ui/motion";

type CtaBannerProps = {
  onQuoteClick?: () => void;
};

function AnimatedCount({ target }: { target: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString("pt-BR"));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(target);
  }, [spring, target]);

  useEffect(() => {
    const unsub = display.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return unsub;
  }, [display]);

  return <span ref={ref}>0</span>;
}

export function CtaBanner({ onQuoteClick }: CtaBannerProps) {
  return (
    <section id="cta-final" className="relative py-20 md:py-28">
      <Container>
        <MotionBlock>
          <div className="telecom-gradient-cta relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-12 md:py-20">
            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
            >
              Junte-se a milhares de clientes
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative mt-4 font-tc-headline text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight text-white"
            >
              Mais de <AnimatedCount target={TELECOM_CLIENT_COUNT} /> clientes conectados
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg"
            >
              Contrate agora e receba eSIM instantâneo, cashback no primeiro mês e acesso ao clube
              de benefícios.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative mt-10 flex flex-wrap justify-center gap-4"
            >
              <Button
                variant="secondary"
                className="h-12 border-white/20 bg-white px-8 text-telecom-primary hover:bg-white/90"
                onClick={() => {
                  trackTelecomQuoteClick("cta_final");
                  onQuoteClick?.();
                }}
              >
                Contratar agora — é grátis
              </Button>
            </motion.div>
          </div>
        </MotionBlock>
      </Container>
    </section>
  );
}
