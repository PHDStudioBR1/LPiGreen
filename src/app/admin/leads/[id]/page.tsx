'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, FileText, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Lead = Record<string, unknown> & {
  id: number;
  name: string | null;
  document_number: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  eligibility_status: string;
  representante_id: number;
  created_at: string;
  document_front_base64?: string | null;
  document_back_base64?: string | null;
  energy_bill_base64?: string | null;
  payment_proof_base64?: string | null;
};

const BASE64_KEYS = [
  'document_front_base64',
  'document_back_base64',
  'energy_bill_base64',
  'payment_proof_base64',
];

function DocLink({
  label,
  base64,
}: {
  label: string;
  base64: string | null | undefined;
}) {
  if (!base64 || typeof base64 !== 'string') return null;
  const dataUrl = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
  return (
    <div className="flex items-center gap-2">
      <a
        href={dataUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline text-sm flex items-center gap-1"
      >
        <FileText className="h-3 w-3" />
        {label}
      </a>
    </div>
  );
}

export default function AdminLeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dados' | 'logs'>('dados');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/leads/${id}`).then((r) => r.json()),
      fetch(`/api/leads/${id}/logs`).then((r) => r.json()).catch(() => []),
    ]).then(([leadData, logsData]) => {
      setLead(leadData?.error ? null : leadData);
      setLogs(Array.isArray(logsData) ? logsData : []);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/leads">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/leads">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <p className="text-destructive">Lead não encontrado.</p>
      </div>
    );
  }

  const displayFields = Object.entries(lead).filter(
    ([key]) => !BASE64_KEYS.includes(key) && key !== 'session_id'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/leads">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/admin/leads/${id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead #{lead.id}</CardTitle>
          <CardDescription>
            {lead.name ?? 'Sem nome'} · {lead.email ?? 'Sem e-mail'}
          </CardDescription>
          <div className="flex gap-2 mt-2">
            <Badge>{lead.status}</Badge>
            <Badge variant="outline">{lead.eligibility_status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 border-b pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('dados')}
              className={`text-sm font-medium ${activeTab === 'dados' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            >
              Dados
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`text-sm font-medium ${activeTab === 'logs' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            >
              Logs ({logs.length})
            </button>
          </div>

          {activeTab === 'dados' && (
            <>
              <dl className="grid gap-2 text-sm grid-cols-1 md:grid-cols-2">
                {displayFields.map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <dt className="font-medium text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}:
                    </dt>
                    <dd className="break-all">
                      {value === null || value === undefined
                        ? '-'
                        : typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Documentos</p>
                <div className="flex flex-wrap gap-4">
                  <DocLink label="Documento frente" base64={lead.document_front_base64} />
                  <DocLink label="Documento verso" base64={lead.document_back_base64} />
                  <DocLink label="Conta de luz" base64={lead.energy_bill_base64} />
                  <DocLink label="Comprovante pagamento" base64={lead.payment_proof_base64} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'logs' && (
            <ul className="space-y-2 text-sm">
              {logs.length === 0 ? (
                <li className="text-muted-foreground">Nenhum log encontrado.</li>
              ) : (
                logs.map((log: Record<string, unknown>, i: number) => (
                  <li key={i} className="border rounded p-2 font-mono text-xs">
                    <span className="text-muted-foreground">
                      {log.created_at
                        ? format(new Date(String(log.created_at)), 'dd/MM/yyyy HH:mm:ss', {
                            locale: ptBR,
                          })
                        : '-'}
                    </span>
                    {' · '}
                    <span className="font-medium">{String(log.event_type ?? '-')}</span>
                    {log.step_id != null ? ` · ${String(log.step_id)}` : null}
                  </li>
                ))
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
