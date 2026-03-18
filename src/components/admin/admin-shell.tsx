'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

const ADMIN_LOGIN = '/admin/login';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const isLoginPage = pathname === ADMIN_LOGIN;

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }
    fetch('/api/admin/me')
      .then((res) => {
        if (res.status === 401) {
          router.replace(`${ADMIN_LOGIN}?from=${encodeURIComponent(pathname || '/admin')}`);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.username) setUsername(data.username);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [isLoginPage, pathname, router]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace(ADMIN_LOGIN);
    router.refresh();
  }

  if (isLoginPage) {
    return <div className="min-h-screen flex items-center justify-center bg-muted/30">{children}</div>;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-56 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">CRM Admin</h2>
          {username && (
            <p className="text-sm text-muted-foreground truncate" title={username}>
              {username}
            </p>
          )}
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <Link
            href="/admin"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname === '/admin' ? 'bg-muted' : 'hover:bg-muted'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/leads"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.startsWith('/admin/leads') ? 'bg-muted' : 'hover:bg-muted'
            }`}
          >
            <Users className="h-4 w-4" />
            Leads
          </Link>
          <Link
            href="/admin/configuracoes"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.startsWith('/admin/configuracoes') ? 'bg-muted' : 'hover:bg-muted'
            }`}
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Link>
        </nav>
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
