import { apiRequest } from './client';
import type {
  Address,
  AddressInput,
  BackendProduct,
  CouponValidation,
  DeliveryCheck,
  Order,
  OrderList,
} from '@/types';

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// Public catalog — used to resolve the storefront's slug-based products to the
// backend's integer product ids (and live stock/price) needed for cart/orders.
export const catalogApi = {
  listProducts: (pageSize = 100): Promise<Paginated<BackendProduct>> =>
    apiRequest(`/products?page_size=${pageSize}`, { method: 'GET', auth: false }),
};

export const addressApi = {
  list: (): Promise<Address[]> => apiRequest('/addresses', { method: 'GET' }),
  create: (data: AddressInput): Promise<Address> =>
    apiRequest('/addresses', { method: 'POST', body: data }),
  update: (id: number, data: Partial<AddressInput>): Promise<Address> =>
    apiRequest(`/addresses/${id}`, { method: 'PUT', body: data }),
  remove: (id: number): Promise<void> => apiRequest(`/addresses/${id}`, { method: 'DELETE' }),
  setDefault: (id: number): Promise<Address> =>
    apiRequest(`/addresses/${id}/set-default`, { method: 'POST' }),
};

// The server order endpoint reads exclusively from the server-side cart, so we
// mirror the local cart into it right before checkout.
export const cartApi = {
  clear: (): Promise<unknown> => apiRequest('/cart', { method: 'DELETE' }),
  addItem: (productId: number, quantity: number): Promise<unknown> =>
    apiRequest('/cart/items', { method: 'POST', body: { product_id: productId, quantity } }),
};

export const deliveryApi = {
  check: (pincode: string, orderValue?: number): Promise<DeliveryCheck> =>
    apiRequest('/delivery/check', {
      method: 'POST',
      body: { pincode, order_value: orderValue },
    }),
};

export const couponApi = {
  validate: (code: string, cartTotal: number): Promise<CouponValidation> =>
    apiRequest('/coupons/validate', {
      method: 'POST',
      body: { code, cart_total: cartTotal },
    }),
};

export interface CreateOrderInput {
  shipping_address_id: number;
  payment_method: string;
  coupon_code?: string;
  customer_notes?: string;
  shipping_method?: string;
}

export const orderApi = {
  create: (data: CreateOrderInput): Promise<Order> =>
    apiRequest('/orders', { method: 'POST', body: data }),
  list: (page = 1, pageSize = 20): Promise<OrderList> =>
    apiRequest(`/orders?page=${page}&page_size=${pageSize}`, { method: 'GET' }),
  get: (id: number): Promise<Order> => apiRequest(`/orders/${id}`, { method: 'GET' }),
  cancel: (id: number): Promise<Order> =>
    apiRequest(`/orders/${id}/cancel`, { method: 'POST' }),
};
