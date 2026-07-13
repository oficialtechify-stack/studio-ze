/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { Service, Booking, PortfolioItem, Testimonial } from './src/types.js';

// Seed data
let services: Service[] = [
  {
    id: 'corte',
    name: 'Corte',
    description: 'Qualquer tipo de corte seja só com máquina, máquina e tesoura ou todo na tesoura.',
    price: 30.00,
    duration: '30min',
    category: 'popular'
  },
  {
    id: 'corte-sobrancelhas',
    name: 'Corte + Sobrancelhas',
    description: 'Corte de cabelo completo acompanhado do alinhamento perfeito das sobrancelhas.',
    price: 40.00,
    duration: '45min',
    category: 'popular'
  },
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    description: 'O combo ideal de respeito. Corte completo de cabelo e barba com toalha quente e hidratação.',
    price: 50.00,
    duration: '50min',
    category: 'popular'
  },
  {
    id: 'barba',
    name: 'Barba',
    description: 'Barba feita com máquina, navalha ou barbeador shaver, finalizada com óleo e massagem facial.',
    price: 25.00,
    duration: '25min',
    category: 'avulso'
  },
  {
    id: 'corte-barba-sobrancelhas',
    name: 'Corte + Barba + Sobrancelhas',
    description: 'O combo supremo do Studio Zé Barber. Cabelo, barba e sobrancelhas no mais alto padrão.',
    price: 60.00,
    duration: '55min',
    category: 'combo'
  },
  {
    id: 'pezinho-barba',
    name: 'Pezinho + Barba',
    description: 'Acabamento do cabelo (pezinho) junto com o design e corte completo da barba.',
    price: 35.00,
    duration: '30min',
    category: 'avulso'
  },
  {
    id: 'corte-maquina-sobrancelhas',
    name: 'Corte só Máquina (pente único) + Sobrancelhas',
    description: 'Corte prático feito apenas com um pente de máquina, acompanhado do design de sobrancelhas.',
    price: 30.00,
    duration: '25min',
    category: 'avulso'
  },
  {
    id: 'corte-maquina',
    name: 'Corte só Máquina (pente único)',
    description: 'Corte super rápido e uniforme utilizando apenas um tamanho de pente de máquina.',
    price: 20.00,
    duration: '20min',
    category: 'avulso'
  },
  {
    id: 'pezinho',
    name: 'Pezinho (costeletas)',
    description: 'Acabamento e alinhamento dos contornos do cabelo e costeletas utilizando navalha.',
    price: 10.00,
    duration: '15min',
    category: 'avulso'
  },
  {
    id: 'sobrancelhas',
    name: 'Sobrancelhas',
    description: 'Alinhamento e design de sobrancelhas feito com lâmina descartável de alta precisão.',
    price: 10.00,
    duration: '10min',
    category: 'avulso'
  }
];

let portfolio: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Mid Fade Clássico',
    description: 'Degradê impecável de altura média com finalização limpa e risca lateral marcante.',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600',
    category: 'Fade',
    likes: 42,
    date: '2026-07-01'
  },
  {
    id: 'p2',
    title: 'Barba de Respeito',
    description: 'Barba lenhador ultra alinhada com shaver e acabamento na navalha, hidratada com óleos essenciais.',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600',
    category: 'Barba',
    likes: 38,
    date: '2026-07-03'
  },
  {
    id: 'p3',
    title: 'Corte Social com Tesoura',
    description: 'Corte clássico e elegante focado em caimento natural usando apenas tesoura na parte superior.',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=600',
    category: 'Social',
    likes: 29,
    date: '2026-07-05'
  },
  {
    id: 'p4',
    title: 'Pompadour Texturizado',
    description: 'Topete clássico estruturado com pomada de brilho matte e corte fade nas laterais.',
    imageUrl: 'https://images.unsplash.com/photo-1605497746444-051f4b62bf3d?auto=format&fit=crop&q=80&w=600',
    category: 'Clássico',
    likes: 35,
    date: '2026-07-08'
  },
  {
    id: 'p5',
    title: 'Razor Fade / Degradê Navalhado',
    description: 'Degradê ultra limpo partindo da pele na navalha com topo estruturado em mechas curtas.',
    imageUrl: 'https://images.unsplash.com/photo-1517832606589-7a598bb08af6?auto=format&fit=crop&q=80&w=600',
    category: 'Fade',
    likes: 51,
    date: '2026-07-10'
  },
  {
    id: 'p6',
    title: 'Corte Executivo Moderno',
    description: 'Laterais baixas com topo levemente desconectado, ideal para o dia a dia executivo elegante.',
    imageUrl: 'https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?auto=format&fit=crop&q=80&w=600',
    category: 'Social',
    likes: 24,
    date: '2026-07-11'
  }
];

let testimonials: Testimonial[] = [
  {
    id: 't1',
    clientName: 'Halley',
    rating: 5,
    text: 'Studio Zé Barber é o melhor de Jardim Piedade! Atendimento excelente, espaço confortável e uma cadeira espetacular. Zé é diferenciado no corte...',
    serviceName: 'Corte + Barba + Sobrancelhas',
    date: '28 de mar. de 2026'
  },
  {
    id: 't2',
    clientName: 'Caio',
    rating: 5,
    text: 'Muito bom o atendimento o local organizado, limpo e bem iluminado. O corte e a barba ficaram bem alinhados. Passei carnaval em recife e resolvi cortar o cabelo e barba lá, virou referência!',
    serviceName: 'Corte + Barba + Sobrancelhas',
    date: '12 de mar. de 2026'
  },
  {
    id: 't3',
    clientName: 'Pablo',
    rating: 5,
    text: 'O melhor barber da região. Atendimento impecável, conversa boa e o corte perfeito. Recomendo de olhos fechados!',
    serviceName: 'Corte',
    date: '18 de jun. de 2026'
  },
  {
    id: 't4',
    clientName: 'Kauã',
    rating: 5,
    text: 'Trabalho de artista 🤝. Zé tem as mãos de ouro, capricha demais nos detalhes e no pezinho do cabelo.',
    serviceName: 'Corte',
    date: '11 de jun. de 2026'
  },
  {
    id: 't5',
    clientName: 'Thamires',
    rating: 5,
    text: 'Atendimento top! Levei meu marido e meu filho, ficaram lindos demais. O Zé é muito atencioso e profissional.',
    serviceName: 'Corte',
    date: '8 de jun. de 2026'
  },
  {
    id: 't6',
    clientName: 'Thaís',
    rating: 5,
    text: 'Super paciente e ágil. Cortou o cabelo do meu filhinho pequeno que não para quieto, ficou maravilhoso!',
    serviceName: 'Corte',
    date: '7 de mai. de 2026'
  }
];

let bookings: Booking[] = [
  {
    id: 'b-default-1',
    clientName: 'Mateus Oliveira',
    clientPhone: '(81) 98877-6655',
    serviceId: 'corte-barba',
    serviceName: 'Corte + Barba',
    servicePrice: 50.00,
    date: '2026-07-14',
    time: '14:00',
    status: 'confirmed',
    createdAt: '2026-07-13T10:00:00-03:00'
  },
  {
    id: 'b-default-2',
    clientName: 'Júlio César',
    clientPhone: '(81) 99122-3344',
    serviceId: 'corte',
    serviceName: 'Corte',
    servicePrice: 30.00,
    date: '2026-07-14',
    time: '16:30',
    status: 'pending',
    createdAt: '2026-07-13T10:30:00-03:00'
  }
];

const app = express();
const PORT = 3000;

export default app;

  // Middleware to support larger JSON paylods (for base64 photos)
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // --- API ROUTES ---

  // Admin Login API
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'zebarber2026';
    if (password === expectedPassword) {
      res.json({ success: true, token: expectedPassword });
    } else {
      res.status(401).json({ error: 'Senha de administrador incorreta.' });
    }
  });

  // Admin Authentication Middleware
  const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    const expectedToken = process.env.ADMIN_PASSWORD || 'zebarber2026';
    
    if (token === expectedToken) {
      next();
    } else {
      res.status(401).json({ error: 'Sessão administrativa expirada ou não autorizada.' });
    }
  };

  // Services APIs
  app.get('/api/services', (req, res) => {
    res.json(services);
  });

  app.post('/api/services', adminAuth, (req, res) => {
    const { id, name, description, price, duration, category } = req.body;
    
    if (!name || price === undefined || !duration) {
      return res.status(400).json({ error: 'Campos nome, preço e duração são obrigatórios.' });
    }

    if (id) {
      // Edit existing
      const index = services.findIndex(s => s.id === id);
      if (index !== -1) {
        services[index] = { ...services[index], name, description, price: Number(price), duration, category: category || 'avulso' };
        return res.json(services[index]);
      }
    }

    // Add new
    const newService: Service = {
      id: `s-${Date.now()}`,
      name,
      description: description || '',
      price: Number(price),
      duration,
      category: category || 'avulso'
    };
    services.push(newService);
    res.status(210).json(newService);
  });

  app.delete('/api/services/:id', adminAuth, (req, res) => {
    const { id } = req.params;
    services = services.filter(s => s.id !== id);
    res.json({ success: true, message: 'Serviço deletado com sucesso.' });
  });

  // Portfolio APIs
  app.get('/api/portfolio', (req, res) => {
    res.json(portfolio);
  });

  app.post('/api/portfolio', adminAuth, (req, res) => {
    const { id, title, description, imageUrl, category } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Título e imagem são obrigatórios.' });
    }

    if (id) {
      const index = portfolio.findIndex(p => p.id === id);
      if (index !== -1) {
        portfolio[index] = { ...portfolio[index], title, description: description || '', imageUrl, category: category || 'Fade' };
        return res.json(portfolio[index]);
      }
    }

    const newItem: PortfolioItem = {
      id: `p-${Date.now()}`,
      title,
      description: description || '',
      imageUrl,
      category: category || 'Fade',
      likes: 0,
      date: new Date().toISOString().split('T')[0]
    };
    portfolio.unshift(newItem); // Add to beginning of array
    res.status(210).json(newItem);
  });

  app.delete('/api/portfolio/:id', adminAuth, (req, res) => {
    const { id } = req.params;
    portfolio = portfolio.filter(p => p.id !== id);
    res.json({ success: true });
  });

  // Public Busy Slots API (returns only dates/times to prevent private data leaks)
  app.get('/api/bookings/busy-slots', (req, res) => {
    const busySlots = bookings
      .filter(b => b.status !== 'cancelled')
      .map(b => ({
        id: b.id,
        date: b.date,
        time: b.time,
        status: b.status,
        serviceId: b.serviceId,
        serviceName: b.serviceName,
        servicePrice: b.servicePrice
      }));
    res.json(busySlots);
  });

  // Bookings APIs (Admin Protected)
  app.get('/api/bookings', adminAuth, (req, res) => {
    res.json(bookings);
  });

  app.post('/api/bookings', (req, res) => {
    const { clientName, clientPhone, serviceId, date, time } = req.body;

    if (!clientName || !clientPhone || !serviceId || !date || !time) {
      return res.status(400).json({ error: 'Preencha todos os campos do agendamento.' });
    }

    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }

    // Check if slot already booked
    const slotTaken = bookings.some(b => b.date === date && b.time === time && b.status !== 'cancelled');
    if (slotTaken) {
      return res.status(400).json({ error: 'Este horário já está agendado. Por favor, escolha outro.' });
    }

    const newBooking: Booking = {
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

    bookings.push(newBooking);
    res.status(210).json(newBooking);
  });

  app.put('/api/bookings/:id', adminAuth, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    if (status) {
      bookings[index].status = status;
    }
    res.json(bookings[index]);
  });

  app.delete('/api/bookings/:id', adminAuth, (req, res) => {
    const { id } = req.params;
    bookings = bookings.filter(b => b.id !== id);
    res.json({ success: true });
  });

  // Testimonials APIs
  app.get('/api/testimonials', (req, res) => {
    res.json(testimonials);
  });

  app.post('/api/testimonials', (req, res) => {
    const { clientName, rating, text, serviceName } = req.body;

    if (!clientName || !rating || !text) {
      return res.status(400).json({ error: 'Preencha todos os campos do depoimento.' });
    }

    const newTestimonial: Testimonial = {
      id: `t-${Date.now()}`,
      clientName,
      rating: Number(rating),
      text,
      serviceName: serviceName || 'Corte',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    testimonials.unshift(newTestimonial);
    res.status(210).json(newTestimonial);
  });

  // --- VITE DEV / PRODUCTION FALLBACKS ---

  async function runLocalServer() {
    if (process.env.VERCEL) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

  runLocalServer();
