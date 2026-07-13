/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Scissors, ShieldAlert, Calendar, Menu, X, Landmark, Crown } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
  onToggleAdmin: () => void;
  isAdminOpen: boolean;
}

export default function Header({ onOpenBooking, onToggleAdmin, isAdminOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-gold-500/20 shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-gold-400/50 group overflow-hidden">
              <span className="font-display text-lg font-bold text-gold-300 tracking-tighter">ZB</span>
              <div className="absolute inset-0 bg-gold-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-white to-blue-600 animate-[pulse_1.5s_infinite]" />
            </div>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-extrabold tracking-widest text-white leading-none">
                STUDIO ZÉ <span className="text-gold-300">BARBER</span>
              </h1>
              <p className="text-[9px] text-slate-400 tracking-[0.25em] uppercase font-mono mt-0.5">Estilo e Tradição</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-sm font-medium text-slate-300 hover:text-gold-300 transition-colors uppercase tracking-wider"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('servicos')} 
              className="text-sm font-medium text-slate-300 hover:text-gold-300 transition-colors uppercase tracking-wider"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('portfolio')} 
              className="text-sm font-medium text-slate-300 hover:text-gold-300 transition-colors uppercase tracking-wider"
            >
              Portfólio
            </button>
            <button 
              onClick={() => scrollToSection('depoimentos')} 
              className="text-sm font-medium text-slate-300 hover:text-gold-300 transition-colors uppercase tracking-wider"
            >
              Avaliações
            </button>
          </nav>

          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Toggle Admin */}
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold tracking-wider uppercase transition-all ${
                isAdminOpen 
                  ? 'bg-red-950/50 border-red-500/50 text-red-300 hover:bg-red-900/50' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-gold-300 hover:border-gold-500/40'
              }`}
              title="Área Administrativa"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{isAdminOpen ? 'Sair Admin' : 'Admin'}</span>
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenBooking}
              className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-gold-500/10 hover:shadow-gold-500/20 transition-all border border-gold-300/30"
            >
              <Calendar className="w-4 h-4" />
              <span>AGENDAR ONLINE</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={onToggleAdmin}
              className={`p-2 rounded-lg border ${
                isAdminOpen 
                  ? 'bg-red-950/50 border-red-500/50 text-red-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Crown className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-gold-300 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-slate-950 border-b border-gold-500/20 py-4 px-4 space-y-3 shadow-xl"
        >
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-gold-300 transition-all text-sm font-medium uppercase tracking-wider"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('servicos')} 
              className="text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-gold-300 transition-all text-sm font-medium uppercase tracking-wider"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('portfolio')} 
              className="text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-gold-300 transition-all text-sm font-medium uppercase tracking-wider"
            >
              Portfólio
            </button>
            <button 
              onClick={() => scrollToSection('depoimentos')} 
              className="text-left py-2 px-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-gold-300 transition-all text-sm font-medium uppercase tracking-wider"
            >
              Avaliações
            </button>
          </div>
          <div className="pt-2 border-t border-slate-900">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 py-3 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Online</span>
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
