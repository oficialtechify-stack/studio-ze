/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Services from './components/Services.tsx';
import Portfolio from './components/Portfolio.tsx';
import Testimonials from './components/Testimonials.tsx';
import BookingModal from './components/BookingModal.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import AdminLoginModal from './components/AdminLoginModal.tsx';
import Footer from './components/Footer.tsx';
import { Service, Booking, PortfolioItem, Testimonial } from './types.ts';

// Local storage keys for robust fallbacks
const STORAGE_KEYS = {
  SERVICES: 'studio_zb_services',
  BOOKINGS: 'studio_zb_bookings',
  PORTFOLIO: 'studio_zb_portfolio',
  TESTIMONIALS: 'studio_zb_testimonials'
};

export default function App() {
  // State variables
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('studio_zb_admin_token'));
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState<Service | null>(null);

  const fetchBookingsAndSlots = async (token: string | null) => {
    try {
      if (token) {
        const resBookings = await fetch('/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resBookings.ok) {
          const data = await resBookings.json();
          setBookings(data);
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(data));
          return;
        } else if (resBookings.status === 401) {
          // Token invalid/expired
          setAdminToken(null);
          localStorage.removeItem('studio_zb_admin_token');
        }
      }

      // Guest mode: fetch busy slots anonymously for calendar
      const resSlots = await fetch('/api/bookings/busy-slots');
      if (resSlots.ok) {
        const slotsData = await resSlots.json();
        const skeletonBookings: Booking[] = slotsData.map((slot: any) => ({
          id: slot.id || `b-slot-${Math.random()}`,
          clientName: 'Reservado',
          clientPhone: '---',
          serviceId: slot.serviceId || 'corte',
          serviceName: slot.serviceName || 'Corte',
          servicePrice: slot.servicePrice || 30.00,
          date: slot.date,
          time: slot.time,
          status: slot.status || 'confirmed',
          createdAt: new Date().toISOString()
        }));
        setBookings(skeletonBookings);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(skeletonBookings));
      } else {
        loadBookingsFallback();
      }
    } catch (err) {
      console.warn('Unable to fetch bookings/slots, using local persistence fallback.', err);
      loadBookingsFallback();
    }
  };

  const handleAuthError = () => {
    alert('Sessão administrativa expirada. Por favor, faça login novamente.');
    setAdminToken(null);
    setIsAdminOpen(false);
    localStorage.removeItem('studio_zb_admin_token');
    fetchBookingsAndSlots(null);
  };

  // Sync state from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Services
        const resServices = await fetch('/api/services');
        if (resServices.ok) {
          const data = await resServices.json();
          setServices(data);
          localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data));
        } else {
          loadServicesFallback();
        }

        // 2. Fetch Bookings (Full if admin, busy-slots if guest)
        await fetchBookingsAndSlots(adminToken);

        // 3. Fetch Portfolio
        const resPortfolio = await fetch('/api/portfolio');
        if (resPortfolio.ok) {
          const data = await resPortfolio.json();
          setPortfolio(data);
          localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(data));
        } else {
          loadPortfolioFallback();
        }

        // 4. Fetch Testimonials
        const resTestimonials = await fetch('/api/testimonials');
        if (resTestimonials.ok) {
          const data = await resTestimonials.json();
          setTestimonials(data);
          localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(data));
        } else {
          loadTestimonialsFallback();
        }
      } catch (err) {
        console.warn('Unable to reach backend, loading from browser local persistence.', err);
        loadAllFallbacks();
      }
    };

    fetchData();
  }, [adminToken]);

  // Fallback loaders
  const loadServicesFallback = () => {
    const local = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (local) setServices(JSON.parse(local));
  };

  const loadBookingsFallback = () => {
    const local = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (local) setBookings(JSON.parse(local));
  };

  const loadPortfolioFallback = () => {
    const local = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    if (local) setPortfolio(JSON.parse(local));
  };

  const loadTestimonialsFallback = () => {
    const local = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    if (local) setTestimonials(JSON.parse(local));
  };

  const loadAllFallbacks = () => {
    loadServicesFallback();
    loadBookingsFallback();
    loadPortfolioFallback();
    loadTestimonialsFallback();
  };

  // Helper to save state locally
  const syncLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Trigger Booking Modal with pre-selection
  const handleSelectService = (service: Service) => {
    setPreSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleOpenBookingForm = () => {
    setPreSelectedService(null);
    setIsBookingOpen(true);
  };

  const handleViewPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // API operations and local updates

  // 1. Make a Booking
  const handleMakeBooking = async (
    clientName: string,
    clientPhone: string,
    serviceId: string,
    date: string,
    time: string
  ): Promise<{ success: boolean; error?: string; booking?: Booking }> => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, clientPhone, serviceId, date, time })
      });

      if (response.ok) {
        const newBooking = await response.json();
        const updated = [...bookings, newBooking];
        setBookings(updated);
        syncLocal(STORAGE_KEYS.BOOKINGS, updated);
        return { success: true, booking: newBooking };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error };
      }
    } catch (err) {
      // Local fallback creation if backend offline
      const service = services.find(s => s.id === serviceId);
      if (!service) return { success: false, error: 'Serviço não encontrado.' };

      const isTaken = bookings.some(b => b.date === date && b.time === time && b.status !== 'cancelled');
      if (isTaken) return { success: false, error: 'Horário já agendado.' };

      const fallbackBooking: Booking = {
        id: `b-${Date.now()}`,
        clientName,
        clientPhone,
        serviceId,
        serviceName: service.name,
        servicePrice: service.price,
        date,
        time,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const updated = [...bookings, fallbackBooking];
      setBookings(updated);
      syncLocal(STORAGE_KEYS.BOOKINGS, updated);
      return { success: true, booking: fallbackBooking };
    }
  };

  // 2. Submit a Review
  const handleSubmitReview = async (
    clientName: string,
    rating: number,
    text: string,
    serviceName: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, rating, text, serviceName })
      });

      if (response.ok) {
        const newReview = await response.json();
        const updated = [newReview, ...testimonials];
        setTestimonials(updated);
        syncLocal(STORAGE_KEYS.TESTIMONIALS, updated);
        return true;
      }
    } catch (err) {
      // Fallback
      const fallbackReview: Testimonial = {
        id: `t-${Date.now()}`,
        clientName,
        rating,
        text,
        serviceName,
        date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      const updated = [fallbackReview, ...testimonials];
      setTestimonials(updated);
      syncLocal(STORAGE_KEYS.TESTIMONIALS, updated);
      return true;
    }
    return false;
  };

  // Helper to generate headers for admin operations
  const getAdminHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken || ''}`
  });

  // 3. Add or update service (Admin)
  const handleAddOrUpdateService = async (serviceData: Partial<Service>): Promise<boolean> => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(serviceData)
      });

      if (response.status === 401) {
        handleAuthError();
        return false;
      }

      if (response.ok) {
        const saved = await response.json();
        let updated: Service[] = [];
        
        if (serviceData.id) {
          // Editing
          updated = services.map(s => s.id === serviceData.id ? saved : s);
        } else {
          // Adding
          updated = [...services, saved];
        }
        
        setServices(updated);
        syncLocal(STORAGE_KEYS.SERVICES, updated);
        return true;
      }
    } catch (err) {
      // Fallback
      let updated: Service[] = [];
      if (serviceData.id) {
        updated = services.map(s => s.id === serviceData.id ? { ...s, ...serviceData } as Service : s);
      } else {
        const newService: Service = {
          id: `s-${Date.now()}`,
          name: serviceData.name || '',
          description: serviceData.description || '',
          price: Number(serviceData.price) || 0,
          duration: serviceData.duration || '30min',
          category: serviceData.category || 'avulso'
        };
        updated = [...services, newService];
      }
      setServices(updated);
      syncLocal(STORAGE_KEYS.SERVICES, updated);
      return true;
    }
    return false;
  };

  // 4. Delete service (Admin)
  const handleDeleteService = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/services/${id}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      });

      if (response.status === 401) {
        handleAuthError();
        return false;
      }

      if (response.ok) {
        const updated = services.filter(s => s.id !== id);
        setServices(updated);
        syncLocal(STORAGE_KEYS.SERVICES, updated);
        return true;
      }
    } catch (err) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      syncLocal(STORAGE_KEYS.SERVICES, updated);
      return true;
    }
    return false;
  };

  // 5. Add portfolio photo (Admin)
  const handleAddPortfolioItem = async (itemData: { title: string; description: string; imageUrl: string; category: string }): Promise<boolean> => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(itemData)
      });

      if (response.status === 401) {
        handleAuthError();
        return false;
      }

      if (response.ok) {
        const saved = await response.json();
        const updated = [saved, ...portfolio];
        setPortfolio(updated);
        syncLocal(STORAGE_KEYS.PORTFOLIO, updated);
        return true;
      }
    } catch (err) {
      // Fallback
      const newItem: PortfolioItem = {
        id: `p-${Date.now()}`,
        title: itemData.title,
        description: itemData.description,
        imageUrl: itemData.imageUrl,
        category: itemData.category,
        likes: 0,
        date: new Date().toISOString().split('T')[0]
      };
      const updated = [newItem, ...portfolio];
      setPortfolio(updated);
      syncLocal(STORAGE_KEYS.PORTFOLIO, updated);
      return true;
    }
    return false;
  };

  // 6. Delete portfolio item (Admin)
  const handleDeletePortfolioItem = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      });

      if (response.status === 401) {
        handleAuthError();
        return false;
      }

      if (response.ok) {
        const updated = portfolio.filter(p => p.id !== id);
        setPortfolio(updated);
        syncLocal(STORAGE_KEYS.PORTFOLIO, updated);
        return true;
      }
    } catch (err) {
      const updated = portfolio.filter(p => p.id !== id);
      setPortfolio(updated);
      syncLocal(STORAGE_KEYS.PORTFOLIO, updated);
      return true;
    }
    return false;
  };

  // 7. Update booking status (Admin)
  const handleUpdateBookingStatus = async (id: string, status: Booking['status']): Promise<boolean> => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status })
      });

      if (response.status === 401) {
        handleAuthError();
        return false;
      }

      if (response.ok) {
        const saved = await response.json();
        const updated = bookings.map(b => b.id === id ? saved : b);
        setBookings(updated);
        syncLocal(STORAGE_KEYS.BOOKINGS, updated);
        return true;
      }
    } catch (err) {
      const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
      setBookings(updated);
      syncLocal(STORAGE_KEYS.BOOKINGS, updated);
      return true;
    }
    return false;
  };

  // 8. Delete booking (Admin)
  const handleDeleteBooking = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/bookings/${id}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      });

      if (response.status === 401) {
        handleAuthError();
        return false;
      }

      if (response.ok) {
        const updated = bookings.filter(b => b.id !== id);
        setBookings(updated);
        syncLocal(STORAGE_KEYS.BOOKINGS, updated);
        return true;
      }
    } catch (err) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      syncLocal(STORAGE_KEYS.BOOKINGS, updated);
      return true;
    }
    return false;
  };

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('studio_zb_admin_token', token);
    setIsAdminLoginOpen(false);
    setIsAdminOpen(true);
    
    // Fetch full bookings list once authorized
    fetchBookingsAndSlots(token);

    // Scroll to admin panel
    setTimeout(() => {
      const element = document.getElementById('admin-panel');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('studio_zb_admin_token');
    setIsAdminOpen(false);
    // Fetch slots instead of full bookings for safety
    fetchBookingsAndSlots(null);
  };

  const toggleAdmin = () => {
    if (isAdminOpen) {
      // Logout and hide
      handleLogout();
    } else {
      if (adminToken) {
        setIsAdminOpen(true);
        // Scroll to admin panel
        setTimeout(() => {
          const element = document.getElementById('admin-panel');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        setIsAdminLoginOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-gold-400 selection:text-slate-950">
      
      {/* Header top bar */}
      <Header 
        onOpenBooking={handleOpenBookingForm} 
        onToggleAdmin={toggleAdmin}
        isAdminOpen={isAdminOpen}
      />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Landing Hero Area */}
        <Hero 
          onOpenBooking={handleOpenBookingForm}
          onViewPortfolio={handleViewPortfolio}
        />

        {/* Services & Prices */}
        <Services 
          services={services} 
          onSelectService={handleSelectService}
          isAdminMode={isAdminOpen}
          onOpenAdminPanel={() => {
            const el = document.getElementById('admin-panel');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Photo Portfolio Gallery */}
        <Portfolio 
          portfolio={portfolio}
          isAdminMode={isAdminOpen}
          onOpenAdminPanel={() => {
            const el = document.getElementById('admin-panel');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Testimonials & Reviews */}
        <Testimonials 
          testimonials={testimonials} 
          onSubmitReview={handleSubmitReview}
        />

        {/* Conditional Admin Control Panel */}
        {isAdminOpen && adminToken && (
          <AdminPanel 
            services={services}
            bookings={bookings}
            portfolio={portfolio}
            onAddOrUpdateService={handleAddOrUpdateService}
            onDeleteService={handleDeleteService}
            onAddPortfolioItem={handleAddPortfolioItem}
            onDeletePortfolioItem={handleDeletePortfolioItem}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        services={services}
        preSelectedService={preSelectedService}
        onMakeBooking={handleMakeBooking}
        existingBookings={bookings}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer contacts */}
      <Footer />
    </div>
  );
}
