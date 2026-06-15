export function SegurosFooter() {
  return (
    <footer className="border-t border-seguros-primary/10 py-8 pb-28 pr-4 seguros-safe-area-pb sm:py-10 md:pb-10 md:pr-0">
      <div className="container mx-auto space-y-3 px-4 text-center sm:px-6">
        <p className="font-seguros-headline font-bold text-seguros-text">Seguro iGreen</p>
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-seguros-muted sm:text-sm">
          Produtos oferecidos por parceiros autorizados pela SUSEP. Consulte condições e coberturas
          antes da contratação.
        </p>
        <p className="text-[11px] text-seguros-muted/70 sm:text-xs">
          © {new Date().getFullYear()} iGreen Energy LTDA. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
