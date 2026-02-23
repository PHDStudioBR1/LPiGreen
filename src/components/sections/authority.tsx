"use client"

import React from 'react';

const LOGOS = [
  { name: 'CNN', text: 'CNN' },
  { name: 'G1', text: 'G1' },
  { name: 'Folha', text: 'Folha de S.Paulo' },
  { name: 'Globo', text: 'Globo' },
  { name: 'Forbes', text: 'Forbes' },
];

export function AuthoritySection() {
  return (
    <section className="py-12 bg-white/50 border-y border-border">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm font-bold text-muted-foreground mb-8 uppercase tracking-widest">
          A imprensa já alertou sobre os aumentos na tarifa:
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {LOGOS.map((logo) => (
            <div key={logo.name} className="text-2xl md:text-3xl font-black text-gray-500 tracking-tighter hover:text-primary transition-colors cursor-default">
              {logo.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
