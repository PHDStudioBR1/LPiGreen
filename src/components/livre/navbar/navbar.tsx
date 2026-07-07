"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LIVRE_CTA_LABEL,
  LIVRE_CTA_SECTION_ID,
  LIVRE_LOGO_ALT,
  LIVRE_LOGO_SRC,
  LIVRE_NAV_ITEMS,
  type LivreNavItem,
} from "@/lib/livre/constants";
import { scrollToLivreSection } from "@/lib/livre/scroll";
import { Container } from "@/components/livre/ui/container";
import { LivreButton } from "@/components/livre/ui/button";

export type LivreNavbarProps = {
  navItems?: LivreNavItem[];
  logoSrc?: string;
  logoAlt?: string;
  homeHref?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  onNavClick?: (sectionId: string) => void;
  className?: string;
};

export function LivreNavbar({
  navItems = LIVRE_NAV_ITEMS,
  logoSrc = LIVRE_LOGO_SRC,
  logoAlt = LIVRE_LOGO_ALT,
  homeHref = "/livre",
  ctaLabel = LIVRE_CTA_LABEL,
  onCtaClick,
  onNavClick,
  className,
}: LivreNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
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

  const scrollToSection = useCallback(
    (href: string) => {
      if (!href.startsWith("#")) return;
      const sectionId = href.slice(1);
      onNavClick?.(sectionId);
      scrollToLivreSection(sectionId);
      setIsMenuOpen(false);
    },
    [onNavClick]
  );

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      scrollToSection(`#${LIVRE_CTA_SECTION_ID}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={prefersReducedMotion ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
          isScrolled
            ? "border-livre-petrol-500/60 bg-livre-bg-elevated/90 shadow-lv-navbar backdrop-blur-md"
            : "border-transparent bg-livre-bg-base/70 backdrop-blur-sm",
          className
        )}
      >
        <Container
          as="nav"
          aria-label="Navegação principal"
          className={cn(
            "flex items-center justify-between gap-4 transition-all duration-300",
            isScrolled ? "h-16" : "h-[72px] lg:h-[72px]"
          )}
        >
          <Link href={homeHref} className="shrink-0">
            <img src={logoSrc} alt={logoAlt} className="h-7 w-auto lg:h-8" />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  "text-sm font-medium text-livre-muted transition-colors duration-150",
                  "hover:text-livre-text",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-livre-primary focus-visible:ring-offset-2 focus-visible:ring-offset-livre-bg-default"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LivreButton
              size="sm"
              className="max-w-[9.5rem] truncate px-3 text-xs sm:max-w-none sm:px-4 sm:text-sm lg:hidden"
              onClick={handleCta}
            >
              {ctaLabel}
            </LivreButton>
            <LivreButton size="md" className="hidden lg:inline-flex" onClick={handleCta}>
              {ctaLabel}
            </LivreButton>
            <button
              type="button"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full text-livre-text lg:hidden",
                "hover:bg-white/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-livre-primary"
              )}
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={prefersReducedMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col border-l border-livre-petrol-500 bg-livre-bg-default p-6 lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <img src={logoSrc} alt={logoAlt} className="h-7 w-auto" />
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex size-10 items-center justify-center rounded-full text-livre-text hover:bg-white/5"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => scrollToSection(item.href)}
                    className="rounded-lv-sm px-3 py-3 text-left text-base font-medium text-livre-text/80 transition-colors hover:bg-white/5 hover:text-livre-text"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-auto pt-6">
                <LivreButton fullWidth size="lg" onClick={handleCta}>
                  {ctaLabel}
                </LivreButton>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
