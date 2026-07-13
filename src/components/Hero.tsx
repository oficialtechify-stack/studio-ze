/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Phone, Star, Scissors, Award, Calendar } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onViewPortfolio: () => void;
}

export default function Hero({ onOpenBooking, onViewPortfolio }: HeroProps) {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      {/* Dynamic Animated Barber Pole Background Pattern */}
      <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 hidden lg:block pointer-events-none overflow-hidden select-none">
        <div 
          className="w-full h-full bg-repeat-y opacity-30" 
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #ef4444, #ef4444 40px, #ffffff 40px, #ffffff 80px, #3b82f6 80px, #3b82f6 120px, #ffffff 120px, #ffffff 160px)`,
            backgroundSize: '100% 320px',
            animation: 'barberPoleFlow 12s linear infinite'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Text (Left side) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Promo Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-semibold tracking-wider uppercase"
            >
              <Crown className="w-3.5 h-3.5 animate-pulse" />
              <span>Experiência Premium em Jaboatão</span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-widest leading-none">
                STUDIO ZÉ <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-300 to-gold-200">
                  BARBER
                </span>
              </h1>
            </motion.div>

            {/* Subtitle / Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 font-light max-w-xl italic leading-relaxed"
            >
              "Cada corte é único, eu te ajudo a encontrar o seu. Estilo, conforto e precisão na tesoura e navalha."
            </motion.p>

            {/* Interactive Stats Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-4 py-2 border-y border-slate-800 w-full max-w-lg"
            >
              <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-mono text-sm font-bold text-white">5.0</span>
                <span className="text-xs text-slate-400 font-light">(142 avaliações no Booksy)</span>
              </div>
              <div className="flex items-center gap-2 text-gold-300 text-xs font-medium uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Atendimento de Artista</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-extrabold text-base tracking-wide shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 hover:brightness-105 transition-all border border-gold-300/30 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>AGENDAR HORÁRIO</span>
              </button>
              <button
                onClick={onViewPortfolio}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-base tracking-wide border border-slate-800 hover:border-gold-500/30 transition-all cursor-pointer"
              >
                <Scissors className="w-4 h-4 text-gold-400" />
                <span>VER PORTFÓLIO</span>
              </button>
            </motion.div>

            {/* Fast info card (address and times) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid sm:grid-cols-2 gap-4 w-full max-w-lg pt-2 text-left"
            >
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Endereço</h4>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5 font-light">
                    Rua São Sebastião, 1077, Galeria Villa Center, Jaboatão dos Guararapes - PE
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Funcionamento</h4>
                  <p className="text-xs text-slate-400 leading-normal mt-0.5 font-light">
                    Terça a Sábado<br />
                    09:00 - 12:30 / 14:00 - 20:00
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right side illustration: Barber Pole Logo Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-sm aspect-square rounded-3xl bg-slate-900/80 border-2 border-gold-400/20 shadow-2xl p-8 flex flex-col items-center justify-between overflow-hidden group"
            >
              {/* Outer decoration corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold-400/40 rounded-tl-md" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold-400/40 rounded-tr-md" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold-400/40 rounded-bl-md" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold-400/40 rounded-br-md" />
              
              {/* Background circular glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gold-400/5 blur-3xl rounded-full" />

              {/* Top barber sign */}
              <div className="text-center">
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-400 font-bold">Tradição & Estilo</p>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-1" />
              </div>

              {/* Central Barber Pole Monogram */}
              <div className="relative my-6 select-none flex items-center justify-center">
                
                {/* Custom SVG Monogram with Rotating Barber Pole */}
                <svg className="w-56 h-56 text-white" viewBox="0 0 200 200">
                  {/* Left "Z" and Right "B" stylized letters matching the user's logo */}
                  <path d="M40,55 L105,55 L40,145 L105,145" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                  <path d="M125,55 C150,55 160,75 145,95 C165,115 150,145 125,145" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                  
                  {/* Glowing core background for the Barber Pole */}
                  <rect x="90" y="42" width="20" height="116" fill="#0f172a" rx="10" />
                  
                  {/* Decorative Metal Caps */}
                  <path d="M85,42 C85,25 115,25 115,42 Z" fill="#b58319" stroke="#e9d57a" strokeWidth="2" />
                  <path d="M85,158 C85,175 115,175 115,158 Z" fill="#b58319" stroke="#e9d57a" strokeWidth="2" />
                  
                  {/* Glass Cylinder Frame */}
                  <rect x="90" y="42" width="20" height="116" fill="none" stroke="#e9d57a" strokeWidth="3" rx="10" />
                </svg>

                {/* Actual CSS Rotating Barber Pole stripes inside the cylinder */}
                <div className="absolute left-[92px] top-[44px] w-[16px] h-[112px] overflow-hidden rounded-md z-10 opacity-90 pointer-events-none">
                  <div 
                    className="w-full h-[300%] bg-repeat-y" 
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #ef4444, #ef4444 12px, #ffffff 12px, #ffffff 24px, #3b82f6 24px, #3b82f6 36px, #ffffff 36px, #ffffff 48px)`,
                      backgroundSize: '100% 96px',
                      animation: 'barberPoleFlow 3s linear infinite'
                    }}
                  />
                </div>
              </div>

              {/* Bottom tag */}
              <div className="text-center z-10 bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-800">
                <span className="font-display font-semibold text-sm tracking-[0.2em] text-white">
                  EST. 2018
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Inject custom keyframe styles */}
      <style>{`
        @keyframes barberPoleFlow {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 320px;
          }
        }
      `}</style>
    </section>
  );
}

// Simple local Crown icon copy to prevent any lucide loading failure
function Crown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M5 20h14" />
    </svg>
  );
}
