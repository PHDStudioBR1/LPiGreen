import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'iGreen Energy | Economize até 50% na sua Conta de Luz',
  description: 'Descubra como economizar até 50% na sua conta de luz usando energia limpa por assinatura. Sem obras e sem investimento. Garantido pela Lei 14.300/2022.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
