"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
import { maskCep, maskPhone, maskCpfCnpj, maskCurrency } from "@/lib/masks";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const DISTRIBUIDORAS = [
  "CPFL", "CPFL Piratininga", "CPFL Santa Cruz", "Cemig", "Equatorial",
  "Enel", "Neoenergia", "Outra",
];

const TIPO_DOC = ["RG (Novo)", "RG (Antigo)", "CNH"];

type FormValues = {
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
  discount_option: string;
  document_type: string;
  has_procurator: string;
  energy_bill_password: string;
  has_pending_debts: string;
};

const STEPS = [
  { id: "landing", title: "Entrada" },
  { id: "cadastro", title: "Cadastro pessoal" },
  { id: "endereco", title: "Endereço" },
  { id: "energia", title: "Energia e documento" },
  { id: "procurador", title: "Procurador e conta" },
  { id: "final", title: "Finalizar" },
];

export default function FormularioPage() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{
    document_front?: File;
    document_back?: File;
    energy_bill?: File;
    payment_proof?: File;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
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
      discount_option: "",
      document_type: "",
      has_procurator: "",
      energy_bill_password: "",
      has_pending_debts: "",
    },
  });

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

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
      const url = apiBase ? `${apiBase.replace(/\/$/, "")}/api/leads` : "/api/leads";
      const headers: HeadersInit = {};
      if (apiKey) headers["X-API-Key"] = apiKey;
      const res = await fetch(url, { method: "POST", body: fd, headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({ title: "Erro", description: data.error || data.details || "Falha ao enviar.", variant: "destructive" });
        return;
      }
      toast({ title: "Enviado!", description: "Seus dados foram registrados. Em breve entraremos em contato." });
      form.reset();
      setFiles({});
      setStep(0);
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else form.handleSubmit(onSubmit)();
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-primary font-headline font-bold text-lg">iGreen Energy</Link>
          <span className="text-sm text-muted-foreground">
            {STEPS[step].title} ({step + 1}/{STEPS.length})
          </span>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            {/* 1.1 Landing */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-headline font-bold">Verifique sua economia</h2>
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
                          onChange={(e) => field.onChange(maskCep(e.target.value))}
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
                        <Input
                          placeholder="0,00"
                          {...field}
                          onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={next} className="w-full">Calcular</Button>
              </div>
            )}

            {/* 1.2 Cadastro pessoal */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-headline font-bold">Cadastro pessoal</h2>
                <FormField
                  control={form.control}
                  name="document_number"
                  rules={{ required: "CPF ou CNPJ é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF ou CNPJ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          {...field}
                          onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                        />
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
                      <FormControl><Input type="date" {...field} /></FormControl>
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
                        <Input
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={(e) => field.onChange(maskPhone(e.target.value))}
                        />
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
                        <Input
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={(e) => field.onChange(maskPhone(e.target.value))}
                        />
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
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={back}>Voltar</Button>
                  <Button type="button" onClick={next} className="flex-1">Próximo</Button>
                </div>
              </div>
            )}

            {/* 1.3 Endereço */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-headline font-bold">Endereço</h2>
                <FormField
                  control={form.control}
                  name="cep"
                  rules={{ required: "CEP é obrigatório", minLength: 9 }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} onChange={(e) => field.onChange(maskCep(e.target.value))} />
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
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={back}>Voltar</Button>
                  <Button type="button" onClick={next} className="flex-1">Próximo</Button>
                </div>
              </div>
            )}

            {/* 1.4 Energia e documento */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-headline font-bold">Energia e documento</h2>
                <FormField
                  control={form.control}
                  name="power_company"
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
                  name="discount_option"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escolha a opção de desconto</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 flex-wrap">
                          {["8", "10", "12", "14"].map((pct) => (
                            <div key={pct} className="flex items-center gap-2">
                              <RadioGroupItem value={pct} id={`discount-${pct}`} />
                              <Label htmlFor={`discount-${pct}`}>{pct}%</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="document_type"
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
                <FormItem>
                  <FormLabel>Documento pessoal – Frente (obrigatório)</FormLabel>
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setFiles((f) => ({ ...f, document_front: e.target.files?.[0] }))}
                  />
                </FormItem>
                <FormItem>
                  <FormLabel>Documento pessoal – Verso (obrigatório)</FormLabel>
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setFiles((f) => ({ ...f, document_back: e.target.files?.[0] }))}
                  />
                </FormItem>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={back}>Voltar</Button>
                  <Button type="button" onClick={next} className="flex-1">Próximo</Button>
                </div>
              </div>
            )}

            {/* 1.5 Procurador e conta */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-headline font-bold">Procurador e conta de energia</h2>
                <FormField
                  control={form.control}
                  name="has_procurator"
                  rules={{ required: "Informe se possui procurador" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu cliente possui procurador?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="sim" id="proc-sim" />
                            <Label htmlFor="proc-sim">Sim</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="nao" id="proc-nao" />
                            <Label htmlFor="proc-nao">Não</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormItem>
                  <FormLabel>Faça o anexo da sua conta de energia</FormLabel>
                  <Input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => setFiles((f) => ({ ...f, energy_bill: e.target.files?.[0] }))}
                  />
                </FormItem>
                <FormField
                  control={form.control}
                  name="has_pending_debts"
                  rules={{ required: "Informe se possui débitos" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Possui débitos em aberto?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="sim" id="deb-sim" />
                            <Label htmlFor="deb-sim">Sim</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="nao" id="deb-nao" />
                            <Label htmlFor="deb-nao">Não</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Anexe o comprovante de pagamento (se débitos em aberto)</FormLabel>
                  <Input
                    type="file"
                    accept="application/pdf,image/png,image/jpeg,image/jpg"
                    onChange={(e) => setFiles((f) => ({ ...f, payment_proof: e.target.files?.[0] }))}
                  />
                </FormItem>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={back}>Voltar</Button>
                  <Button type="button" onClick={next} className="flex-1">Próximo</Button>
                </div>
              </div>
            )}

            {/* 1.6 Finalizar */}
            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-headline font-bold">Revise e finalize</h2>
                <p className="text-muted-foreground text-sm">Ao clicar em Finalizar, seus dados serão enviados e nossa equipe entrará em contato.</p>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={back}>Voltar</Button>
                  <Button type="button" onClick={() => form.handleSubmit(onSubmit)()} disabled={submitting} className="flex-1">
                    {submitting ? "Enviando..." : "Finalizar"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

