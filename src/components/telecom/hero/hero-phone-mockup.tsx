"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const HERO_PHONE_IMAGE = "/images/telecom/igreen-telecom-phone-hero-BEbXgO0X.webp";

export function HeroPhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
      <motion.div
        className="relative z-10 mx-auto w-[72%] sm:w-[78%] lg:w-[88%]"
        initial={{ opacity: 0, y: 48 }}
        animate={{
          opacity: 1,
          y: [0, -14, 0],
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.3, ease },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
        }}
      >
        <Image
          src={HERO_PHONE_IMAGE}
          alt="App iGreen Telecom no celular"
          width={1024}
          height={1536}
          priority
          sizes="(max-width: 1024px) 72vw, 420px"
          className="h-auto w-full drop-shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
        />

        <motion.div
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[3rem] bg-[#00e676]/10 blur-2xl"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
