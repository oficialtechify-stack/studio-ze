/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioItem } from '../types.js';
import { Heart, ZoomIn, X, Calendar } from 'lucide-react';

interface PortfolioProps {
  portfolio: PortfolioItem[];
  isAdminMode?: boolean;
  onOpenAdminPanel?: () => void;
}

export default function Portfolio({ portfolio, isAdminMode, onOpenAdminPanel }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [localLikes, setLocalLikes] = useState<Record<string, { count: number; liked: boolean }>>({});

  const categories = ['Todos', 'Fade', 'Barba', 'Clássico', 'Social'];

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalLikes(prev => {
      const current = prev[id] || { count: 0, liked: false };
      if (current.liked) {
        return {
          ...prev,
          [id]: { count: current.count - 1, liked: false }
        };
      } else {
        return {
          ...prev,
          [id]: { count: current.count + 1, liked: true }
        };
      }
    });
  };

  const getLikesCount = (item: PortfolioItem) => {
    const local = localLikes[item.id];
    if (local) {
      return item.likes + local.count;
    }
    return item.likes;
  };

  const isLiked = (item: PortfolioItem) => {
    return localLikes[item.id]?.liked || false;
  };

  const filteredItems = activeFilter === 'Todos'
    ? portfolio
    : portfolio.filter(item => item.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="portfolio" className="py-20 bg-slate-900/60 relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-gold-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-gold-400 font-bold">Nosso Trabalho</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-widest text-white uppercase">
            Galeria de <span className="text-gold-300">Cortes</span>
          </h2>
          <div className="h-[2px] w-20 bg-gold-400 mx-auto" />
          <p className="text-sm text-slate-400 font-light">
            Inspire-se com os cortes e barbas realizados no nosso estúdio. Trabalho artístico focado em realçar o que há de melhor em cada cliente.
          </p>
          {isAdminMode && (
            <button 
              onClick={onOpenAdminPanel}
              className="mt-2 text-xs bg-gold-400/10 border border-gold-400/30 text-gold-300 px-3 py-1 rounded-full hover:bg-gold-400/20 transition-all"
            >
              📷 Você está no modo Admin. Clique para gerenciar fotos.
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 shadow-md shadow-gold-500/10'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/20">
            <p className="text-slate-400 font-light text-sm">Nenhum corte encontrado nesta categoria.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 cursor-pointer shadow-lg shadow-black/25"
                >
                  {/* Photo with referrerPolicy to load Unsplash images properly in iframes */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-5" />

                  {/* Top category badge on hover */}
                  <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-2.5 py-1 rounded-md bg-gold-400/90 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>

                  {/* Zoom indicator on hover */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-gold-300">
                    <ZoomIn className="w-4 h-4" />
                  </div>

                  {/* Info details & Like button on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex justify-between items-end gap-4">
                      <div className="space-y-1">
                        <h4 className="font-display text-base font-bold text-white tracking-wide">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-300 font-light leading-snug line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      
                      {/* Interactive Like */}
                      <button
                        onClick={(e) => handleLike(item.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isLiked(item)
                            ? 'bg-red-500/20 border-red-500/50 text-red-400'
                            : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked(item) ? 'fill-current' : ''}`} />
                        <span className="font-mono text-xs font-bold">{getLikesCount(item)}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Immersive Lightbox Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 sm:p-6"
              onClick={() => setSelectedItem(null)}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-55 p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-gold-300 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0.92, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative bg-slate-900 border border-gold-400/20 max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Photo */}
                <div className="aspect-square relative overflow-hidden bg-slate-950">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-lg bg-gold-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest">
                      {selectedItem.category}
                    </span>
                  </div>
                </div>

                {/* Details card content */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
                        {selectedItem.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-gold-400" />
                        <span>Realizado recentemente</span>
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleLike(selectedItem.id, e)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        isLiked(selectedItem)
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked(selectedItem) ? 'fill-current' : ''}`} />
                      <span className="font-mono text-sm font-bold">{getLikesCount(selectedItem)}</span>
                    </button>
                  </div>

                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {selectedItem.description}
                  </p>

                  <div className="pt-2">
                    <p className="text-xs text-slate-400 leading-snug">
                      Gostou deste corte? Clique no botão <span className="text-gold-300 font-bold">Agendar</span> no topo para garantir o seu horário e renovar o seu visual!
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
