import React, { useEffect, useState } from 'react';
import type { Order } from '@/types';
import { Page } from '@/types';
import { orderApi } from '@/api/commerce';
import { ApiError } from '@/api/client';

interface OrdersPanelProps {
  onNavigate: (page: Page) => void;
}

const money = (n: number) => `₹${n.toFixed(2)}`;

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-400/20 text-amber-500',
  confirmed: 'bg-[#00f3ff]/20 text-[var(--accent-solid)]',
  processing: 'bg-[#00f3ff]/20 text-[var(--accent-solid)]',
  shipped: 'bg-blue-400/20 text-blue-400',
  delivered: 'bg-emerald-500/20 text-emerald-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const CANCELLABLE = new Set(['pending', 'confirmed']);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const OrdersPanel: React.FC<OrdersPanelProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    orderApi
      .list(1, 50)
      .then((res) => { if (!cancelled) setOrders(res.items); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : 'Could not load orders.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Cancel this order?')) return;
    setCancellingId(id);
    setError(null);
    try {
      const updated = await orderApi.cancel(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <p className="text-[var(--text-secondary)] uppercase font-black tracking-[0.5em] text-[10px]">Loading orders…</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="glass p-16 rounded-[3rem] text-center border-dashed border-[var(--border-primary)]">
        <p className="text-[var(--text-secondary)] uppercase font-black tracking-[0.5em] text-[10px] mb-6">No orders yet.</p>
        <button onClick={() => onNavigate(Page.Products)} className="interactive text-[var(--accent-solid)] font-black uppercase tracking-[0.4em] text-xs hover:underline">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-[12px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4">{error}</p>
      )}

      {orders.map((order) => {
        const status = (order.status || '').toLowerCase();
        const paymentStatus = (order.payment_status || '').toLowerCase();
        const open = expandedId === order.id;
        return (
          <div key={order.id} className="glass rounded-[2rem] border border-[var(--border-secondary)] overflow-hidden">
            <button
              onClick={() => setExpandedId(open ? null : order.id)}
              className="interactive w-full flex items-center justify-between gap-4 p-6 text-left"
            >
              <div className="min-w-0">
                <p className="font-black font-mono text-[var(--text-primary)] truncate">{order.order_number}</p>
                <p className="text-[11px] text-[var(--text-secondary)] font-bold mt-1">
                  {formatDate(order.created_at)} · {order.items.length} item{order.items.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${STATUS_STYLES[status] || 'bg-white/10 text-[var(--text-secondary)]'}`}>
                  {order.status}
                </span>
                <span className="font-black font-heading italic text-lg text-[var(--text-primary)]">{money(order.total)}</span>
                <i className={`fas fa-chevron-down text-[10px] text-[var(--text-secondary)] transition-transform ${open ? 'rotate-180' : ''}`}></i>
              </div>
            </button>

            {open && (
              <div className="px-6 pb-6 border-t border-[var(--border-primary)]">
                <div className="space-y-3 py-5">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center text-sm">
                      <span className="text-[var(--text-primary)] font-bold">{it.product_name} <span className="text-[var(--text-secondary)] font-medium">× {it.quantity}</span></span>
                      <span className="text-[var(--text-secondary)] font-bold">{money(it.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 py-4 border-t border-[var(--border-primary)] text-[13px]">
                  <div className="flex justify-between text-[var(--text-secondary)] font-bold"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
                  {order.discount > 0 && <div className="flex justify-between text-emerald-400 font-bold"><span>Discount</span><span>−{money(order.discount)}</span></div>}
                  {order.shipping_cost > 0 && <div className="flex justify-between text-[var(--text-secondary)] font-bold"><span>Delivery</span><span>{money(order.shipping_cost)}</span></div>}
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--border-primary)]">
                    <span className="font-black uppercase tracking-widest text-[var(--text-primary)]">Total</span>
                    <span className="text-2xl font-black font-heading italic text-[var(--text-primary)]">{money(order.total)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-primary)]">
                  <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'} · {paymentStatus}
                  </span>
                  {CANCELLABLE.has(status) && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                      className="interactive text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:underline disabled:opacity-40"
                    >
                      {cancellingId === order.id ? 'Cancelling…' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersPanel;
