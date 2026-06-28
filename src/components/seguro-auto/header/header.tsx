"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackSegurosNavClick, trackSegurosQuoteClick } from "@/lib/seguro-auto/analytics";
import {
  SEGURO_AUTO_HEADER_OFFSET,
  SEGURO_AUTO_NAV_ITEMS,
  SEGURO_AUTO_UTILITY_LINKS,
} from "@/lib/seguro-auto/constants";
import { Container } from "@/components/seguro-auto/ui/container";
import { Button } from "@/components/seguro-auto/ui/button";

type HeaderProps = {
  onQuoteClick?: () => void;
};

export function Header({ onQuoteClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const scrollToSection = useCallback((href: string) => {
    if (!href.startsWith("#")) return;
    const sectionId = href.slice(1);
    trackSegurosNavClick(sectionId);
    const target = document.getElementById(sectionId);
    if (!target) return;
    const top =
      target.getBoundingClientRect().top + window.scrollY - SEGURO_AUTO_HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    setIsMenuOpen(false);
  }, []);

  const handleQuote = (location: "header" | "header_mobile" = "header") => {
    trackSegurosQuoteClick(location);
    onQuoteClick?.();
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300",
          isScrolled && "shadow-[0_1px_0_0_#e8eaed,0_4px_24px_rgba(0,0,0,0.04)]"
        )}
      >
        <div className="hidden border-b border-sa-border/80 bg-sa-surface/80 lg:block">
          <Container className="flex h-9 items-center justify-end gap-6">
            {SEGURO_AUTO_UTILITY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] font-medium text-sa-muted transition-colors hover:text-sa-primary"
              >
                {link.label}
              </a>
            ))}
          </Container>
        </div>

        <Container className="flex h-[68px] items-center justify-between gap-4 lg:h-[72px]">
          <button
            type="button"
            onClick={() => scrollToSection("#inicio")}
            className="shrink-0"
            aria-label="Voltar ao início"
          >
            <img
              src="/images/seguros/logo-seguros-B8WMVJ8W.svg"
              alt="Seguro iGreen"
              className="h-8 w-auto"
            />
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {SEGURO_AUTO_NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollToSection(item.href)}
                className="rounded-full px-4 py-2 text-sm font-medium text-sa-text transition-colors hover:bg-sa-surface hover:text-sa-primary"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => handleQuote("header")}
              className="hidden h-11 px-6 text-sm sm:inline-flex"
            >
              Cotar agora
            </Button>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sa-border text-sa-text lg:hidden"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,22rem)] flex-col bg-white p-6 shadow-2xl lg:hidden"
              role="dialog"
              aria-label="Menu de navegação"
            >
              <div className="mb-8 flex items-center justify-between">
                <p className="text-lg font-bold text-sa-text">Menu</p>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sa-border"
                  aria-label="Fechar menu"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {SEGURO_AUTO_NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => scrollToSection(item.href)}
                    className="rounded-2xl px-4 py-3.5 text-left text-base font-medium text-sa-text transition-colors hover:bg-sa-surface"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <Button
                fullWidth
                onClick={() => {
                  setIsMenuOpen(false);
                  handleQuote("header_mobile");
                }}
                className="mt-8 h-12"
              >
                Cotar agora
              </Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
