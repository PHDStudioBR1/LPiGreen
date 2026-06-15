"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SEGUROS_HEADER_OFFSET,
  SEGUROS_NAV_ITEMS,
} from "@/lib/seguros/constants";

type SegurosHeaderProps = {
  onQuoteClick: () => void;
};

export function SegurosHeader({ onQuoteClick }: SegurosHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
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

  useEffect(() => {
    const sectionIds = ["inicio", ...SEGUROS_NAV_ITEMS.map((item) => item.id)];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${SEGUROS_HEADER_OFFSET + 8}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.35, 0.55],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const top =
      target.getBoundingClientRect().top + window.scrollY - SEGUROS_HEADER_OFFSET;

    window.scrollTo({ top, behavior: "smooth" });
    setIsMenuOpen(false);
  }, []);

  const handleLogoClick = () => scrollToSection("inicio");

  const navLinkClass = (sectionId: string, mobile = false) =>
    cn(
      "relative font-medium transition-colors duration-200",
      mobile
        ? "block w-full rounded-xl px-4 py-3 text-base"
        : "px-1 py-2 text-sm xl:text-[15px]",
      activeSection === sectionId
        ? "text-seguros-primary"
        : "text-seguros-text/90 hover:text-seguros-primary"
    );

  return (
    <>
      <header
        className={cn(
          "seguros-header fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isScrolled ? "seguros-header--scrolled" : "seguros-header--transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="seguros-header__row flex h-[72px] items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
            <div className="flex min-w-0 items-center justify-start">
              <button
                type="button"
                onClick={handleLogoClick}
                className="group flex min-w-0 items-center gap-2.5 text-left"
                aria-label="Voltar ao início"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-seguros-primary text-xs font-extrabold text-seguros-bg transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10 sm:text-sm">
                  iG
                </span>
                <span className="min-w-0 font-seguros-headline text-base font-extrabold leading-tight text-seguros-text sm:text-lg">
                  <span className="block truncate">Seguro</span>
                  <span className="block truncate text-seguros-primary">iGreen</span>
                </span>
              </button>
            </div>

            <nav
              className="hidden items-center justify-center lg:flex"
              aria-label="Navegação principal"
            >
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 xl:gap-x-7">
                {SEGUROS_NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={navLinkClass(item.id)}
                    >
                      {item.label}
                      {activeSection === item.id && (
                        <span
                          className="absolute -bottom-0.5 left-0 right-0 mx-auto h-0.5 w-4 rounded-full bg-seguros-primary"
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onQuoteClick}
                className="seguros-header__cta hidden h-10 items-center justify-center rounded-full px-5 text-sm font-extrabold sm:inline-flex lg:h-11 lg:px-6"
              >
                Cotar Grátis
              </button>

              <button
                type="button"
                className="seguros-header__trigger inline-flex h-10 w-10 items-center justify-center rounded-xl border border-seguros-primary/20 text-seguros-text transition-colors hover:border-seguros-primary/45 hover:text-seguros-primary lg:hidden"
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMenuOpen}
                aria-controls="seguros-mobile-menu"
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "seguros-header__overlay fixed inset-0 z-[60] bg-black/55 transition-opacity duration-300 lg:hidden",
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      <aside
        id="seguros-mobile-menu"
        className={cn(
          "seguros-header__drawer fixed inset-y-0 right-0 z-[70] flex w-[min(90vw,20rem)] flex-col border-l border-seguros-primary/15 p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!isMenuOpen}
        role="dialog"
        aria-label="Menu de navegação"
      >
        <div className="mb-8 flex items-center justify-between">
          <p className="font-seguros-headline text-lg font-bold text-seguros-text">Menu</p>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-seguros-primary/20 text-seguros-muted transition-colors hover:border-seguros-primary/45 hover:text-seguros-text"
            aria-label="Fechar menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Navegação mobile">
          <ul className="space-y-1">
            {SEGUROS_NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    navLinkClass(item.id, true),
                    activeSection === item.id && "bg-seguros-primary/10"
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(false);
            onQuoteClick();
          }}
          className="seguros-header__cta mt-8 h-12 w-full rounded-2xl text-base font-extrabold"
        >
          Cotar Grátis
        </button>
      </aside>
    </>
  );
}
