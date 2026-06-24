"use client";

import { TELECOM_STEPS } from "@/lib/telecom/data";
import { Container } from "@/components/telecom/ui/container";
import { SectionHeading } from "@/components/telecom/ui/section-heading";
import { MotionBlock, MotionItem, MotionStagger } from "@/components/telecom/ui/motion";

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="relative py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Como funciona"
            title="Conecte-se em 4 passos simples"
            description="Do cadastro à ativação, tudo 100% digital e sem burocracia."
          />
        </MotionBlock>

        <MotionStagger className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-[#00e676]/20 via-[#00e676]/40 to-[#00e676]/20 lg:block"
            aria-hidden
          />
          {TELECOM_STEPS.map((step) => (
            <MotionItem key={step.id} className="relative text-center">
              <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00e676] font-tc-headline text-xl font-bold text-[#060806] shadow-[0_4px_16px_rgba(0,230,118,0.3)]">
                {step.step}
              </div>
              <h3 className="font-tc-headline text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{step.description}</p>
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}
