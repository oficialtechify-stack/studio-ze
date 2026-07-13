/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Service } from '../types.js';
import { Sparkles, Calendar, Clock, ChevronRight } from 'lucide-react';

interface ServicesProps {
  services: Service[];
  onSelectService: (service: Service) => void;
  isAdminMode?: boolean;
  onOpenAdminPanel?: () => void;
}

export default function Services({ services, onSelectService, isAdminMode, onOpenAdminPanel }: ServicesProps) {
  // Categorize services
  const popularServices = services.filter(s => s.category === 'popular');
  const avulsoServices = services.filter(s => s.category === 'avulso');
  const comboServices = services.filter(s => s.category === 'combo');

  const renderServiceCard = (service: Service) => (
    <motion.div
      key={service.id}
      whileHover={{ y: -3, borderColor: 'rgba(181, 131, 25, 0.4)' }}
      className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:bg-slate-900/60 transition-all group"
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h4 className="font-display text-base font-bold text-white tracking-wide group-hover:text-gold-300 transition-colors">
            {service.name}
          </h4>
          <span className="font-mono text-base font-extrabold text-gold-300 shrink-0">
            R$ {service.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <p className="text-xs text-slate-400 font-light leading-relaxed min-h-[40px]">
          {service.description || 'Nenhuma descrição fornecida.'}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-gold-400" />
          <span>{service.duration}</span>
        </div>
        <button
          onClick={() => onSelectService(service)}
          className="flex items-center gap-1 bg-slate-950 hover:bg-gold-400 hover:text-slate-950 text-gold-300 text-xs font-bold px-4 py-2 rounded-lg border border-gold-400/20 hover:border-gold-400/50 transition-all cursor-pointer"
        >
          <span>Reservar</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <section id="servicos" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-gold-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-gold-400 font-bold">Nossa Tabela</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-widest text-white uppercase">
            Serviços & <span className="text-gold-300">Preços</span>
          </h2>
          <div className="h-[2px] w-20 bg-gold-400 mx-auto" />
          <p className="text-sm text-slate-400 font-light">
            Selecione o serviço ideal para você e agende seu horário com facilidade. Cuidamos do seu estilo com produtos de altíssima qualidade.
          </p>
          {isAdminMode && (
            <button 
              onClick={onOpenAdminPanel}
              className="mt-2 text-xs bg-gold-400/10 border border-gold-400/30 text-gold-300 px-3 py-1 rounded-full hover:bg-gold-400/20 transition-all"
            >
              ⚙️ Você está no modo Admin. Clique para ajustar preços.
            </button>
          )}
        </div>

        {/* Categories Layout */}
        <div className="space-y-16">
          
          {/* Popular Combos (Top) */}
          {popularServices.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-gold-400/10 text-gold-400 border border-gold-400/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-display text-lg font-bold text-white tracking-widest uppercase">
                  Serviços Populares
                </h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularServices.map(renderServiceCard)}
              </div>
            </div>
          )}

          {/* Avulsos (A la carte) */}
          {avulsoServices.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-gold-400/10 text-gold-400 border border-gold-400/20">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-display text-lg font-bold text-white tracking-widest uppercase">
                  Serviços Avulsos
                </h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {avulsoServices.map(renderServiceCard)}
              </div>
            </div>
          )}

          {/* Combos */}
          {comboServices.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-gold-400/10 text-gold-400 border border-gold-400/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-display text-lg font-bold text-white tracking-widest uppercase">
                  Combos Promocionais
                </h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comboServices.map(renderServiceCard)}
              </div>
            </div>
          )}

        </div>

        {/* Quality Banner */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 text-center flex flex-col md:flex-row md:items-center md:justify-between gap-6 max-w-4xl mx-auto">
          <div className="text-left space-y-1">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cabelo, Barba e Bigode Completo?</h4>
            <p className="text-xs text-slate-400 font-light">Selecione o combo supremo para obter descontos exclusivos e atendimento completo de alto padrão.</p>
          </div>
          <button
            onClick={() => onSelectService(services[0] || services[4])}
            className="bg-gold-400 hover:bg-gold-500 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition-all tracking-wider uppercase shrink-0 cursor-pointer"
          >
            Agendar Agora
          </button>
        </div>

      </div>
    </section>
  );
}
