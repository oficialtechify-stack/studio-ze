/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Service, Booking, PortfolioItem } from '../types.js';
import { 
  Calendar, Scissors, Image as ImageIcon, Plus, Trash2, Edit2, Check, X, 
  TrendingUp, Users, DollarSign, Upload, AlertCircle, AlertTriangle, Sparkles 
} from 'lucide-react';

interface AdminPanelProps {
  services: Service[];
  bookings: Booking[];
  portfolio: PortfolioItem[];
  onAddOrUpdateService: (service: Partial<Service>) => Promise<boolean>;
  onDeleteService: (id: string) => Promise<boolean>;
  onAddPortfolioItem: (item: { title: string; description: string; imageUrl: string; category: string }) => Promise<boolean>;
  onDeletePortfolioItem: (id: string) => Promise<boolean>;
  onUpdateBookingStatus: (id: string, status: Booking['status']) => Promise<boolean>;
  onDeleteBooking: (id: string) => Promise<boolean>;
  onLogout?: () => void;
}

export default function AdminPanel({
  services,
  bookings,
  portfolio,
  onAddOrUpdateService,
  onDeleteService,
  onAddPortfolioItem,
  onDeletePortfolioItem,
  onUpdateBookingStatus,
  onDeleteBooking,
  onLogout
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'portfolio'>('bookings');
  
  // Service form state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('30min');
  const [serviceCategory, setServiceCategory] = useState<'popular' | 'avulso' | 'combo'>('avulso');
  const [serviceDescription, setServiceDescription] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);

  // Portfolio form state
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioCategory, setPortfolioCategory] = useState('Fade');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [portfolioImageBase64, setPortfolioImageBase64] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const estimatedRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.servicePrice, 0);

  // Handle service submit
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !servicePrice || !serviceDuration) return;

    const success = await onAddOrUpdateService({
      id: editingServiceId || undefined,
      name: serviceName,
      price: Number(servicePrice),
      duration: serviceDuration,
      category: serviceCategory,
      description: serviceDescription
    });

    if (success) {
      // Reset form
      setEditingServiceId(null);
      setServiceName('');
      setServicePrice('');
      setServiceDuration('30min');
      setServiceCategory('avulso');
      setServiceDescription('');
      setShowServiceForm(false);
    }
  };

  const startEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceName(service.name);
    setServicePrice(service.price.toString());
    setServiceDuration(service.duration);
    setServiceCategory(service.category);
    setServiceDescription(service.description);
    setShowServiceForm(true);
    // Scroll to form
    document.getElementById('service-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Drag and drop photo logic
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie apenas arquivos de imagem.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPortfolioImageBase64(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle portfolio submit
  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioTitle || !portfolioImageBase64) return;

    const success = await onAddPortfolioItem({
      title: portfolioTitle,
      description: portfolioDescription,
      imageUrl: portfolioImageBase64,
      category: portfolioCategory
    });

    if (success) {
      setPortfolioTitle('');
      setPortfolioDescription('');
      setPortfolioImageBase64('');
    }
  };

  return (
    <section id="admin-panel" className="py-24 bg-slate-900 border-t border-gold-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-400/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wider uppercase">
                🛡️ Modo Administrativo Autorizado
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 bg-slate-950 rounded-lg transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Sair / Desconectar
                </button>
              )}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-widest text-white uppercase">
              Painel de <span className="text-gold-300">Controle</span>
            </h2>
            <p className="text-xs text-slate-400 font-light mt-1">Gerencie os agendamentos, preços dos serviços e fotos do portfólio de cortes do Studio Zé Barber.</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Projetado</p>
              <p className="text-sm font-extrabold font-mono text-gold-300 mt-1">R$ {estimatedRevenue.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Agendados</p>
              <p className="text-sm font-extrabold font-mono text-white mt-1">{totalBookings}</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Pendentes</p>
              <p className="text-sm font-extrabold font-mono text-amber-500 mt-1">{pendingBookings}</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Concluídos</p>
              <p className="text-sm font-extrabold font-mono text-green-500 mt-1">{completedBookings}</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agendamentos ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Serviços & Preços ({services.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'portfolio'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gerenciar Portfólio ({portfolio.length})</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div>
          
          {/* TAB 1: BOOKINGS LIST */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="font-display text-base font-bold text-white tracking-widest uppercase mb-4">Próximos Agendamentos</h3>
              
              {bookings.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-slate-800 bg-slate-950/25">
                  <p className="text-slate-400 font-light text-sm">Nenhum agendamento registrado até o momento.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Serviço</th>
                        <th className="p-4">Data / Hora</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs text-slate-300">
                      {bookings.slice().reverse().map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white text-sm">{booking.clientName}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{booking.clientPhone}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-200">{booking.serviceName}</p>
                            <p className="text-[10px] font-mono text-gold-300 mt-0.5">R$ {booking.servicePrice.toFixed(2).replace('.', ',')}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-mono text-slate-200 font-semibold">{booking.date.split('-').reverse().join('/')}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{booking.time}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                              booking.status === 'confirmed'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : booking.status === 'completed'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : booking.status === 'cancelled'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmado' :
                               booking.status === 'completed' ? 'Concluído' :
                               booking.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              {booking.status === 'pending' && (
                                <button
                                  onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                                  className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500 hover:text-slate-950 text-blue-400 border border-blue-500/20 transition-all cursor-pointer"
                                  title="Confirmar Agendamento"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                <button
                                  onClick={() => onUpdateBookingStatus(booking.id, 'completed')}
                                  className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500 hover:text-slate-950 text-green-400 border border-green-500/20 transition-all cursor-pointer"
                                  title="Concluir Atendimento"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {booking.status !== 'cancelled' && (
                                <button
                                  onClick={() => onUpdateBookingStatus(booking.id, 'cancelled')}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 transition-all cursor-pointer"
                                  title="Cancelar Agendamento"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteBooking(booking.id)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 transition-all cursor-pointer"
                                title="Deletar da Agenda"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SERVICES & PRICES CRUD */}
          {activeTab === 'services' && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Add/Edit Form */}
              <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-4" id="service-form-anchor">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-white tracking-widest uppercase">
                    {editingServiceId ? '✏️ Editar Serviço' : '➕ Novo Serviço'}
                  </h3>
                  {editingServiceId && (
                    <button
                      onClick={() => {
                        setEditingServiceId(null);
                        setServiceName('');
                        setServicePrice('');
                        setServiceDuration('30min');
                        setServiceCategory('avulso');
                        setServiceDescription('');
                      }}
                      className="text-[10px] font-bold text-red-400 uppercase tracking-wider"
                    >
                      Cancelar
                    </button>
                  )}
                </div>

                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nome do Serviço</label>
                    <input
                      type="text"
                      required
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="Ex: Corte Degradê Navalhado"
                      className="w-full px-4.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={servicePrice}
                        onChange={(e) => setServicePrice(e.target.value)}
                        placeholder="Ex: 35.00"
                        className="w-full px-4.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm font-mono text-white focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duração</label>
                      <input
                        type="text"
                        required
                        value={serviceDuration}
                        onChange={(e) => setServiceDuration(e.target.value)}
                        placeholder="Ex: 30min ou 1h"
                        className="w-full px-4.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm font-mono text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categoria</label>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-slate-300 focus:outline-none transition-colors"
                    >
                      <option value="popular">Popular (Combo comum)</option>
                      <option value="avulso">Avulso (Corte, Barba individual)</option>
                      <option value="combo">Combo (Pacote completo)</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Descrição / Detalhes</label>
                    <textarea
                      rows={2.5}
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      placeholder="Descreva o que inclui o serviço..."
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase rounded-xl hover:brightness-105 transition-all shadow-md cursor-pointer"
                  >
                    {editingServiceId ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR SERVIÇO'}
                  </button>
                </form>
              </div>

              {/* Right Column: Services List Table */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-display text-base font-bold text-white tracking-widest uppercase mb-4">Serviços Cadastrados</h3>
                
                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                        <th className="p-4">Serviço</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs text-slate-300">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white text-sm">{service.name}</p>
                            <p className="text-[10px] font-mono text-gold-300 mt-0.5">R$ {service.price.toFixed(2).replace('.', ',')} ({service.duration})</p>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                              {service.category}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => startEditService(service)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-gold-400 hover:text-slate-950 text-slate-400 border border-slate-800 transition-all cursor-pointer"
                                title="Editar Preço / Nome"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteService(service.id)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 transition-all cursor-pointer"
                                title="Deletar Serviço"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PORTFOLIO CRUD WITH DRAG AND DROP */}
          {activeTab === 'portfolio' && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Upload New Cut */}
              <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-display text-sm font-bold text-white tracking-widest uppercase">
                  📷 Adicionar Novo Corte à Galeria
                </h3>

                <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                  {/* Drag & Drop file input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Foto do Corte</label>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                      className={`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all overflow-hidden ${
                        dragActive 
                          ? 'border-gold-400 bg-gold-400/5' 
                          : portfolioImageBase64 
                          ? 'border-green-500/50 bg-green-500/5' 
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                      }`}
                    >
                      {portfolioImageBase64 ? (
                        <>
                          <img
                            src={portfolioImageBase64}
                            alt="Corte Carregado"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="w-6 h-6 text-white" />
                            <span className="text-white text-xs font-bold font-mono ml-2">Substituir Foto</span>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2 pointer-events-none">
                          <div className="mx-auto w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-gold-400">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-normal">Arraste a foto ou clique para escolher</p>
                            <p className="text-[10px] text-slate-500 mt-1">PNG, JPG ou JPEG (Suporta fotos do celular)</p>
                          </div>
                        </div>
                      )}
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Título / Nome do Estilo</label>
                    <input
                      type="text"
                      required
                      value={portfolioTitle}
                      onChange={(e) => setPortfolioTitle(e.target.value)}
                      placeholder="Ex: Razor Fade com Risca"
                      className="w-full px-4.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categoria</label>
                    <select
                      value={portfolioCategory}
                      onChange={(e) => setPortfolioCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-slate-300 focus:outline-none transition-colors"
                    >
                      <option value="Fade">Fade / Degradê</option>
                      <option value="Barba">Barba / Cavanhaque</option>
                      <option value="Clássico">Clássico / Topete</option>
                      <option value="Social">Social / Executivo</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Legenda / Detalhes</label>
                    <textarea
                      rows={2.5}
                      value={portfolioDescription}
                      onChange={(e) => setPortfolioDescription(e.target.value)}
                      placeholder="Ex: Degradê de alta precisão feito com shaver..."
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!portfolioTitle || !portfolioImageBase64}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase rounded-xl hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
                  >
                    Publicar Foto na Galeria
                  </button>
                </form>
              </div>

              {/* Right Column: Portfolio item gallery overview list */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-display text-base font-bold text-white tracking-widest uppercase mb-4">Fotos Publicadas</h3>
                
                {portfolio.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl border border-dashed border-slate-800 bg-slate-950/25">
                    <p className="text-slate-400 font-light text-sm">Nenhuma foto no portfólio até agora.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {portfolio.map((item) => (
                      <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Overlay Gradient on Hover */}
                        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5" />
                        
                        {/* Top action details on Hover */}
                        <div className="absolute top-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                          <span className="px-2 py-0.5 bg-gold-400 text-slate-950 font-extrabold text-[8px] uppercase tracking-wider rounded">
                            {item.category}
                          </span>
                          <button
                            onClick={() => onDeletePortfolioItem(item.id)}
                            className="p-1.5 rounded-md bg-red-950 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-slate-950 transition-all cursor-pointer"
                            title="Deletar Foto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Bottom metadata details on Hover */}
                        <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <h5 className="font-bold text-white text-xs truncate leading-normal">{item.title}</h5>
                          <p className="text-[9px] font-mono text-slate-400 mt-0.5">Likes: {item.likes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
