/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Scroll lock effect: blocks background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Por favor, insira a senha.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data.token);
        setPassword('');
      } else {
        const data = await response.json();
        setError(data.error || 'Senha incorreta. Tente novamente.');
      }
    } catch (err) {
      setError('Erro de conexão. Verifique se o servidor está online.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative bg-slate-900 border border-gold-400/30 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500" />

        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold-400/10 border border-gold-400/20 text-gold-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-base font-extrabold tracking-widest text-white uppercase">
                Painel <span className="text-gold-300">Restrito</span>
              </h3>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider mt-0.5">AUTENTICAÇÃO EXIGIDA</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-display text-base font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <span>Área do Barbeiro</span>
              <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            </h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Insira a chave de acesso administrativa para gerenciar agendamentos, atualizar serviços e editar o portfólio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha do admin..."
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-white focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 flex items-start gap-2 text-xs text-red-400 font-semibold"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase rounded-xl hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-gold-500/10 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? 'Autenticando...' : 'ENTRAR NO PAINEL'}</span>
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 text-center text-[10px] font-mono text-slate-500 border-t border-slate-800">
          Chave padrão definida em configurações do servidor (.env)
        </div>
      </motion.div>
    </div>
  );
}
