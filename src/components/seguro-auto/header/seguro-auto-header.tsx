"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SEGURO_AUTO_HEADER_OFFSET,
  SEGURO_AUTO_NAV_ITEMS,
  SEGURO_AUTO_UTILITY_LINKS,
} from "@/lib/seguro-auto/constants";

type SeguroAutoHeaderProps = {
  onQuoteClick?: () => void;
};

export function SeguroAutoHeader({ onQuoteClick }: SeguroAutoHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
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
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    const top =
      target.getBoundingClientRect().top + window.scrollY - SEGURO_AUTO_HEADER_OFFSET;

    window.scrollTo({ top, behavior: "smooth" });
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-sa-bg transition-shadow duration-300",
          isScrolled && "shadow-[0_1px_0_0_#e5e5e5]"
        )}
      >
        <div className="hidden border-b border-sa-border bg-sa-surface lg:block">
          <div className="container mx-auto flex h-9 items-center justify-end gap-5 px-4 sm:px-6">
            {SEGURO_AUTO_UTILITY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-sa-muted transition-colors hover:text-sa-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:h-[60px]">
          <button
            type="button"
            onClick={() => scrollToSection("#inicio")}
            className="shrink-0"
            aria-label="Voltar ao início"
          >
            <img
              src="/images/seguros/logo-seguros-B8WMVJ8W.svg"
              alt="Seguro iGreen"
              className="h-7 w-auto sm:h-8"
            />
          </button>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
            {SEGURO_AUTO_NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollToSection(item.href)}
                className="inline-flex items-center gap-1 text-sm font-medium text-sa-text transition-colors hover:text-sa-primary"
              >
                {item.label}
                <ChevronDown className="h-4 w-4 text-sa-muted" aria-hidden />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onQuoteClick}
              className="sa-btn-primary hidden h-10 items-center justify-center rounded-lg px-5 text-sm sm:inline-flex"
            >
              Cotar agora
            </button>

            <button
              type="button"
              className="hidden items-center gap-2 text-sm font-medium text-sa-text transition-colors hover:text-sa-primary lg:inline-flex"
            >
              Área do cliente
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sa-border">
                <User className="h-4 w-4" aria-hidden />
              </span>
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sa-border text-sa-text lg:hidden"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 lg:hidden",
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-[min(90vw,20rem)] flex-col bg-sa-bg p-6 shadow-2xl transition-transform duration-300 lg:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!isMenuOpen}
        role="dialog"
        aria-label="Menu de navegação"
      >
        <div className="mb-8 flex items-center justify-between">
          <p className="text-lg font-semibold text-sa-text">Menu</p>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sa-border"
            aria-label="Fechar menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {SEGURO_AUTO_NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => scrollToSection(item.href)}
              className="block w-full rounded-lg px-4 py-3 text-left text-base font-medium text-sa-text transition-colors hover:bg-sa-surface"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(false);
            onQuoteClick?.();
          }}
          className="sa-btn-primary mt-8 h-12 w-full rounded-lg text-base"
        >
          Cotar agora
        </button>
      </aside>
    </>
  );
}
