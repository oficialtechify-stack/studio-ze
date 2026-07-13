/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g. "30min", "45min", "1h"
  category: 'popular' | 'avulso' | 'combo';
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string; // e.g., "Fade", "Barba", "Clássico", "Social"
  likes: number;
  date: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  rating: number; // 1 to 5
  text: string;
  serviceName?: string;
  date: string;
  avatarUrl?: string;
}
