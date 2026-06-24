"use client";

import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: `${(i * 17 + 7) % 100}%`,
  y: `${(i * 23 + 11) % 100}%`,
  size: 2 + (i % 3),
  delay: (i % 7) * 0.4,
  duration: 4 + (i % 5),
}));

export function HeroParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/3 -translate-y-1/2 rounded-full bg-[#00e676]/[0.08] blur-[120px]" />
      <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-[#00e676]/[0.05] blur-[100px]" />

      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#00e676]"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            opacity: 0.15 + (p.id % 4) * 0.1,
          }}
          animate={{
            y: [0, -18 - (p.id % 3) * 8, 0],
            x: [0, (p.id % 2 === 0 ? 8 : -8), 0],
            opacity: [0.2, 0.55, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
