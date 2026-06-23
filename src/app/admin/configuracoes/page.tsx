'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/config?namespace=doc_ai&key=enabled');
      if (!res.ok) throw new Error('Falha ao buscar configuração');
      const data = await res.json();
      setAiEnabled(data.value !== 'false');
    } catch {
      setAiEnabled(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  async function handleToggle(checked: boolean) {
    setSaving(true);
    setFeedback(null);
    const previous = aiEnabled;
    setAiEnabled(checked);

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namespace: 'doc_ai',
          key: 'enabled',
          value: String(checked),
        }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar');
      setFeedback({
        type: 'success',
        message: checked
          ? 'Validação por IA ativada com sucesso.'
          : 'Validação por IA desativada. Leads cairão em revisão manual.',
      });
    } catch {
      setAiEnabled(previous);
      setFeedback({
        type: 'error',
        message: 'Erro ao salvar configuração. Tente novamente.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema em tempo real.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Validação de Documentos por IA</CardTitle>
              <CardDescription>
                Quando ativada, os documentos enviados pelos leads são validados
                automaticamente por inteligência artificial (OpenAI Vision).
                Quando desativada, todos os leads caem em revisão manual.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="ai-toggle"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Validação automática por IA
                  </Label>
                  {aiEnabled ? (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      Ativa
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inativa</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  <Switch
                    id="ai-toggle"
                    checked={aiEnabled ?? false}
                    onCheckedChange={handleToggle}
                    disabled={saving}
                  />
                </div>
              </div>

              {feedback && (
                <p
                  className={`text-sm ${
                    feedback.type === 'success'
                      ? 'text-green-600'
                      : 'text-destructive'
                  }`}
                >
                  {feedback.message}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                A alteração entra em vigor imediatamente, sem necessidade de
                deploy. A variável de ambiente{' '}
                <code className="rounded bg-muted px-1 py-0.5">DOC_AI_PROVIDER</code>{' '}
                continua definindo qual provedor de IA é utilizado.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
