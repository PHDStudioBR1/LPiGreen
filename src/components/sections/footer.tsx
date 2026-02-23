"use client"

import React from 'react';
import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">iG</span>
              </div>
              <span className="font-headline font-bold text-xl text-white">iGreen Energy</span>
            </div>
            <p className="text-sm leading-relaxed">
              Transformando a forma como o brasileiro consome energia, levando economia e sustentabilidade para todos os lares e empresas.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade (LGPD)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contrato de Adesão</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lei 14.300/2022</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Empresa</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nossas Usinas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seja um Licenciado</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fale Conosco</a></li>
            </ul>
          </div>

          <div className="space-y-6">
             <h4 className="text-white font-bold uppercase tracking-widest text-xs">Selo de Qualidade</h4>
             <div className="border border-white/10 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] leading-tight opacity-60">
                  Em conformidade com a Resolução Normativa nº 1.000 da ANEEL e a Lei Federal 14.300/2022.
                </p>
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-white/10 rounded-lg" />
                  <div className="w-10 h-10 bg-white/10 rounded-lg" />
                </div>
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs">
          <p>© {new Date().getFullYear()} iGreen Energy Brasil. Todos os direitos reservados. CNPJ: 00.000.000/0000-00</p>
        </div>
      </div>
    </footer>
  );
}
