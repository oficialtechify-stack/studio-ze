/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Testimonial } from '../types.js';
import { Star, MessageSquare, Quote, PenTool, CheckCircle, Award } from 'lucide-react';

interface TestimonialsProps {
  testimonials: Testimonial[];
  onSubmitReview: (name: string, rating: number, text: string, serviceName: string) => Promise<boolean>;
}

export default function Testimonials({ testimonials, onSubmitReview }: TestimonialsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState('');
  const [formService, setFormService] = useState('Corte + Barba');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formText) return;

    setIsSubmitting(true);
    const success = await onSubmitReview(formName, formRating, formText, formService);
    setIsSubmitting(false);

    if (success) {
      setSubmitSuccess(true);
      setFormName('');
      setFormText('');
      setFormRating(5);
      
      // Close success screen after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowReviewForm(false);
      }, 3000);
    }
  };

  return (
    <section id="depoimentos" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-gold-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-gold-400 font-bold">Feedback dos Clientes</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-widest text-white uppercase">
            Depoimentos & <span className="text-gold-300">Avaliações</span>
          </h2>
          <div className="h-[2px] w-20 bg-gold-400 mx-auto" />
          <p className="text-sm text-slate-400 font-light">
            Veja o que dizem aqueles que confiam o visual no Studio Zé Barber. Mantemos a nossa reputação impecável através de muita dedicação e respeito a cada traço.
          </p>
        </div>

        {/* Booksy Stats & Call to Review Banner */}
        <div className="grid md:grid-cols-12 gap-8 items-center mb-16">
          {/* Big rating card */}
          <div className="md:col-span-4 bg-slate-900/40 border border-gold-400/20 rounded-2xl p-6 text-center space-y-4">
            <h4 className="text-xs font-mono tracking-wider text-slate-400 uppercase">Pontuação Booksy</h4>
            <div className="space-y-1">
              <span className="font-display text-5xl font-black text-white">5.0</span>
              <div className="flex justify-center text-amber-400 py-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-400 font-mono">142 avaliações verificadas</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Atendimento</span>
                <span className="text-gold-300 font-bold">100%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                <span>Espaço</span>
                <span className="text-gold-300 font-bold">100%</span>
              </div>
            </div>
          </div>

          {/* Slogan and Action Banner */}
          <div className="md:col-span-8 space-y-4 text-left p-6 rounded-2xl bg-slate-900/20 border border-slate-800">
            <div className="flex items-center gap-2 text-gold-300">
              <Award className="w-5 h-5" />
              <h4 className="font-display font-bold text-sm tracking-widest uppercase">Trabalho Consistente de Artista</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Nossa missão é fazer com que cada visita ao estúdio seja relaxante e revigorante. Sinta-se à vontade para compartilhar sua própria experiência com o nosso serviço de barbearia!
            </p>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-gold-300 font-bold text-xs tracking-wider border border-gold-400/30 hover:border-gold-400/50 transition-all cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>{showReviewForm ? 'FECHAR FORMULÁRIO' : 'DEIXAR MINHA AVALIAÇÃO'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Review Submission Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-16"
            >
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-gold-400/20 max-w-2xl mx-auto shadow-xl space-y-6">
                <h3 className="font-display text-lg font-bold text-white tracking-widest uppercase text-center flex items-center justify-center gap-2">
                  <PenTool className="w-4 h-4 text-gold-400" />
                  <span>Escrever Depoimento</span>
                </h3>

                {submitSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="py-12 text-center space-y-3 flex flex-col items-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-500 animate-[bounce_1s_infinite]" />
                    <h4 className="font-bold text-white text-base">Avaliação Enviada!</h4>
                    <p className="text-xs text-slate-400 font-light">Muito obrigado pelo seu carinho e feedback. Nos vemos no próximo corte!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Seu Nome</label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Ex: Carlos Silva"
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-white focus:outline-none transition-colors"
                        />
                      </div>
                      
                      {/* Service select */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Serviço Realizado</label>
                        <select
                          value={formService}
                          onChange={(e) => setFormService(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-slate-300 focus:outline-none transition-colors"
                        >
                          <option value="Corte">Corte</option>
                          <option value="Corte + Barba">Corte + Barba</option>
                          <option value="Corte + Sobrancelhas">Corte + Sobrancelhas</option>
                          <option value="Corte + Barba + Sobrancelhas">Combo Supremo</option>
                          <option value="Barba">Barba</option>
                        </select>
                      </div>
                    </div>

                    {/* Rating Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">Sua Nota</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormRating(star)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star 
                              className={`w-6 h-6 ${
                                star <= formRating 
                                  ? 'text-amber-400 fill-current' 
                                  : 'text-slate-700'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial text */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Depoimento</label>
                      <textarea
                        required
                        rows={3}
                        value={formText}
                        onChange={(e) => setFormText(e.target.value)}
                        placeholder="Escreva como foi o atendimento, o corte, o espaço..."
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-white focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-extrabold text-sm tracking-wider uppercase rounded-xl hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer"
                    >
                      {isSubmitting ? 'Enviando...' : 'ENVIAR DEPOIMENTO'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonials List Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.1, 0.5) }}
              className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between hover:border-slate-750 transition-colors"
            >
              {/* Quote marks */}
              <Quote className="absolute top-5 right-5 w-8 h-8 text-slate-800 pointer-events-none" />

              <div className="space-y-4">
                {/* Rating & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'fill-current' : 'text-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{testimonial.date}</span>
                </div>

                {/* Testimonial text */}
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>

              {/* Client Info details */}
              <div className="flex items-center gap-3 pt-5 mt-5 border-t border-slate-800">
                {/* Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-gold-400/30 flex items-center justify-center text-gold-300 font-bold font-display text-sm">
                  {testimonial.clientName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">{testimonial.clientName}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-mono text-slate-400">
                    <CheckCircle className="w-3 h-3 text-gold-400 shrink-0" />
                    <span className="truncate">Serviço: {testimonial.serviceName || 'Corte'}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
