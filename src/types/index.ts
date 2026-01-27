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

export enum Page {
  Home = 'home',
  Products = 'products',
  Services = 'services',
  Blog = 'blog',
  Cart = 'cart',
  Checkout = 'checkout'
}
