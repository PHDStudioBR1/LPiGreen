"use client";

import { SEGUROS_BENEFITS } from "@/lib/seguros/data";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { PremiumCard } from "@/components/seguro-auto/ui/premium-card";
import { MotionBlock, MotionStagger, MotionItem } from "@/components/seguro-auto/ui/motion";

export function BenefitsSection() {
  return (
    <section id="vantagens" className="bg-sa-surface/60 py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Vantagens"
            title="Vantagens e serviços exclusivos"
            description="Tudo o que você precisa para rodar com tranquilidade, em um único seguro digital."
          />
        </MotionBlock>

        <MotionStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SEGUROS_BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <MotionItem key={benefit.id}>
                <PremiumCard padding="md" className="h-full">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sa-primary/10">
                    <Icon className="h-6 w-6 text-sa-primary" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-sa-headline text-lg font-bold text-sa-text">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-sa-muted">
                    {benefit.description}
                  </p>
                </PremiumCard>
              </MotionItem>
            );
          })}
        </MotionStagger>
      </Container>
    </section>
  );
}
