/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Service, Booking } from '../types.js';
import { X, Calendar, Clock, User, Phone, CheckCircle, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  preSelectedService: Service | null;
  onMakeBooking: (clientName: string, clientPhone: string, serviceId: string, date: string, time: string) => Promise<{ success: boolean; error?: string; booking?: Booking }>;
  existingBookings: Booking[];
}

export default function BookingModal({
  isOpen,
  onClose,
  services,
  preSelectedService,
  onMakeBooking,
  existingBookings
}: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Date setup (tomorrow by default, or today if within working hours)
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTomorrowDateString());
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookedDetails, setBookedDetails] = useState<Booking | null>(null);

  // Sync pre-selected service when modal opens or shifts
  useEffect(() => {
    if (isOpen) {
      if (preSelectedService) {
        setSelectedService(preSelectedService);
        setStep(2); // Jump to date selection directly if service is pre-selected!
      } else {
        setSelectedService(null);
        setStep(1);
      }
      setSelectedTime('');
      setSubmitError('');
      setBookedDetails(null);
    }
  }, [isOpen, preSelectedService]);

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

  // Working hours time slots
  const allTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  // Exclude booked slots
  const getAvailableSlots = () => {
    return allTimeSlots.map(time => {
      const isTaken = existingBookings.some(
        b => b.date === selectedDate && b.time === time && b.status !== 'cancelled'
      );
      return { time, isTaken };
    });
  };

  // Format Brazilian phone mask (81) 98888-7777
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    // Apply mask
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    setClientPhone(value);
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedTime) return;
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (step === 2 && preSelectedService) {
      onClose(); // Close if they went back from pre-selected
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      setSubmitError('Preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await onMakeBooking(
        clientName,
        clientPhone,
        selectedService.id,
        selectedDate,
        selectedTime
      );

      if (res.success && res.booking) {
        setBookedDetails(res.booking);
        setStep(4); // Go to success page
      } else {
        setSubmitError(res.error || 'Ocorreu um erro ao realizar o agendamento.');
      }
    } catch (err) {
      setSubmitError('Erro na conexão com o servidor. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get next 7 available dates (excluding Sundays and Mondays, which are standard rest days)
  const getAvailableDates = () => {
    const list = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday
      
      if (dayOfWeek !== 0 && dayOfWeek !== 1) {
        const value = date.toISOString().split('T')[0];
        const label = date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
        list.push({ value, label });
      }
    }
    return list;
  };

  const activeDates = getAvailableDates();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative bg-slate-900 border border-gold-400/20 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="font-display text-sm sm:text-base font-extrabold tracking-widest text-white uppercase">
              Agendamento <span className="text-gold-300">Online</span>
            </h3>
            {step < 4 && (
              <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">PASSO {step} DE 3</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Progress Indicator bar */}
        {step < 4 && (
          <div className="h-1 w-full bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body / Steps Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Select Service */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="text-center sm:text-left">
                  <h4 className="font-display text-base font-bold text-white tracking-wide uppercase">Escolha o Serviço</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Selecione o corte ou combo que deseja agendar hoje.</p>
                </div>
                
                <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        selectedService?.id === service.id
                          ? 'bg-gold-500/10 border-gold-400 text-white'
                          : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <h5 className="font-bold text-sm tracking-wide">{service.name}</h5>
                        <p className="text-[11px] text-slate-400 font-light line-clamp-1">{service.description}</p>
                        <span className="text-[10px] font-mono bg-slate-950/60 px-2 py-0.5 rounded text-gold-300">{service.duration}</span>
                      </div>
                      <span className="font-mono font-extrabold text-sm text-gold-300 shrink-0">
                        R$ {service.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose Date & Time */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="text-center sm:text-left">
                  <h4 className="font-display text-base font-bold text-white tracking-wide uppercase">Selecione Data & Horário</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Serviço escolhido: <span className="text-gold-300 font-bold">{selectedService?.name}</span>
                  </p>
                </div>

                {/* Horizontal Date Picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Escolha o Dia</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none pr-1">
                    {activeDates.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setSelectedDate(item.value);
                          setSelectedTime(''); // Reset selected time when date changes
                        }}
                        className={`flex-shrink-0 px-4 py-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedDate === item.value
                            ? 'bg-gold-400 text-slate-950 border-gold-400 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="block text-[10px] uppercase font-mono tracking-wider opacity-85">
                          {item.label.split(' ')[0]}
                        </span>
                        <span className="block text-sm font-extrabold font-mono mt-0.5">
                          {item.label.match(/\d+/) || ''}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Time Slots */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Horários Disponíveis</label>
                  <div className="grid grid-cols-3 gap-2 max-h-[25vh] overflow-y-auto pr-1">
                    {getAvailableSlots().map(({ time, isTaken }) => (
                      <button
                        key={time}
                        type="button"
                        disabled={isTaken}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-1.5 rounded-lg text-xs font-bold font-mono border tracking-wider transition-all cursor-pointer ${
                          isTaken
                            ? 'bg-slate-950 border-slate-950 text-slate-700 cursor-not-allowed line-through'
                            : selectedTime === time
                            ? 'bg-gold-500 text-slate-950 border-gold-500 font-extrabold shadow-md'
                            : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Client Information details */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="text-center sm:text-left">
                  <h4 className="font-display text-base font-bold text-white tracking-wide uppercase">Confirme seus Dados</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Último passo! Insira suas informações de contato para receber os lembretes.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Seu Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: Carlos Silva"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone Input with Brazilian mask */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Telefone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={handlePhoneChange}
                        placeholder="(81) 99999-9999"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-gold-400/60 rounded-xl text-sm font-mono text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Booking Summary details */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-200 uppercase tracking-wider">Resumo do Agendamento</h5>
                    <div className="grid grid-cols-2 gap-y-1.5 pt-1.5 border-t border-slate-900 text-slate-400">
                      <span>Serviço:</span>
                      <span className="text-white text-right font-bold">{selectedService?.name}</span>
                      <span>Valor:</span>
                      <span className="text-gold-300 text-right font-bold font-mono">R$ {selectedService?.price.toFixed(2).replace('.', ',')}</span>
                      <span>Data:</span>
                      <span className="text-white text-right font-mono">{selectedDate.split('-').reverse().join('/')}</span>
                      <span>Horário:</span>
                      <span className="text-white text-right font-bold font-mono">{selectedTime}</span>
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-400 font-semibold bg-red-950/20 border border-red-500/20 p-2.5 rounded-lg flex items-center gap-1.5">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </p>
                  )}

                  {/* Hidden action trigger to make button act correctly */}
                  <button type="submit" className="hidden" id="booking-submit-btn" />
                </form>
              </motion.div>
            )}

            {/* Step 4: Success Screen */}
            {step === 4 && bookedDetails && (
              <motion.div
                key="step-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-6 text-center space-y-5"
              >
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500 animate-[bounce_1s_infinite]" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-display text-xl font-extrabold text-white uppercase tracking-wider">Agendado com Sucesso!</h4>
                  <p className="text-xs text-slate-400 font-light">Seu horário foi reservado e está garantido na nossa agenda.</p>
                </div>

                <div className="max-w-xs mx-auto p-4 rounded-xl bg-slate-950 border border-gold-400/20 space-y-2 text-left text-xs">
                  <div className="text-center font-bold text-gold-300 uppercase tracking-widest text-[10px] pb-1.5 border-b border-slate-900">
                    Comprovante de Reserva
                  </div>
                  <div className="space-y-1.5 pt-2 text-slate-400">
                    <p>Cliente: <span className="text-white font-semibold float-right">{bookedDetails.clientName}</span></p>
                    <p>Serviço: <span className="text-white font-semibold float-right">{bookedDetails.serviceName}</span></p>
                    <p>Valor: <span className="text-gold-300 font-bold font-mono float-right">R$ {bookedDetails.servicePrice.toFixed(2).replace('.', ',')}</span></p>
                    <p>Dia: <span className="text-white font-mono float-right">{bookedDetails.date.split('-').reverse().join('/')}</span></p>
                    <p>Horário: <span className="text-white font-bold font-mono float-right">{bookedDetails.time}</span></p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal max-w-sm mx-auto font-light">
                  Caso precise desmarcar ou reagendar, favor entrar em contato por telefone ou WhatsApp com pelo menos 2 horas de antecedência.
                </p>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white bg-slate-950 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
                >
                  Fechar Janela
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Modal Footer Controls */}
        {step < 4 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
            <button
              onClick={handlePrevStep}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                step === 1 && !preSelectedService
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            {step < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={(step === 1 && !selectedService) || (step === 2 && !selectedTime)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-105 transition-all cursor-pointer"
              >
                <span>Avançar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => document.getElementById('booking-submit-btn')?.click()}
                disabled={isSubmitting}
                className="flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-105 transition-all cursor-pointer"
              >
                {isSubmitting ? 'Agendando...' : 'CONFIRMAR AGENDAMENTO'}
              </button>
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
}
