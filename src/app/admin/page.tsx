import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users } from 'lucide-react';

async function getLeadsSummary() {
  try {
    const base = process.env.LEAD_API_URL || 'http://api-service';
    const key = process.env.LEAD_API_KEY || process.env.API_KEY || '';
    const res = await fetch(`${base.replace(/\/$/, '')}/api/leads?limit=5000&offset=0`, {
      headers: key ? { 'X-API-Key': key } : {},
      next: { revalidate: 60 },
    });
    if (!res.ok) return { total: 0, byStatus: {}, byEligibility: {} };
    const list = await res.json();
    const all = Array.isArray(list) ? list : [];
    const byStatus: Record<string, number> = {};
    const byEligibility: Record<string, number> = {};
    for (const lead of all) {
      const s = (lead.status as string) || 'unknown';
      byStatus[s] = (byStatus[s] || 0) + 1;
      const e = (lead.eligibility_status as string) || 'unknown';
      byEligibility[e] = (byEligibility[e] || 0) + 1;
    }
    return { total: all.length, byStatus, byEligibility };
  } catch {
    return { total: 0, byStatus: {}, byEligibility: {} };
  }
}

export default async function AdminDashboardPage() {
  const summary = await getLeadsSummary();
  const { total, byStatus = {}, byEligibility = {} } = summary;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
            <CardDescription>Últimos 5000 registros (amostra)</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Por status</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {Object.entries(byStatus).map(([status, count]) => (
                <li key={status}>
                  <span className="font-medium">{status}</span>: {count}
                </li>
              ))}
              {Object.keys(byStatus).length === 0 && (
                <li className="text-muted-foreground">Nenhum dado</li>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Por elegibilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {Object.entries(byEligibility).map(([status, count]) => (
                <li key={status}>
                  <span className="font-medium">{status}</span>: {count}
                </li>
              ))}
              {Object.keys(byEligibility).length === 0 && (
                <li className="text-muted-foreground">Nenhum dado</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>Listagem completa com filtros, edição e exportação.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/admin/leads">Ver todos os leads</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
