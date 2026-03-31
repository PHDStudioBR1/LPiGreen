import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Seja um Licenciado iGreen Energy - B2B',
  description:
    'Seja um Licenciado iGreen Energy - B2B. Construa renda recorrente vitalícia conectando consumidores a fazendas solares, com operação digital e modelo regulamentado.',
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden w-full min-w-0">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
