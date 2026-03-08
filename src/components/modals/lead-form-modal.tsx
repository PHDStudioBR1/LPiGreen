"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { maskCep, maskPhone, maskCpfCnpj, maskCurrency, maskBirthDate } from "@/lib/masks";

/** Rótulos amigáveis para exibir erros (não técnicos). */
const FIELD_LABELS: Record<string, string> = {
  cep_landing: "CEP",
  valor_conta: "Valor da conta",
  document_number: "Número do documento (CPF/RG)",
  name: "Nome",
  birth_date: "Data de nascimento",
  phone: "Celular",
  phone_confirm: "Confirmação de celular",
  email: "E-mail",
  email_confirm: "Confirmação de e-mail",
  cep: "CEP do endereço",
  address: "Endereço",
  number: "Número",
  neighborhood: "Bairro",
  city: "Cidade",
  state: "Estado",
  complement: "Complemento",
  power_company: "Distribuidora de energia",
  installation_number: "Número da instalação",
  document_type: "Tipo de documento",
  energy_bill_password: "Senha do arquivo",
  energy_bill: "Conta de energia",
  has_pending_debts: "Débitos em aberto",
  payment_proof: "Comprovante de pagamento",
  document_front: "Documento pessoal – Frente",
  document_back: "Documento pessoal – Verso",
};

/** Passo do formulário em que cada campo aparece (0–5). */
const FIELD_STEP: Record<string, number> = {
  cep_landing: 0, valor_conta: 0,
  document_number: 1, name: 1, birth_date: 1, phone: 1, phone_confirm: 1, email: 1, email_confirm: 1,
  cep: 2, address: 2, number: 2, neighborhood: 2, city: 2, state: 2, complement: 2,
  power_company: 3, installation_number: 3, document_type: 3, document_front: 3, document_back: 3,
  document_front_base64: 3, document_back_base64: 3,
  energy_bill_password: 4, energy_bill: 4, energy_bill_base64: 4, has_pending_debts: 4, payment_proof: 4, payment_proof_base64: 4,
};

/** Campos de documento que vêm do backend como _base64; exibir no FileUploadField correspondente. */
const DOCUMENT_FIELD_TO_SLOT: Record<string, "document_front" | "document_back" | "energy_bill"> = {
  document_front_base64: "document_front",
  document_back_base64: "document_back",
  energy_bill_base64: "energy_bill",
};

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const ANEEL_DISTRIBUIDORAS_URL = "/api/aneel/distribuidoras";

type AneelDistribuidora = {
  SigAgente: string;
  NumCNPJDistribuidora: string;
  DscBaseTarifaria: string;
};

const TIPO_DOC = ["RG (Novo)", "RG (Antigo)", "CNH"];

const STEPS = [
  { id: "landing", title: "Entrada" },
  { id: "cadastro", title: "Cadastro pessoal" },
  { id: "endereco", title: "Endereço" },
  { id: "energia", title: "Energia e documento" },
  { id: "procurador", title: "Procurador e conta" },
  { id: "final", title: "Finalizar" },
];
const PROGRESS_START_STEP = 1;
const FORM_SESSION_STORAGE_KEY = "lead_form_session_id";

export type LeadFormValues = {
  cep_landing: string;
  valor_conta: string;
  document_number: string;
  name: string;
  birth_date: string;
  phone: string;
  phone_confirm: string;
  email: string;
  email_confirm: string;
  cep: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
  power_company: string;
  installation_number: string;
  document_type: string;
  energy_bill_password: string;
  has_pending_debts: string;
};

const defaultValues: LeadFormValues = {
  cep_landing: "",
  valor_conta: "",
  document_number: "",
  name: "",
  birth_date: "",
  phone: "",
  phone_confirm: "",
  email: "",
  email_confirm: "",
  cep: "",
  address: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  complement: "",
  power_company: "",
  installation_number: "",
  document_type: "",
  energy_bill_password: "",
  has_pending_debts: "nao",
};

export interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function FileUploadField(props: {
  label: string;
  description?: string;
  accept?: string;
  file?: File;
  onChange: (file?: File) => void;
  errors?: string[];
  requirement?: string;
}) {
  const { label, description, accept, file, onChange, errors = [], requirement } = props;
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const hasError = errors.length > 0;

  return (
    <FormItem>
      <FormLabel className={hasError ? "text-destructive" : undefined}>{label}</FormLabel>
      <FormControl>
        <label
          htmlFor={id}
          className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors ${
            hasError
              ? "border-destructive border-dashed bg-destructive/5 hover:bg-destructive/10"
              : "border-dashed border-muted-foreground/30 hover:bg-muted/60"
          }`}
        >
          <div className="flex flex-col">
            <span className="font-medium truncate max-w-[220px]">
              {file ? file.name : "Clique para selecionar ou arraste o arquivo"}
            </span>
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-3 flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Escolher</span>
          </Button>
          <input
            id={id}
            type="file"
            accept={accept}
            className="sr-only"
            ref={inputRef}
            onChange={(e) => onChange(e.target.files?.[0])}
          />
        </label>
      </FormControl>
      {requirement && !hasError && (
        <p className="text-xs text-muted-foreground">Requisito: {requirement}</p>
      )}
      {hasError && (
        <div className="text-sm text-destructive space-y-0.5">
          {errors.map((msg, i) => (
            <p key={i} role="alert">
              {msg}
            </p>
          ))}
        </div>
      )}
    </FormItem>
  );
}

export function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
  const [step, setStep] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [files, setFiles] = useState<{
    document_front?: File;
    document_back?: File;
    energy_bill?: File;
    payment_proof?: File;
  }>({});
  const [distribuidoras, setDistribuidoras] = useState<AneelDistribuidora[]>([]);
  const [loadingDistribuidoras, setLoadingDistribuidoras] = useState(false);
  const [distribuidorasError, setDistribuidorasError] = useState<string | null>(null);
  const [showDistribuidoraSuggestions, setShowDistribuidoraSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionErrors, setSubmissionErrors] = useState<{
    items: { stepIndex: number; label: string; message: string }[];
    documentErrors: Record<string, string[]>;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) setSubmissionErrors(null);
  }, [isOpen]);

  const form = useForm<LeadFormValues>({ defaultValues });
  const watchHasPendingDebts = form.watch("has_pending_debts");

  const getOrCreateSessionId = useCallback(() => {
    const fromStorage = window.localStorage.getItem(FORM_SESSION_STORAGE_KEY);
    if (fromStorage) return fromStorage;
    const generated =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `lead-${Date.now()}`;
    window.localStorage.setItem(FORM_SESSION_STORAGE_KEY, generated);
    return generated;
  }, []);

  const clearRemoteProgress = useCallback(async () => {
    if (!sessionId) return;
    try {
      await fetch(`/api/leads/progress/${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Erro ao limpar cache de progresso:", error);
    }
  }, [sessionId]);

  const persistProgress = useCallback(
    async (stepIndex: number) => {
      if (!sessionId || stepIndex < PROGRESS_START_STEP) return;
      try {
        await fetch("/api/leads/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            step_index: stepIndex,
            step_id: STEPS[stepIndex]?.id,
            values: form.getValues(),
          }),
        });
      } catch (error) {
        console.error("Erro ao salvar progresso no Redis:", error);
      }
    },
    [form, sessionId]
  );

  useEffect(() => {
    if (!isOpen) return;
    const sid = getOrCreateSessionId();
    setSessionId(sid);

    const loadProgress = async () => {
      try {
        const res = await fetch(`/api/leads/progress/${encodeURIComponent(sid)}`, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.values && typeof data.values === "object") {
          form.reset({
            ...defaultValues,
            ...data.values,
          });
        }
        if (Number.isInteger(data?.step_index) && data.step_index >= PROGRESS_START_STEP) {
          setStep(Math.min(data.step_index, STEPS.length - 1));
        }
      } catch (error) {
        console.error("Erro ao recuperar progresso salvo:", error);
      }
    };

    loadProgress();
  }, [form, getOrCreateSessionId, isOpen]);

  useEffect(() => {
    const fetchDistribuidoras = async () => {
      try {
        setLoadingDistribuidoras(true);
        setDistribuidorasError(null);

        const res = await fetch(ANEEL_DISTRIBUIDORAS_URL, {
          headers: {
            Accept: "application/json",
          },
        });

        const json = await res.json();
        const records: AneelDistribuidora[] = json?.result?.records ?? [];

        // Deduplica por nome e remove registros "Não Informado"
        const porNome = new Map<string, AneelDistribuidora>();
        for (const r of records) {
          const nome = typeof r.SigAgente === "string" ? r.SigAgente.trim() : "";
          if (!nome || nome.toLowerCase() === "não informado") continue;
          if (!porNome.has(nome)) {
            porNome.set(nome, r);
          }
        }

        const listaOrdenada = Array.from(porNome.values()).sort((a, b) =>
          a.SigAgente.localeCompare(b.SigAgente, "pt-BR")
        );

        setDistribuidoras(listaOrdenada);
      } catch (error) {
        console.error("Erro ao buscar distribuidoras da ANEEL:", error);
        setDistribuidorasError(
          "Não foi possível carregar automaticamente as distribuidoras. Você pode digitar o nome manualmente."
        );
      } finally {
        setLoadingDistribuidoras(false);
      }
    };

    fetchDistribuidoras();
  }, []);

  const formatCnpj = (cnpj: string) => {
    const onlyNumbers = cnpj.replace(/\D/g, "");
    if (onlyNumbers.length !== 14) return cnpj;

    return onlyNumbers.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  const fillAddressFromCep = useCallback(
    async (cepValue: string) => {
      const numeric = cepValue.replace(/\D/g, "");
      if (numeric.length !== 8) return;

      try {
        const res = await fetch(`https://viacep.com.br/ws/${numeric}/json/`);
        const data = await res.json();

        if (data.erro) {
          toast({
            title: "CEP não encontrado",
            description: "Verifique o CEP digitado.",
            variant: "destructive",
          });
          return;
        }

        form.setValue("address", data.logradouro || "");
        form.setValue("neighborhood", data.bairro || "");
        form.setValue("city", data.localidade || "");
        form.setValue("state", data.uf || "");
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast({
          title: "Erro ao buscar CEP",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      }
    },
    [form, toast]
  );

  const buildFormData = useCallback(() => {
    const fd = new FormData();
    const values = form.getValues();
    const rawValor = values.valor_conta.replace(/\D/g, "");
    const valorNum = rawValor ? (parseInt(rawValor, 10) / 100).toFixed(2) : "0";
    fd.append("valor_conta", valorNum);
    Object.entries(values).forEach(([k, v]) => {
      if (k === "valor_conta") return;
      if (v != null && v !== "") fd.append(k, String(v));
    });
    if (files.document_front) fd.append("document_front", files.document_front);
    if (files.document_back) fd.append("document_back", files.document_back);
    if (files.energy_bill) fd.append("energy_bill", files.energy_bill);
    if (files.payment_proof) fd.append("payment_proof", files.payment_proof);
    return fd;
  }, [form, files]);

  const onSubmit = async () => {
    setSubmissionErrors(null);
    setSubmitting(true);
    try {
      const fd = buildFormData();
      if (sessionId) {
        fd.append("session_id", sessionId);
      }
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const details = (data.details && typeof data.details === "object") ? data.details : {};
        const items: { stepIndex: number; label: string; message: string }[] = [];
        const documentErrors: Record<string, string[]> = { document_front: [], document_back: [], energy_bill: [] };

        for (const [key, value] of Object.entries(details)) {
          const messages = Array.isArray(value) ? value.filter(Boolean).map(String) : [];
          if (!messages.length) continue;

          const docSlot = DOCUMENT_FIELD_TO_SLOT[key];
          if (docSlot) {
            const friendly = messages.map((m) =>
              m.replace(/documento ilegível/i, "Documento ilegível. Envie uma foto nítida e completa.")
                .replace(/não é o documento esperado/i, "Não é o documento esperado. Envie o documento correto para este campo.")
            );
            documentErrors[docSlot].push(...friendly);
            const stepIndex = docSlot === "energy_bill" ? 4 : 3;
            const label = FIELD_LABELS[docSlot] || docSlot;
            friendly.forEach((msg) => items.push({ stepIndex, label, message: msg }));
            continue;
          }

          if (key === "document_validation") {
            for (const raw of messages) {
              const matchBracket = raw.match(/^\s*\[(\w+)\]\s*(.+)$/);
              const matchColon = raw.match(/^\s*(\w+):\s*(.+)$/);
              let slot = "";
              let msg = raw;
              if (matchBracket) {
                slot = matchBracket[1];
                msg = matchBracket[2].trim();
              } else if (matchColon && ["document_front", "document_back", "energy_bill"].includes(matchColon[1])) {
                slot = matchColon[1];
                msg = matchColon[2].trim();
              }
              const friendlyMsg = msg
                .replace(/documento ilegível/i, "Documento ilegível. Envie uma foto nítida e completa.")
                .replace(/não é o documento esperado/i, "Não é o documento esperado. Envie o documento correto para este campo.");
              if (slot && documentErrors[slot as keyof typeof documentErrors]) {
                documentErrors[slot as keyof typeof documentErrors].push(friendlyMsg);
                const stepIndex = slot === "energy_bill" ? 4 : 3;
                const label = FIELD_LABELS[slot] || slot;
                items.push({ stepIndex, label, message: friendlyMsg });
              } else {
                items.push({ stepIndex: 3, label: "Documentos", message: friendlyMsg });
              }
            }
            continue;
          }

          const label = FIELD_LABELS[key] || key;
          const stepIndex = FIELD_STEP[key] ?? 0;
          const message = messages.join(". ");
          items.push({ stepIndex, label, message });
          if (key in defaultValues) {
            form.setError(key as keyof LeadFormValues, { type: "server", message });
          }
        }

        const firstStep = items.length > 0 ? Math.min(...items.map((i) => i.stepIndex)) : step;
        setStep(firstStep);
        setSubmissionErrors({ items, documentErrors });

        toast({
          title: "Corrija os itens indicados",
          description: "O formulário permanece aberto. Veja a lista abaixo e em cada campo.",
          variant: "destructive",
        });
        return;
      }
      const validation = data.document_validation;
      const statusFinal = validation?.status_final;
      const desc =
        statusFinal === "aprovado"
          ? "Seus dados e documentos foram aprovados. Em breve entraremos em contato."
          : statusFinal === "necessita_revisao_manual"
            ? "Seus dados foram registrados. Nossa equipe irá conferir os documentos e entrará em contato."
            : "Seus dados foram registrados. Em breve entraremos em contato.";
      toast({ title: "Enviado!", description: desc });
      await clearRemoteProgress();
      const newSessionId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `lead-${Date.now()}`;
      window.localStorage.setItem(FORM_SESSION_STORAGE_KEY, newSessionId);
      setSessionId(newSessionId);
      form.reset(defaultValues);
      setFiles({});
      setStep(0);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      void persistProgress(step);
      setStep((s) => s + 1);
    }
    else form.handleSubmit(onSubmit)();
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col gap-0 overflow-hidden p-0" aria-describedby="lead-form-description">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-2 border-b">
          <DialogTitle className="text-xl font-headline font-bold text-primary">
            {STEPS[step].title} ({step + 1}/{STEPS.length})
          </DialogTitle>
          <DialogDescription id="lead-form-description" className="sr-only">
            Formulário de captação de leads em {STEPS.length} etapas. Preencha seus dados para solicitar economia na conta de luz.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col flex-1 min-h-0">
            <div className="overflow-y-auto flex-1 min-h-0 px-6 py-4 space-y-4">
              {submissionErrors && submissionErrors.items.length > 0 && (
                <Alert variant="destructive" className="mb-2">
                  <AlertTitle>Corrija os itens abaixo para continuar</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                      {submissionErrors.items.map((item, i) => (
                        <li key={i}>
                          <strong>{item.label}:</strong> {item.message}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              {/* 1.1 Landing */}
              {step === 0 && (
                <>
                  <p className="text-muted-foreground text-sm">Verifique sua economia</p>
                  <FormField
                    control={form.control}
                    name="cep_landing"
                    rules={{ required: "CEP é obrigatório", minLength: { value: 9, message: "CEP inválido" } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00000-000"
                            {...field}
                            onChange={(e) => {
                              const masked = maskCep(e.target.value);
                              field.onChange(masked);
                              form.setValue("cep", masked);
                              fillAddressFromCep(masked);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valor_conta"
                    rules={{ required: "Valor da conta é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor da conta</FormLabel>
                        <FormControl>
                          <Input placeholder="0,00" {...field} onChange={(e) => field.onChange(maskCurrency(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* 1.2 Cadastro pessoal */}
              {step === 1 && (
                <>
                  <p className="text-muted-foreground text-sm">Cadastro pessoal</p>
                  <FormField
                    control={form.control}
                    name="document_number"
                    rules={{ required: "CPF ou CNPJ é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF ou CNPJ</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000-00" {...field} onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Nome completo é obrigatório", minLength: 2 }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl><Input placeholder="Seu nome" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birth_date"
                    rules={{ required: "Data de nascimento é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de nascimento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="dd/mm/aaaa"
                            inputMode="numeric"
                            {...field}
                            onChange={(e) => field.onChange(maskBirthDate(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "WhatsApp é obrigatório", minLength: 14 }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do seu WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} onChange={(e) => field.onChange(maskPhone(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_confirm"
                    rules={{ required: "Confirme seu celular" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirme seu celular</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} onChange={(e) => field.onChange(maskPhone(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "E-mail é obrigatório", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email_confirm"
                    rules={{ required: "Confirme seu E-mail" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirme seu E-mail</FormLabel>
                        <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* 1.3 Endereço */}
              {step === 2 && (
                <>
                  <p className="text-muted-foreground text-sm">Endereço</p>
                  <FormField
                    control={form.control}
                    name="cep"
                    rules={{ required: "CEP é obrigatório", minLength: 9 }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00000-000"
                            {...field}
                            onChange={(e) => {
                              const masked = maskCep(e.target.value);
                              field.onChange(masked);
                              fillAddressFromCep(masked);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    rules={{ required: "Endereço é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl><Input placeholder="Rua, avenida..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="number"
                    rules={{ required: "Número é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl><Input placeholder="Nº" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    rules={{ required: "Bairro é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    rules={{ required: "Cidade é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    rules={{ required: "Estado é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {UFS.map((uf) => (
                              <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento (opcional)</FormLabel>
                        <FormControl><Input placeholder="Apto, bloco..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* 1.4 Energia e documento */}
              {step === 3 && (
                <>
                  <p className="text-muted-foreground text-sm">Energia e documento</p>
                  <FormField
                    control={form.control}
                    name="power_company"
                    rules={{ required: "Distribuidora de energia é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distribuidora de energia</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder={
                                loadingDistribuidoras
                                  ? "Carregando distribuidoras..."
                                  : "Digite o nome da distribuidora"
                              }
                              autoComplete="off"
                              onFocus={() => setShowDistribuidoraSuggestions(true)}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setShowDistribuidoraSuggestions(true);
                              }}
                            />
                            {showDistribuidoraSuggestions && !loadingDistribuidoras && distribuidoras.length > 0 && (
                              <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                                {distribuidoras
                                  .filter((d) =>
                                    !field.value
                                      ? true
                                      : d.SigAgente.toLowerCase().includes(field.value.toLowerCase())
                                  )
                                  .slice(0, 30)
                                  .map((d) => (
                                    <button
                                      type="button"
                                      key={`${d.SigAgente}-${d.NumCNPJDistribuidora}`}
                                      className="flex w-full items-center justify-between px-3 py-1.5 text-sm hover:bg-muted text-left"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        form.setValue("power_company", d.SigAgente);
                                        setShowDistribuidoraSuggestions(false);
                                      }}
                                    >
                                      <span className="truncate">{d.SigAgente}</span>
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        {formatCnpj(d.NumCNPJDistribuidora)}
                                      </span>
                                    </button>
                                  ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        {distribuidorasError && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {distribuidorasError}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installation_number"
                    rules={{ required: "Número da instalação é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da instalação</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="document_type"
                    rules={{ required: "Tipo de documento é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo documento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIPO_DOC.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FileUploadField
                    label="Documento pessoal – Frente (obrigatório)"
                    description="Envie uma foto nítida da frente do documento (RG ou CNH). Será validado automaticamente."
                    accept="image/*"
                    file={files.document_front}
                    onChange={(file) => {
                      setFiles((f) => ({ ...f, document_front: file }));
                      setSubmissionErrors((e) => e ? { ...e, documentErrors: { ...e.documentErrors, document_front: [] } } : null);
                    }}
                    errors={submissionErrors?.documentErrors?.document_front}
                    requirement="Foto nítida da frente do RG ou da CNH; nome e número do documento devem estar legíveis."
                  />
                  <FileUploadField
                    label="Documento pessoal – Verso (obrigatório)"
                    description="Envie uma foto nítida do verso do RG. Será validado automaticamente."
                    accept="image/*"
                    file={files.document_back}
                    onChange={(file) => {
                      setFiles((f) => ({ ...f, document_back: file }));
                      setSubmissionErrors((e) => e ? { ...e, documentErrors: { ...e.documentErrors, document_back: [] } } : null);
                    }}
                    errors={submissionErrors?.documentErrors?.document_back}
                    requirement="Foto nítida do verso do RG (se for CNH, este campo pode não ser obrigatório)."
                  />
                </>
              )}

              {/* 1.5 Procurador e conta */}
              {step === 4 && (
                <>
                  <p className="text-muted-foreground text-sm">Procurador e conta de energia</p>
                  <FormField
                    control={form.control}
                    name="energy_bill_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha do arquivo (opcional)</FormLabel>
                        <FormControl><Input type="password" placeholder="Senha do PDF" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FileUploadField
                    label="Faça o anexo da sua conta de energia"
                    description="Envie a conta recente em PDF ou imagem."
                    accept="application/pdf,image/*"
                    file={files.energy_bill}
                    onChange={(file) => {
                      setFiles((f) => ({ ...f, energy_bill: file }));
                      setSubmissionErrors((e) => e ? { ...e, documentErrors: { ...e.documentErrors, energy_bill: [] } } : null);
                    }}
                    errors={submissionErrors?.documentErrors?.energy_bill}
                    requirement="Conta de luz recente (até 90 dias); deve conter nome da distribuidora e valor."
                  />
                  <FormField
                    control={form.control}
                    name="has_pending_debts"
                    rules={{ required: "Informe se possui débitos" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Possui débitos em aberto?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value !== "sim") {
                                setFiles((f) => ({ ...f, payment_proof: undefined }));
                              }
                            }}
                            value={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="sim" id="m-deb-sim" />
                              <Label htmlFor="m-deb-sim">Sim</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="nao" id="m-deb-nao" />
                              <Label htmlFor="m-deb-nao">Não</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchHasPendingDebts === "sim" && (
                    <FileUploadField
                      label="Anexe o comprovante de pagamento (se débitos em aberto)"
                      description="Envie o comprovante em PDF ou imagem."
                      accept="application/pdf,image/png,image/jpeg,image/jpg"
                      file={files.payment_proof}
                      onChange={(file) => setFiles((f) => ({ ...f, payment_proof: file }))}
                    />
                  )}
                </>
              )}

              {/* 1.6 Finalizar */}
              {step === 5 && (
                <p className="text-muted-foreground text-sm">
                  Ao clicar em Finalizar, seus dados e documentos serão enviados. Os documentos serão validados automaticamente (frente/verso, legibilidade e correspondência com seus dados). Em seguida nossa equipe entrará em contato.
                </p>
              )}
            </div>

            {/* Footer com setas */}
            <div className="flex-shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t bg-muted/30">
              {isFirst ? (
                <span />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={back}
                  className="gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
              )}
              {isLast ? (
                <Button
                  type="button"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={submitting}
                  className="gap-1.5 bg-primary"
                >
                  {submitting ? "Enviando..." : "Finalizar"}
                </Button>
              ) : (
                <Button type="button" onClick={next} className="gap-1.5 bg-primary">
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
