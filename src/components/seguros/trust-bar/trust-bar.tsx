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
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <MotionBlock>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {ITEMS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl seguros-glass"
              >
                <div className="w-10 h-10 rounded-xl bg-seguros-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-seguros-primary" />
                </div>
                <span className="font-semibold text-seguros-text text-sm sm:text-base">{label}</span>
              </div>
            ))}
          </div>
        </MotionBlock>
      </div>
    </section>
  );
}
