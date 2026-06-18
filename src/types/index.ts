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
  ProductDetail = 'product-detail',
  Services = 'services',
  Blog = 'blog',
  Cart = 'cart',
  Checkout = 'checkout',
  Account = 'account',
  FAQ = 'faq',
  AboutUs = 'about us'
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  category: string;
  icon: string;
  items: FaqItem[];
}

// Authentication
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string | null;
  phone?: string | null;
  is_active: boolean;
  is_admin: boolean;
  is_verified: boolean;
  role_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserMe extends User {
  role?: string | null;
  permissions: string[];
  is_superuser: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
}

// Commerce / checkout (backend-shaped)
export interface BackendProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock_quantity: number;
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  is_billing: boolean;
  is_shipping: boolean;
}

export interface AddressInput {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
  is_shipping?: boolean;
}

export interface DeliveryCheck {
  is_available: boolean;
  pincode: string;
  city?: string | null;
  state?: string | null;
  estimated_delivery_days?: number | null;
  delivery_charge: number;
  is_cod_available: boolean;
  message: string;
}

export interface CouponValidation {
  is_valid: boolean;
  discount_amount: number;
  message?: string | null;
}

export interface OrderItemResponse {
  id: number;
  product_name: string;
  product_sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  total: number;
  payment_method?: string | null;
  shipping_method?: string | null;
  customer_notes?: string | null;
  created_at: string;
  items: OrderItemResponse[];
}

export interface OrderList {
  items: Order[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface ProfileInput {
  full_name?: string;
  phone?: string;
  email?: string;
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
