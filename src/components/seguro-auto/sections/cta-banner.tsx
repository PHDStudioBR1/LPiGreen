"use client";

import { trackSegurosQuoteClick } from "@/lib/seguro-auto/analytics";
import { Container } from "@/components/seguro-auto/ui/container";
import { Button } from "@/components/seguro-auto/ui/button";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

type CtaBannerProps = {
  onQuoteClick?: () => void;
};

export function CtaBanner({ onQuoteClick }: CtaBannerProps) {
  return (
    <section className="bg-sa-surface/60 py-20 md:py-28">
      <Container>
        <MotionBlock>
          <div className="rounded-[2rem] border border-sa-border/60 bg-white px-8 py-14 text-center shadow-[0_16px_56px_rgba(0,0,0,0.06)] sm:px-16 sm:py-20">
            <h2 className="font-sa-headline text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-sa-text">
              Pronto para proteger seu veículo?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-sa-muted sm:text-lg">
              Faça sua cotação gratuita em menos de 3 minutos. Sem compromisso, sem consulta ao
              SPC.
            </p>
            <div className="mt-10">
              <Button
                className="h-12 px-10 text-base"
                onClick={() => {
                  trackSegurosQuoteClick("final_cta");
                  onQuoteClick?.();
                }}
              >
                Cotação gratuita
              </Button>
            </div>
          </div>
        </MotionBlock>
      </Container>
    </section>
  );
}
