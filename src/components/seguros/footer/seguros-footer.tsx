export function SegurosFooter() {
  return (
    <footer className="border-t border-seguros-primary/10 py-10 pb-24 md:pb-10">
      <div className="container mx-auto px-4 sm:px-6 text-center space-y-3">
        <p className="font-seguros-headline font-bold text-seguros-text">Seguro iGreen</p>
        <p className="text-sm text-seguros-muted max-w-2xl mx-auto leading-relaxed">
          Produtos oferecidos por parceiros autorizados pela SUSEP. Consulte condições e coberturas
          antes da contratação.
        </p>
        <p className="text-xs text-seguros-muted/70">
          © {new Date().getFullYear()} iGreen Energy LTDA. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
