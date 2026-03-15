'use client';

import { useParams, useRouter } from 'next/navigation';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

type Representante = { id: number; nome: string };

const STATUS_OPTIONS = ['new', 'draft', 'deleted'];
const ELIGIBILITY_OPTIONS = ['nao_verificado', 'elegivel', 'nao_elegivel', 'cadastrado'];

export default function AdminLeadEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [status, setStatus] = useState('');
  const [eligibilityStatus, setEligibilityStatus] = useState('');
  const [representanteId, setRepresentanteId] = useState('');
  const [idCampaign, setIdCampaign] = useState('');
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchLead = useCallback(async () => {
    if (!id) return;
    const res = await fetch(`/api/leads/${id}`);
    const data = await res.json();
    if (data?.error) {
      setLoading(false);
      return;
    }
    setStatus((data.status as string) ?? 'new');
    setEligibilityStatus((data.eligibility_status as string) ?? 'nao_verificado');
    setRepresentanteId(String(data.representante_id ?? ''));
    setIdCampaign((data.id_campaign as string) ?? '');
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  useEffect(() => {
    fetch('/api/representantes')
      .then((r) => r.json())
      .then((data) => setRepresentantes(Array.isArray(data) ? data : []))
      .catch(() => setRepresentantes([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status || undefined,
          eligibility_status: eligibilityStatus || undefined,
          representante_id: representanteId ? Number(representanteId) : undefined,
          id_campaign: idCampaign || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Erro ao atualizar lead');
        return;
      }
      router.push(`/admin/leads/${id}`);
      router.refresh();
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/leads/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/admin/leads/${id}`}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar lead #{id}</CardTitle>
          <CardDescription>Altere status, elegibilidade, representante ou campanha.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
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
              <Select value={eligibilityStatus} onValueChange={setEligibilityStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ELIGIBILITY_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Representante</Label>
              <Select value={representanteId} onValueChange={setRepresentanteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {representantes.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.nome} (ID: {r.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ID Campanha</Label>
              <Input
                value={idCampaign}
                onChange={(e) => setIdCampaign(e.target.value)}
                placeholder="Opcional"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
