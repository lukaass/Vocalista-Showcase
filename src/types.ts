export interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface ShowEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  venue: string;
  city: string;
  status: 'confirmado' | 'esgotado' | 'cancelado' | 'convite';
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g., "Casamento de Marina & Joao", "Aniversario 50 Anos"
  content: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SingerProfile {
  username: string; // Slug for URL query parameter: ?singer=username
  password?: string; // Stored in plain text for demonstration/access ease
  name: string;
  slogan: string;
  bio: string;
  phone: string; // For WhatsApp redirect
  email: string;
  genre: string; // E.g., "Sertanejo", "MPB / Acústico", "Pop Rock"
  themeColor: 'amber' | 'emerald' | 'blue' | 'indigo' | 'rose' | 'crimson' | 'violet' | 'sky';
  logoUrl?: string; // Or a letter mark
  avatarUrl?: string;
  bioPhotoUrl?: string;
  instagram?: string;
  youtube?: string;
  spotify?: string;
  offersInvoice?: boolean;
  offersContract?: boolean;
  
  // Travel cost options
  travelEnabled?: boolean;
  travelBaseRadius?: number;
  travelStepKm?: number;
  travelIncrementPercent?: number;
  travelOrigin?: string;
  
  // Custom arrays
  gallery: string[]; // Image URLs
  plans: Plan[];
  events: ShowEvent[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
}

export interface AdminUser {
  username: string;
  role: 'owner' | 'singer';
  singerId?: string; // link to the SingerProfile if role is 'singer'
}

export interface AdminCredentials {
  email: string;
  password: string;
  username: string;
  recoveryEmail?: string;
}

