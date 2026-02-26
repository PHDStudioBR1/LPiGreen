"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  cep: z.string().min(8, "CEP inválido"),
  billValue: z.string().min(1, "Valor médio é obrigatório"),
});

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EligibilityModal({ isOpen, onClose }: EligibilityModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      cep: "",
      billValue: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate Firebase integration
    console.log("Saving lead to Firestore:", values);
    
    // In a real app:
    // await addDoc(collection(db, "leads"), { ...values, createdAt: new Date() });

    toast({
      title: "Solicitação enviada!",
      description: "Em breve um especialista entrará em contato com você.",
    });
    
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-bold text-primary">Verifique se você está apto</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os dados abaixo. Em até 24h um especialista confirmará se sua região tem cobertura para economia na conta de luz (Conexão Green — sem investimento, sem fidelidade).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="00000-000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Médio Conta</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 350" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]">
              Quero fazer parte da maior transição energética do Brasil
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
