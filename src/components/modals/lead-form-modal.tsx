"use client";

import React, { useState, useCallback } from "react";
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
import { maskCep, maskPhone, maskCpfCnpj, maskCurrency, maskBirthDate } from "@/lib/masks";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const DISTRIBUIDORAS = [
  "CPFL", "CPFL Piratininga", "CPFL Santa Cruz", "Cemig", "Equatorial",
  "Enel", "Neoenergia", "Outra",
];

const TIPO_DOC = ["RG (Novo)", "RG (Antigo)", "CNH"];

const STEPS = [
  { id: "landing", title: "Entrada" },
  { id: "cadastro", title: "Cadastro pessoal" },
  { id: "endereco", title: "Endereço" },
  { id: "energia", title: "Energia e documento" },
  { id: "procurador", title: "Procurador e conta" },
  { id: "final", title: "Finalizar" },
];

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
}) {
  const { label, description, accept, file, onChange } = props;
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <label
          htmlFor={id}
          className="flex items-center justify-between rounded-md border border-dashed border-muted-foreground/30 px-3 py-2 text-sm cursor-pointer hover:bg-muted/60 transition-colors"
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
    </FormItem>
  );
}

export function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{
    document_front?: File;
    document_back?: File;
    energy_bill?: File;
    payment_proof?: File;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<LeadFormValues>({ defaultValues });
  const watchHasPendingDebts = form.watch("has_pending_debts");

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
    setSubmitting(true);
    try {
      const fd = buildFormData();
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const details = data.details;
        const message = details && typeof details === "object"
          ? Object.values(details).flat().filter(Boolean).join(". ") || data.error
          : (data.error || "Falha ao enviar.");
        toast({ title: "Erro de validação", description: message, variant: "destructive" });
        return;
      }
      toast({ title: "Enviado!", description: "Seus dados foram registrados. Em breve entraremos em contato." });
      form.reset(defaultValues);
      setFiles({});
      setStep(0);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DISTRIBUIDORAS.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    description="Envie uma foto ou PDF nítido do documento."
                    accept="image/*,application/pdf"
                    file={files.document_front}
                    onChange={(file) => setFiles((f) => ({ ...f, document_front: file }))}
                  />
                  <FileUploadField
                    label="Documento pessoal – Verso (obrigatório)"
                    description="Envie uma foto ou PDF nítido do verso."
                    accept="image/*,application/pdf"
                    file={files.document_back}
                    onChange={(file) => setFiles((f) => ({ ...f, document_back: file }))}
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
                    onChange={(file) => setFiles((f) => ({ ...f, energy_bill: file }))}
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
                  Ao clicar em Finalizar, seus dados serão enviados e nossa equipe entrará em contato.
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
