export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  video?: string;
  features: string[];
  specs: Record<string, string>;
  category: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface VisionSection {
  title: string;
  subtitle: string;
  content: string;
  image: string;
  accent: string;
}

export interface SearchableItem {
  title: string;
  description: string;
  category: 'product' | 'feature' | 'page';
  targetPage: Page;
}

export type NavItem = string;

export enum Page {
  Home = 'home',
  Products = 'products',
  Services = 'services',
  Blog = 'blog',
  Cart = 'cart',
  Checkout = 'checkout',
  AboutUs = 'about us'
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface Partner {
  name: string;
  logo?: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  content: string;
  rating: number;
  image?: string;
}
