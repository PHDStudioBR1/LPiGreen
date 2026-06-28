"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useToast } from "@/hooks/use-toast";
import { maskCurrency, maskPhone, unmaskCurrency } from "@/lib/masks";
import { projectedAnnualSavingsFromMonthly } from "@/lib/conexao-green-savings";
import {
  trackHomeFormStep,
  trackHomeFormSubmit,
} from "@/lib/home/analytics";

/** Se definido, o browser envia direto ao n8n (URL pública). Caso contrário, usa o proxy em `/api/conexao-green/n8n` + `N8N_WEBHOOK_URL` no servidor. */
const NEXT_PUBLIC_N8N = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL?.trim() ?? "";
const SUBMIT_PATH = "/api/conexao-green/n8n";

export type ConexaoGreenQualificationValues = {
  name: string;
  whatsapp: string;
  valor_medio_fatura: string;
};

export interface ConexaoGreenQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Valor mensal simulado na landing (R$), para pré-preencher o campo da fatura */
  simulatedMonthlyBill: number;
}

function onlyDigitsPhone(masked: string): string {
  return masked.replace(/\D/g, "");
}

export function ConexaoGreenQualificationModal({
  isOpen,
  onClose,
  simulatedMonthlyBill,
}: ConexaoGreenQualificationModalProps) {
  const { toast } = useToast();
  const form = useForm<ConexaoGreenQualificationValues>({
    defaultValues: {
      name: "",
      whatsapp: "",
      valor_medio_fatura: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    const cents = Math.round(Math.max(0, simulatedMonthlyBill) * 100);
    const formatted = (cents / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    form.reset({
      name: "",
      whatsapp: "",
      valor_medio_fatura: formatted,
    });
  }, [isOpen, simulatedMonthlyBill, form]);

  const onSubmit = async (values: ConexaoGreenQualificationValues) => {
    const valorNum = unmaskCurrency(values.valor_medio_fatura || "0");
    if (valorNum <= 0) {
      form.setError("valor_medio_fatura", {
        type: "validate",
        message: "Informe um valor válido",
      });
      return;
    }

    const whatsappDigits = onlyDigitsPhone(values.whatsapp);
    const payload = {
      funil: "conexao_green",
      nome: values.name.trim(),
      whatsapp: values.whatsapp.trim(),
      whatsapp_apenas_numeros: whatsappDigits,
      valor_medio_fatura_mensal: valorNum,
      valor_medio_fatura_formatado: `R$ ${valorNum.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      poupanca_anual_projetada: projectedAnnualSavingsFromMonthly(valorNum),
      enviado_em: new Date().toISOString(),
    };

    const targetUrl = NEXT_PUBLIC_N8N || SUBMIT_PATH;
    const fetchInit: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    };
    if (NEXT_PUBLIC_N8N) {
      fetchInit.mode = "cors";
    }

    try {
      const res = await fetch(targetUrl, fetchInit);

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson && typeof errJson.error === "string") {
            detail = errJson.error;
          }
        } catch {
          /* ignore */
        }
        throw new Error(detail);
      }

      toast({
        title: "Recebemos seus dados",
        description:
          "Em instantes nosso time continua a conversa com você no WhatsApp — sem custo oculto e sem compromisso.",
      });
      trackHomeFormStep(1);
      trackHomeFormSubmit({ valor_medio_fatura: valorNum });
      onClose();
    } catch (e) {
      console.error("n8n webhook:", e);
      const msg =
        e instanceof Error && e.message
          ? e.message
          : "Verifique sua conexão e tente de novo em alguns segundos.";
      toast({
        title: "Não foi possível enviar agora",
        description: msg,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline font-bold text-primary">
            Conexão Green — começar é simples
          </DialogTitle>
          <DialogDescription className="text-left text-muted-foreground">
            Só precisamos de três informações para o atendimento automatizado no
            WhatsApp. Sem taxa de instalação, sem fidelidade.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Nome é obrigatório",
                minLength: { value: 2, message: "Digite seu nome" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      placeholder="Como podemos te chamar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              rules={{
                required: "WhatsApp é obrigatório",
                validate: (v) => {
                  const d = onlyDigitsPhone(v || "");
                  if (d.length < 10) return "Informe DDD + número com WhatsApp";
                  return true;
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(00) 00000-0000"
                      {...field}
                      onChange={(e) =>
                        field.onChange(maskPhone(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor_medio_fatura"
              rules={{ required: "Valor médio da fatura é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor médio da conta de luz (mês)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="decimal"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(maskCurrency(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full font-bold dark:text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Enviando…" : "Quero falar no WhatsApp"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Não enviamos e-mail de confirmação: o próximo passo é no WhatsApp,
              em segundos.
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
