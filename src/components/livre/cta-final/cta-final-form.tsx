"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, FileUp, ShieldCheck, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LivreForm,
  LivreFormControl,
  LivreFormField,
  LivreFormItem,
  LivreFormLabel,
  LivreFormMessage,
  LivreInput,
  LivreSelect,
  LivreSelectContent,
  LivreSelectItem,
  LivreSelectTrigger,
  LivreSelectValue,
} from "@/components/livre/ui/form";
import { LivreButton } from "@/components/livre/ui/button";
import { maskPhone } from "@/lib/masks";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formSchema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  empresa: z.string().min(2, "Informe o nome da empresa"),
  telefone: z.string().min(14, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  cidade: z.string().min(2, "Informe a cidade"),
  estado: z.string().min(2, "Selecione o estado"),
  fatura: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Envie sua fatura de energia",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, "Arquivo deve ter no máximo 10 MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Formato aceito: PDF, JPG ou PNG"
    ),
  lgpd: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos para continuar",
  }),
});

type CtaFinalFormValues = z.infer<typeof formSchema>;

const defaultValues = {
  nome: "",
  empresa: "",
  telefone: "",
  email: "",
  cidade: "",
  estado: "",
  lgpd: false,
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CtaFinalForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CtaFinalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedFile = form.watch("fatura");

  function handleFileSelect(file: File | undefined) {
    if (!file) return;
    form.setValue("fatura", file, { shouldValidate: true, shouldDirty: true });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  }

  async function onSubmit(values: CtaFinalFormValues) {
    setIsSubmitting(true);
    try {
      // Integração com backend pode ser adicionada aqui
      console.log("CTA Final — lead recebido:", {
        ...values,
        fatura: values.fatura.name,
      });

      toast({
        title: "Fatura enviada com sucesso!",
        description: "Em breve um especialista entrará em contato com sua simulação gratuita.",
      });

      form.reset(defaultValues);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente em instantes ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="livre-cta-form-border relative">
      <div className="livre-cta-form-glow livre-glass-strong relative rounded-lv-2xl p-6 sm:p-8 lg:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-livre-primary/15 text-livre-primary">
            <FileUp className="size-5" aria-hidden />
          </div>
          <div>
            <p className="font-lv-headline text-sm font-semibold text-livre-text">
              Simulação gratuita
            </p>
            <p className="text-xs text-livre-muted">Preencha em menos de 2 minutos</p>
          </div>
        </div>

        <LivreForm {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
            aria-label="Formulário de simulação gratuita"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <LivreFormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <LivreFormItem className="sm:col-span-2">
                    <LivreFormLabel>Empresa</LivreFormLabel>
                    <LivreFormControl>
                      <LivreInput placeholder="Nome da empresa" autoComplete="organization" {...field} />
                    </LivreFormControl>
                    <LivreFormMessage />
                  </LivreFormItem>
                )}
              />

              <LivreFormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <LivreFormItem>
                    <LivreFormLabel>Telefone</LivreFormLabel>
                    <LivreFormControl>
                      <LivreInput
                        placeholder="(00) 00000-0000"
                        inputMode="tel"
                        autoComplete="tel"
                        {...field}
                        onChange={(e) => field.onChange(maskPhone(e.target.value))}
                      />
                    </LivreFormControl>
                    <LivreFormMessage />
                  </LivreFormItem>
                )}
              />

              <LivreFormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <LivreFormItem>
                    <LivreFormLabel>Email</LivreFormLabel>
                    <LivreFormControl>
                      <LivreInput
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        {...field}
                      />
                    </LivreFormControl>
                    <LivreFormMessage />
                  </LivreFormItem>
                )}
              />

              <LivreFormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <LivreFormItem className="sm:col-span-2">
                    <LivreFormLabel>Nome</LivreFormLabel>
                    <LivreFormControl>
                      <LivreInput placeholder="Seu nome completo" autoComplete="name" {...field} />
                    </LivreFormControl>
                    <LivreFormMessage />
                  </LivreFormItem>
                )}
              />

              <LivreFormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <LivreFormItem>
                    <LivreFormLabel>Cidade</LivreFormLabel>
                    <LivreFormControl>
                      <LivreInput placeholder="Sua cidade" autoComplete="address-level2" {...field} />
                    </LivreFormControl>
                    <LivreFormMessage />
                  </LivreFormItem>
                )}
              />

              <LivreFormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <LivreFormItem>
                    <LivreFormLabel>Estado</LivreFormLabel>
                    <LivreSelect onValueChange={field.onChange} value={field.value}>
                      <LivreFormControl>
                        <LivreSelectTrigger>
                          <LivreSelectValue placeholder="UF" />
                        </LivreSelectTrigger>
                      </LivreFormControl>
                      <LivreSelectContent>
                        {BRAZILIAN_STATES.map((uf) => (
                          <LivreSelectItem key={uf} value={uf}>
                            {uf}
                          </LivreSelectItem>
                        ))}
                      </LivreSelectContent>
                    </LivreSelect>
                    <LivreFormMessage />
                  </LivreFormItem>
                )}
              />
            </div>

            <LivreFormField
              control={form.control}
              name="fatura"
              render={() => (
                <LivreFormItem>
                  <LivreFormLabel htmlFor="livre-fatura-upload">Upload da Fatura</LivreFormLabel>
                  <LivreFormControl>
                    <label
                      htmlFor="livre-fatura-upload"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "group relative block cursor-pointer rounded-lv-lg border-2 border-dashed px-5 py-8 text-center transition-all duration-300",
                        isDragging
                          ? "border-livre-primary bg-livre-primary/10 shadow-lv-glow"
                          : "border-livre-petrol-500 bg-livre-bg-surface/50 hover:border-livre-primary/60 hover:bg-livre-primary/5",
                        form.formState.errors.fatura && "border-livre-error/60"
                      )}
                    >
                      <input
                        id="livre-fatura-upload"
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="sr-only"
                        onChange={(e) => handleFileSelect(e.target.files?.[0])}
                      />

                      {selectedFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <CheckCircle2 className="size-6 shrink-0 text-livre-primary" aria-hidden />
                          <div className="text-left">
                            <p className="text-sm font-medium text-livre-text">{selectedFile.name}</p>
                            <p className="text-xs text-livre-muted">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              form.resetField("fatura");
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="ml-2 rounded-full p-1 text-livre-muted transition-colors hover:bg-white/10 hover:text-livre-text"
                            aria-label="Remover arquivo"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FileUp
                            className="mx-auto size-8 text-livre-primary/70 transition-transform duration-300 group-hover:scale-110"
                            aria-hidden
                          />
                          <p className="mt-3 text-sm font-medium text-livre-text">
                            Arraste sua fatura ou clique para enviar
                          </p>
                          <p className="mt-1 text-xs text-livre-muted">PDF, JPG ou PNG — máx. 10 MB</p>
                        </>
                      )}
                    </label>
                  </LivreFormControl>
                  <LivreFormMessage />
                </LivreFormItem>
              )}
            />

            <LivreFormField
              control={form.control}
              name="lgpd"
              render={({ field }) => (
                <LivreFormItem>
                  <div className="flex items-start gap-3 rounded-lv-md bg-livre-bg-surface/40 p-4">
                    <LivreFormControl>
                      <Checkbox
                        checked={field.value === true}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        className="mt-0.5 border-livre-petrol-500 data-[state=checked]:border-livre-primary data-[state=checked]:bg-livre-primary data-[state=checked]:text-livre-petrol-900"
                      />
                    </LivreFormControl>
                    <div className="space-y-1 leading-none">
                      <LivreFormLabel className="cursor-pointer text-sm font-normal leading-relaxed text-livre-muted">
                        Li e concordo com a{" "}
                        <Link
                          href="/livre/politicadeprivacidade"
                          className="text-livre-accent underline-offset-2 hover:underline"
                          target="_blank"
                        >
                          Política de Privacidade
                        </Link>{" "}
                        e autorizo o uso dos meus dados conforme a LGPD.
                      </LivreFormLabel>
                      <LivreFormMessage />
                    </div>
                  </div>
                </LivreFormItem>
              )}
            />

            <LivreButton
              type="submit"
              size="xl"
              fullWidth
              isLoading={isSubmitting}
              loadingText="Enviando..."
              rightIcon={ArrowRight}
              className="livre-cta-submit-btn h-16 text-base font-bold sm:text-lg"
            >
              Enviar Fatura para Simulação Gratuita
            </LivreButton>

            <p className="flex items-center justify-center gap-2 text-center text-xs text-livre-muted">
              <ShieldCheck className="size-3.5 shrink-0 text-livre-primary" aria-hidden />
              Seus dados estão protegidos e não serão compartilhados com terceiros.
            </p>
          </form>
        </LivreForm>
      </div>
    </div>
  );
}
