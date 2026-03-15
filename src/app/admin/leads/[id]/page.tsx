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

/** Detecta o MIME type a partir do conteúdo base64 (cabeçalho do arquivo). */
function getMimeFromBase64(base64: string): string {
  const raw = base64.replace(/^data:[^;]+;base64,/, '');
  try {
    const bin = atob(raw);
    if (bin.length < 4) return 'application/octet-stream';
    // PDF: %PDF
    if (bin.startsWith('%PDF')) return 'application/pdf';
    // JPEG: FF D8 FF
    if (bin.charCodeAt(0) === 0xff && bin.charCodeAt(1) === 0xd8) return 'image/jpeg';
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (bin.charCodeAt(0) === 0x89 && bin.slice(1, 4) === 'PNG') return 'image/png';
    // GIF: GIF87a ou GIF89a
    if (bin.startsWith('GIF87a') || bin.startsWith('GIF89a')) return 'image/gif';
    return 'image/jpeg';
  } catch {
    return 'application/octet-stream';
  }
}

/** Extrai apenas o payload base64 (sem prefixo data:). */
function getBase64Payload(base64: string): string {
  if (base64.startsWith('data:')) {
    const i = base64.indexOf(',');
    return i >= 0 ? base64.slice(i + 1) : base64;
  }
  return base64;
}

function DocLink({
  label,
  base64,
}: {
  label: string;
  base64: string | null | undefined;
}) {
  if (!base64 || typeof base64 !== 'string') return null;

  const payload = getBase64Payload(base64);
  const mime = getMimeFromBase64(base64);

  function openDocument() {
    try {
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      const w = window.open(url, '_blank', 'noopener,noreferrer');
      // Revoke após um tempo para o navegador carregar; evita vazamento de memória
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      if (!w) {
        URL.revokeObjectURL(url);
        // Fallback: abrir como data URL (pode ser bloqueado se for muito grande)
        const dataUrl = `data:${mime};base64,${payload}`;
        window.open(dataUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      console.error('Erro ao abrir documento:', e);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={openDocument}
        className="text-primary underline text-sm flex items-center gap-1 hover:no-underline focus:outline-none focus:underline"
      >
        <FileText className="h-3 w-3" />
        {label}
      </button>
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
