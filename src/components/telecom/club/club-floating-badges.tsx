"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TELECOM_CLUB_FLOATING_BADGES } from "@/lib/telecom/data";
import type { TelecomClubFloatingBadge } from "@/lib/telecom/data";

const POSITION_CLASSES: Record<TelecomClubFloatingBadge["position"], string> = {
  "top-left": "-left-2 top-8 sm:-left-6 sm:top-12 lg:-left-10",
  "top-right": "-right-2 top-16 sm:-right-6 sm:top-20 lg:-right-10",
  "bottom-left": "-left-1 bottom-12 sm:-left-4 sm:bottom-16 lg:-left-8",
  "bottom-right": "-right-1 bottom-8 sm:-right-4 sm:bottom-12 lg:-right-8",
};

const FLOAT_DELAYS = [0, 0.8, 1.6, 2.4];

type ClubFloatingBadgesProps = {
  children: ReactNode;
};

export function ClubFloatingBadges({ children }: ClubFloatingBadgesProps) {
  return (
    <div className="relative mx-auto w-full max-w-[400px] px-4 sm:max-w-[440px] sm:px-8 lg:max-w-none lg:px-12">
      {children}

      {TELECOM_CLUB_FLOATING_BADGES.map((badge, index) => (
        <motion.div
          key={badge.id}
          className={`pointer-events-none absolute z-20 max-w-[140px] sm:max-w-[180px] ${POSITION_CLASSES[badge.position]}`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            opacity: { duration: 0.5, delay: 0.3 + index * 0.1 },
            scale: { duration: 0.5, delay: 0.3 + index * 0.1 },
            y: {
              duration: 4 + index * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: FLOAT_DELAYS[index],
            },
          }}
        >
          <div className="rounded-2xl border border-white/[0.12] bg-[#0a0d0b]/80 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-4 sm:py-2.5">
            <p className="text-[10px] font-semibold leading-snug text-white sm:text-xs">
              {badge.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
