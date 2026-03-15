'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PAGE_SIZE = 20;
const STATUS_OPTIONS = ['new', 'draft', 'deleted'];
const ELIGIBILITY_OPTIONS = ['nao_verificado', 'elegivel', 'nao_elegivel', 'cadastrado'];

type Lead = {
  id: number;
  name: string | null;
  document_number: string | null;
  email: string | null;
  status: string;
  eligibility_status: string;
  representante_id: number;
  created_at: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [eligibilityStatus, setEligibilityStatus] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    const params = new URLSearchParams();
    params.set('limit', String(PAGE_SIZE));
    params.set('offset', String(page * PAGE_SIZE));
    if (status) params.set('status', status);
    if (eligibilityStatus) params.set('eligibility_status', eligibilityStatus);
    if (documentNumber.trim()) params.set('document_number', documentNumber.trim());
    if (createdFrom) params.set('created_from', createdFrom);
    if (createdTo) params.set('created_to', createdTo);
    try {
      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setApiError(typeof data?.error === 'string' ? data.error : `Erro ao carregar leads (${res.status})`);
        setLeads([]);
        return;
      }
      if (!Array.isArray(data)) {
        setApiError(typeof data?.error === 'string' ? data.error : 'Resposta inválida da API');
        setLeads([]);
        return;
      }
      setLeads(data);
    } catch (e) {
      setApiError('Falha de conexão ao carregar os leads.');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [page, status, eligibilityStatus, documentNumber, createdFrom, createdTo]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function handleExport() {
    const params = new URLSearchParams();
    params.set('format', 'csv');
    if (status) params.set('status', status);
    if (eligibilityStatus) params.set('eligibility_status', eligibilityStatus);
    if (documentNumber.trim()) params.set('document_number', documentNumber.trim());
    if (createdFrom) params.set('created_from', createdFrom);
    if (createdTo) params.set('created_to', createdTo);
    window.open(`/api/admin/leads/export?${params.toString()}`, '_blank');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Leads</h1>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Elegibilidade</Label>
          <Select
            value={eligibilityStatus || 'all'}
            onValueChange={(v) => setEligibilityStatus(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {ELIGIBILITY_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>CPF/Documento</Label>
          <Input
            placeholder="Buscar..."
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            className="w-[180px]"
          />
        </div>
        <div className="space-y-2">
          <Label>De (data)</Label>
          <Input
            type="date"
            value={createdFrom}
            onChange={(e) => setCreatedFrom(e.target.value)}
            className="w-[140px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Até (data)</Label>
          <Input
            type="date"
            value={createdTo}
            onChange={(e) => setCreatedTo(e.target.value)}
            className="w-[140px]"
          />
        </div>
        <Button variant="secondary" onClick={() => fetchLeads()} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
        <Button onClick={handleExport} disabled={loading}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {apiError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
          {apiError}
          {apiError.includes('autorizado') && (
            <p className="mt-2 text-muted-foreground">
              Verifique se o frontend está com a variável LEAD_API_KEY igual à API_KEY do backend (secret api-secret no cluster).
            </p>
          )}
        </div>
      )}

      <div className="rounded-md border">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Elegibilidade</TableHead>
                  <TableHead>Rep.</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-mono">{lead.id}</TableCell>
                    <TableCell>{lead.name ?? '-'}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {lead.document_number ?? '-'}
                    </TableCell>
                    <TableCell>{lead.email ?? '-'}</TableCell>
                    <TableCell>
                      <Badge variant={lead.status === 'deleted' ? 'destructive' : 'secondary'}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.eligibility_status}</Badge>
                    </TableCell>
                    <TableCell>{lead.representante_id}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {lead.created_at
                        ? format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/leads/${lead.id}`}>Ver</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {leads.length === 0 && !apiError && (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum lead encontrado com os filtros atuais.
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || loading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">Página {page + 1}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={leads.length < PAGE_SIZE || loading}
        >
          Próxima
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
