import Link from "next/link";

export function SegurosFooter() {
  return (
    <footer className="border-t border-seguros-primary/10 py-8 pb-28 pr-4 seguros-safe-area-pb sm:py-10 md:pb-10 md:pr-0">
      <div className="container mx-auto space-y-3 px-4 text-center sm:px-6">
        <p className="font-seguros-headline font-bold text-seguros-text">Seguro iGreen</p>
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-seguros-muted sm:text-sm">
          Produtos oferecidos por licenciado independente Igreen, representante da BP Seguradora
          S.A. regulamentado pela SUSEP 15414.659052/2024-88. Consulte condições e coberturas antes
          da contratação.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-seguros-muted sm:text-xs">
          <Link
            href="/seguros/politicadeprivacidade"
            className="transition-colors hover:text-seguros-primary"
          >
            Política de privacidade
          </Link>
          <Link
            href="/seguros/termosdeuso"
            className="transition-colors hover:text-seguros-primary"
          >
            Termos de uso
          </Link>
        </div>
        <p className="text-[11px] text-seguros-muted/70 sm:text-xs">
          © 2026 representanteigreen Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
