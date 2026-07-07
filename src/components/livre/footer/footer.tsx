"use client";

import { useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LIVRE_CONTACT_ITEMS,
  LIVRE_FOOTER_LINK_GROUPS,
  LIVRE_INSTITUTIONAL_TEXT,
  LIVRE_LEGAL_NOTE,
  LIVRE_LOGO_ALT,
  LIVRE_LOGO_SRC,
  LIVRE_SOCIAL_LINKS,
  type LivreContactItem,
  type LivreFooterLink,
  type LivreFooterLinkGroup,
} from "@/lib/livre/constants";
import { scrollToLivreSection } from "@/lib/livre/scroll";
import { Container } from "@/components/livre/ui/container";

export type LivreFooterProps = {
  logoSrc?: string;
  logoAlt?: string;
  tagline?: string;
  institutionalText?: string;
  linkGroups?: LivreFooterLinkGroup[];
  contactItems?: LivreContactItem[];
  socialLinks?: { label: string; href: string }[];
  copyright?: string;
  legalNote?: string;
  className?: string;
};

function FooterLink({ link, onSectionClick }: { link: LivreFooterLink; onSectionClick: (href: string) => void }) {
  const className =
    "text-sm text-livre-muted transition-colors duration-150 hover:text-livre-primary focus-visible:outline-none focus-visible:text-livre-primary";

  if (link.href.startsWith("#")) {
    return (
      <button type="button" onClick={() => onSectionClick(link.href)} className={className}>
        {link.label}
      </button>
    );
  }

  if (link.href.startsWith("http")) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function LivreFooter({
  logoSrc = LIVRE_LOGO_SRC,
  logoAlt = LIVRE_LOGO_ALT,
  tagline = "Mercado Livre de Energia iGreen — economia, sustentabilidade e previsibilidade para o seu negócio.",
  institutionalText = LIVRE_INSTITUTIONAL_TEXT,
  linkGroups = LIVRE_FOOTER_LINK_GROUPS,
  contactItems = LIVRE_CONTACT_ITEMS,
  socialLinks = [...LIVRE_SOCIAL_LINKS],
  copyright = "© 2026 iGreen Energy. Todos os direitos reservados.",
  legalNote = LIVRE_LEGAL_NOTE,
  className,
}: LivreFooterProps) {
  const scrollToSection = useCallback((href: string) => {
    if (!href.startsWith("#")) return;
    scrollToLivreSection(href.slice(1));
  }, []);

  return (
    <footer
      className={cn(
        "border-t border-livre-petrol-600 bg-livre-bg-base py-12 lg:py-16",
        className
      )}
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <img src={logoSrc} alt={logoAlt} className="h-7 w-auto" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-livre-muted">{tagline}</p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/40">{institutionalText}</p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <h3 className="font-lv-headline text-sm font-semibold text-livre-text">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} onSectionClick={scrollToSection} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-4">
            <h3 className="font-lv-headline text-sm font-semibold text-livre-text">Contato</h3>
            <ul className="mt-4 space-y-4">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                    {item.label}
                  </p>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-1 inline-block text-sm text-livre-muted transition-colors hover:text-livre-primary focus-visible:outline-none focus-visible:text-livre-primary"
                  >
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-sm text-livre-muted transition-colors hover:text-livre-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-livre-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 border-t border-livre-petrol-600 pt-6">
          <p className="text-xs text-white/40">{copyright}</p>
          {legalNote && <p className="mt-1 text-xs text-white/40">{legalNote}</p>}
        </div>
      </Container>
    </footer>
  );
}
