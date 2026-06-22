"use client";

import { Award, Headphones, MapPin, Shield } from "lucide-react";
import { MotionBlock } from "@/components/seguros/ui/motion";

const ITEMS = [
  {
    icon: Shield,
    label: "SUSEP",
    description: "Código 01546 — BP Seguradora S.A.",
  },
  {
    icon: Award,
    label: "Reclame Aqui",
    highlight: "RA1000 - NOTA 8.5/10",
    description: "Reputação máxima no Reclame Aqui",
  },
  {
    icon: MapPin,
    label: "Atendimento Nacional",
    highlight: "ATIVAÇÃO EM ATÉ 24H",
    description: "Do preenchimento à apólice ativa",
  },
  {
    icon: Headphones,
    label: "Proteção 24h",
    highlight: "SEM CONSULTA SPC/SERASA",
    description: "Zero análise de perfil do condutor",
  },
] as const satisfies ReadonlyArray<{
  icon: typeof Shield;
  label: string;
  highlight?: string;
  description: string;
}>;

export function TrustBar() {
  return (
    <section className="border-y border-seguros-primary/10 bg-seguros-dark/80">
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
        <MotionBlock>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {ITEMS.map(({ icon: Icon, label, highlight, description }) => (
              <div
                key={label}
                className="flex items-start gap-2.5 rounded-2xl px-3 py-3 seguros-glass sm:gap-3 sm:px-4 sm:py-3.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-seguros-primary/15 sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 text-seguros-primary sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold leading-tight text-seguros-text sm:text-sm">
                    {label}
                  </p>
                  {highlight ? (
                    <p className="text-[10px] font-bold uppercase leading-snug tracking-wide text-seguros-accent sm:text-xs">
                      {highlight}
                    </p>
                  ) : null}
                  <p
                    className={
                      highlight
                        ? "text-[10px] leading-snug text-seguros-muted sm:text-xs"
                        : "text-[10px] font-semibold leading-snug text-seguros-accent sm:text-xs"
                    }
                  >
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MotionBlock>
      </div>
    </section>
  );
}
