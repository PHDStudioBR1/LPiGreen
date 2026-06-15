"use client";

import { Award, Headphones, MapPin, Shield } from "lucide-react";
import { MotionBlock } from "@/components/seguros/ui/motion";

const ITEMS = [
  { icon: Shield, label: "SUSEP" },
  { icon: Award, label: "Reclame Aqui" },
  { icon: MapPin, label: "Atendimento Nacional" },
  { icon: Headphones, label: "Proteção 24h" },
];

export function TrustBar() {
  return (
    <section className="border-y border-seguros-primary/10 bg-seguros-dark/80">
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
        <MotionBlock>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {ITEMS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2.5 rounded-2xl px-3 py-2.5 seguros-glass sm:gap-3 sm:px-4 sm:py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-seguros-primary/15 sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 text-seguros-primary sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs font-semibold leading-tight text-seguros-text sm:text-sm md:text-base">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </MotionBlock>
      </div>
    </section>
  );
}
