/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Clock, Phone, Instagram, Shield, Award, Sparkles } from 'lucide-react';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 relative overflow-hidden">
      
      {/* Background visual detail */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          
          {/* Column 1: Monogram & Description */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleScrollToTop}>
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-400/50 group overflow-hidden">
                <span className="font-display text-lg font-bold text-gold-300">ZB</span>
                <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-red-600 via-white to-blue-600" />
              </div>
              <div>
                <h3 className="font-display text-base font-extrabold tracking-widest text-white leading-none">
                  STUDIO ZÉ <span className="text-gold-300">BARBER</span>
                </h3>
                <p className="text-[9px] text-slate-400 tracking-[0.25em] uppercase font-mono mt-0.5">Estilo e Tradição</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm">
              Cada corte é único, eu te ajudo a encontrar o seu. Atendimento premium e especializado no coração de Jardim Piedade. Agende seu horário online!
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/studiozebarber"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-gold-300 hover:border-gold-500/30 transition-all"
                title="Instagram @studiozebarber"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="tel:+5581999999999"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-gold-300 hover:border-gold-500/30 transition-all"
                title="Telefone de Contato"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Working Hours details */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display text-sm font-bold text-white tracking-widest uppercase">
              Horários de <span className="text-gold-300">Funcionamento</span>
            </h4>
            <div className="h-[2px] w-12 bg-gold-400/60" />
            
            <ul className="space-y-2 text-xs text-slate-400 font-light">
              <li className="flex justify-between pb-1.5 border-b border-slate-900/60">
                <span>Terça a Sexta-feira</span>
                <span className="font-mono text-white font-semibold">09:00 - 12:30 / 14:00 - 20:00</span>
              </li>
              <li className="flex justify-between pb-1.5 border-b border-slate-900/60">
                <span>Sábado</span>
                <span className="font-mono text-white font-semibold">09:00 - 12:30 / 14:00 - 20:00</span>
              </li>
              <li className="flex justify-between text-red-400/80">
                <span>Domingo & Segunda-feira</span>
                <span className="font-semibold uppercase text-[10px] tracking-wider">Fechado</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details & Map Link */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display text-sm font-bold text-white tracking-widest uppercase">
              Onde <span className="text-gold-300">Estamos</span>
            </h4>
            <div className="h-[2px] w-12 bg-gold-400/60" />

            <div className="space-y-3.5 text-xs text-slate-400 font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Rua São Sebastião, 1077,<br />
                  Galeria Villa Center, Jardim Piedade,<br />
                  Jaboatão dos Guararapes - PE<br />
                  <span className="text-gold-300 font-semibold font-mono">CEP: 54410-500</span>
                </p>
              </div>

              {/* Quick Maps Action button */}
              <a
                href="https://maps.google.com/?q=Rua+São+Sebastião,+1077,+Galeria+Villa+Center,+Jardim+Piedade,+Jaboatão+dos+Guararapes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gold-300 hover:text-gold-400 font-bold transition-colors"
              >
                <span>Ver no Google Maps</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright notice bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <p>© {new Date().getFullYear()} Studio Zé Barber. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Desenvolvido com padrão Premium</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
