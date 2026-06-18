import React, { useEffect, useMemo, useState } from 'react';
import { Page } from '@/types';
import type {
  Address,
  AddressInput,
  BackendProduct,
  CartItem,
  CouponValidation,
  DeliveryCheck,
  Order,
} from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/api/client';
import { addressApi, cartApi, catalogApi, couponApi, deliveryApi, orderApi } from '@/api/commerce';

interface CheckoutProps {
  cart: CartItem[];
  onOrderPlaced: () => void;
  onNavigate: (page: Page) => void;
}

type Phase = 'loading' | 'form' | 'placing' | 'success';
type PaymentMethod = 'cod' | 'online';

// Each local cart line matched to a backend product (integer id + live stock).
interface ResolvedItem {
  item: CartItem;
  backendId: number;
  price: number;
  stock: number;
}

const money = (n: number) => `₹${n.toFixed(2)}`;
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const labelClass = 'block text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-2';
const inputClass =
  'w-full bg-[var(--input-bg)] border border-[var(--border-primary)] rounded-2xl px-5 py-4 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[#00f3ff] transition-all';

const emptyAddress = (fullName = '', phone = ''): AddressInput => ({
  full_name: fullName,
  phone,
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'India',
  is_shipping: true,
});

const Checkout: React.FC<CheckoutProps> = ({ cart, onOrderPlaced, onNavigate }) => {
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [resolved, setResolved] = useState<ResolvedItem[]>([]);
  const [unresolved, setUnresolved] = useState<string[]>([]);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressInput>(emptyAddress());
  const [savingAddress, setSavingAddress] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryCheck | null>(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  // Ad-hoc delivery check for the pincode typed into the new-address form.
  const [formDelivery, setFormDelivery] = useState<DeliveryCheck | null>(null);
  const [checkingForm, setCheckingForm] = useState(false);
  const [formDeliveryError, setFormDeliveryError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [notes, setNotes] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);

  const subtotal = useMemo(
    () => resolved.reduce((acc, r) => acc + r.price * r.item.quantity, 0),
    [resolved]
  );
  const discount = appliedCoupon?.is_valid ? appliedCoupon.discount_amount : 0;
  const total = Math.max(0, subtotal - discount);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  // Load backend products + saved addresses; map the local cart to backend ids.
  useEffect(() => {
    // Once an order is placed (or is being placed) the local cart is cleared by
    // the parent — don't let that re-entry reset us off the success screen.
    if (phase === 'success' || phase === 'placing') return;
    let cancelled = false;
    (async () => {
      if (cart.length === 0) {
        setPhase('form');
        return;
      }
      try {
        const [productsPage, savedAddresses] = await Promise.all([
          catalogApi.listProducts(),
          addressApi.list().catch(() => [] as Address[]),
        ]);
        if (cancelled) return;

        const backend = productsPage.items || [];
        const findMatch = (item: CartItem): BackendProduct | undefined => {
          const keys = new Set([normalize(item.product.id), normalize(item.product.name)]);
          return backend.find(
            (bp) =>
              keys.has(normalize(bp.slug)) ||
              keys.has(normalize(bp.sku)) ||
              keys.has(normalize(bp.name))
          );
        };

        const matched: ResolvedItem[] = [];
        const missing: string[] = [];
        for (const item of cart) {
          const bp = findMatch(item);
          if (bp) matched.push({ item, backendId: bp.id, price: bp.price, stock: bp.stock_quantity });
          else missing.push(item.product.name);
        }

        setResolved(matched);
        setUnresolved(missing);
        setAddresses(savedAddresses);

        const preferred = savedAddresses.find((a) => a.is_default) || savedAddresses[0];
        if (preferred) setSelectedAddressId(preferred.id);
        else setShowAddressForm(true);

        setNewAddress(emptyAddress(user?.full_name || '', user?.phone || ''));
        setPhase('form');
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : 'Could not load checkout. Please try again.'
        );
        setPhase('form');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cart, user]);

  // Best-effort delivery serviceability for the selected address pincode.
  useEffect(() => {
    if (!selectedAddress) {
      setDelivery(null);
      return;
    }
    let cancelled = false;
    setCheckingDelivery(true);
    deliveryApi
      .check(selectedAddress.postal_code, subtotal)
      .then((res) => {
        if (cancelled) return;
        setDelivery(res);
        if (!res.is_cod_available && paymentMethod === 'cod') setPaymentMethod('online');
      })
      .catch(() => {
        if (!cancelled) setDelivery(null); // non-blocking
      })
      .finally(() => {
        if (!cancelled) setCheckingDelivery(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId]);

  const checkFormDelivery = async () => {
    const code = newAddress.postal_code.trim();
    if (code.length < 3) {
      setFormDeliveryError('Enter a valid pincode.');
      setFormDelivery(null);
      return;
    }
    setCheckingForm(true);
    setFormDeliveryError(null);
    setFormDelivery(null);
    try {
      setFormDelivery(await deliveryApi.check(code, subtotal));
    } catch (err) {
      setFormDeliveryError(err instanceof ApiError ? err.message : 'Could not check delivery.');
    } finally {
      setCheckingForm(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setFormError(null);
    try {
      const created = await addressApi.create({ ...newAddress, is_shipping: true });
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await couponApi.validate(code, subtotal);
      if (res.is_valid) {
        setAppliedCoupon(res);
      } else {
        setAppliedCoupon(null);
        setCouponError(res.message || 'Invalid coupon code.');
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err instanceof ApiError ? err.message : 'Could not validate coupon.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const stockProblem = resolved.find((r) => r.stock < r.item.quantity);
  const canPlaceOrder =
    phase === 'form' &&
    resolved.length > 0 &&
    unresolved.length === 0 &&
    !stockProblem &&
    selectedAddressId !== null;

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder || selectedAddressId === null) return;
    setPhase('placing');
    setFormError(null);
    try {
      // Mirror the local cart into the server cart (exact quantities).
      await cartApi.clear();
      for (const r of resolved) {
        await cartApi.addItem(r.backendId, r.item.quantity);
      }

      const created = await orderApi.create({
        shipping_address_id: selectedAddressId,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon?.is_valid ? couponCode.trim() : undefined,
        customer_notes: notes.trim() || undefined,
      });

      setOrder(created);
      onOrderPlaced(); // clear the local cart
      setPhase('success');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Could not place your order. Please try again.'
      );
      setPhase('form');
    }
  };

  // ---- Success screen --------------------------------------------------------
  if (phase === 'success' && order) {
    return (
      <div className="pt-48 pb-32 max-w-3xl mx-auto px-8 min-h-screen">
        <div className="glass rounded-[3rem] p-12 md:p-16 border border-[var(--accent-solid)]/30 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#00f3ff] text-black flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,243,255,0.5)]">
            <i className="fas fa-check text-3xl"></i>
          </div>
          <h2 className="text-5xl font-black font-heading uppercase italic tracking-tighter text-[var(--text-primary)] mb-4">
            Order Placed.
          </h2>
          <p className="text-[var(--text-secondary)] text-sm font-medium mb-10">
            Thank you{user?.full_name ? `, ${user.full_name}` : ''}. Your order has been received.
          </p>

          <div className="bg-[var(--input-bg)] rounded-[2rem] p-8 text-left space-y-4 mb-10 border border-[var(--border-primary)]">
            <div className="flex justify-between items-center">
              <span className={labelClass + ' mb-0'}>Order Number</span>
              <span className="font-black font-mono text-[var(--accent-solid)]">{order.order_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={labelClass + ' mb-0'}>Payment</span>
              <span className="text-sm font-bold text-[var(--text-primary)] uppercase">
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'} · {order.payment_status}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-[var(--border-primary)]">
              <span className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)]">Total</span>
              <span className="text-3xl font-black font-heading italic text-[var(--text-primary)]">{money(order.total)}</span>
            </div>
          </div>

          {paymentMethod === 'online' && (
            <p className="text-[11px] text-[var(--text-secondary)] mb-8">
              Our team will share a secure payment link to complete your purchase.
            </p>
          )}

          <button
            onClick={() => onNavigate(Page.Products)}
            className="interactive px-10 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-[#00f3ff] hover:text-black transition-all shadow-xl active:scale-95"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ---- Empty cart guard ------------------------------------------------------
  if (cart.length === 0) {
    return (
      <div className="pt-48 max-w-3xl mx-auto px-8 min-h-screen text-center">
        <h2 className="text-6xl font-black font-heading uppercase italic tracking-tighter text-[var(--text-primary)] mb-8">
          Checkout.
        </h2>
        <div className="glass p-20 rounded-[3rem] border-dashed border-[var(--border-primary)]">
          <p className="text-[var(--text-secondary)] uppercase font-black tracking-[0.6em] text-[10px] mb-8">
            Your cart is empty.
          </p>
          <button
            onClick={() => onNavigate(Page.Products)}
            className="interactive text-[var(--accent-solid)] font-black uppercase tracking-[0.4em] text-xs hover:underline"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // ---- Checkout form ---------------------------------------------------------
  return (
    <div className="pt-40 pb-32 max-w-6xl mx-auto px-6 md:px-8 min-h-screen">
      <h2 className="text-6xl md:text-7xl font-black font-heading text-[var(--text-primary)] mb-12 uppercase italic leading-none tracking-tighter">
        Checkout.
      </h2>

      {loadError && (
        <p className="mb-8 text-[12px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4">
          {loadError}
        </p>
      )}

      {phase === 'loading' ? (
        <div className="glass p-20 rounded-[3rem] text-center text-[var(--text-secondary)] uppercase font-black tracking-[0.5em] text-[10px]">
          Preparing checkout…
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT: details */}
          <div className="space-y-8">
            {unresolved.length > 0 && (
              <p className="text-[12px] font-bold text-amber-500 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-5 py-4">
                These items aren't available for online order: {unresolved.join(', ')}. Please remove them from your cart.
              </p>
            )}

            {/* Shipping address */}
            <section className="glass rounded-[2rem] p-8 border border-[var(--border-secondary)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  <i className="fas fa-location-dot text-[var(--accent-solid)] mr-3"></i>Shipping Address
                </h3>
                {addresses.length > 0 && !showAddressForm && (
                  <button
                    onClick={() => { setNewAddress(emptyAddress(user?.full_name || '', user?.phone || '')); setShowAddressForm(true); }}
                    className="interactive text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-solid)] hover:underline"
                  >
                    + New
                  </button>
                )}
              </div>

              {!showAddressForm && addresses.length > 0 && (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`interactive flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-[var(--accent-solid)] bg-[var(--accent-solid)]/5'
                          : 'border-[var(--border-primary)] hover:border-[var(--accent-solid)]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-[#00f3ff]"
                      />
                      <div className="text-sm">
                        <p className="font-black text-[var(--text-primary)]">{addr.full_name} · {addr.phone}</p>
                        <p className="text-[var(--text-secondary)] mt-1">
                          {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input required value={newAddress.full_name} onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input required value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Address Line 1</label>
                    <input required value={newAddress.address_line1} onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Address Line 2 (optional)</label>
                    <input value={newAddress.address_line2} onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <input required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <input required value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Postal Code</label>
                      <div className="flex gap-2">
                        <input
                          required
                          value={newAddress.postal_code}
                          onChange={(e) => {
                            setNewAddress({ ...newAddress, postal_code: e.target.value });
                            setFormDelivery(null);
                            setFormDeliveryError(null);
                          }}
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={checkFormDelivery}
                          disabled={checkingForm || newAddress.postal_code.trim().length < 3}
                          className="interactive shrink-0 px-4 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.2em] text-[9px] rounded-2xl hover:bg-[#00f3ff] hover:text-black transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {checkingForm ? '…' : 'Check'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input required value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} className={inputClass} />
                    </div>
                  </div>

                  {/* Delivery availability for the typed pincode */}
                  {formDeliveryError && (
                    <p className="text-[11px] font-bold text-red-400">{formDeliveryError}</p>
                  )}
                  {formDelivery && (
                    <div className="text-[11px] font-bold">
                      {formDelivery.is_available ? (
                        <span className="text-emerald-400">
                          <i className="fas fa-truck-fast mr-2"></i>
                          Delivers to {formDelivery.pincode}
                          {formDelivery.city ? ` · ${formDelivery.city}${formDelivery.state ? `, ${formDelivery.state}` : ''}` : ''}
                          {formDelivery.estimated_delivery_days ? ` · ~${formDelivery.estimated_delivery_days} days` : ''}
                          {formDelivery.delivery_charge > 0 ? ` · Delivery ${money(formDelivery.delivery_charge)}` : ' · Free delivery'}
                          {formDelivery.is_cod_available ? ' · COD available' : ''}
                        </span>
                      ) : (
                        <span className="text-amber-500">
                          <i className="fas fa-circle-exclamation mr-2"></i>
                          {formDelivery.message || 'We don’t deliver to this pincode yet.'}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="interactive px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-[#00f3ff] hover:text-black transition-all disabled:opacity-50"
                    >
                      {savingAddress ? 'Saving…' : 'Save Address'}
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="interactive px-6 py-3 text-[var(--text-secondary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:text-[var(--text-primary)] transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Delivery serviceability */}
              {selectedAddress && (
                <div className="mt-5 text-[11px] font-bold">
                  {checkingDelivery ? (
                    <span className="text-[var(--text-secondary)] uppercase tracking-widest">Checking delivery…</span>
                  ) : delivery ? (
                    delivery.is_available ? (
                      <span className="text-emerald-400">
                        <i className="fas fa-truck-fast mr-2"></i>
                        Delivers to {delivery.pincode}
                        {delivery.estimated_delivery_days ? ` in ~${delivery.estimated_delivery_days} days` : ''}
                        {delivery.delivery_charge > 0 ? ` · Delivery ${money(delivery.delivery_charge)}` : ' · Free delivery'}
                      </span>
                    ) : (
                      <span className="text-amber-500">
                        <i className="fas fa-circle-exclamation mr-2"></i>
                        {delivery.message || 'Delivery may be limited for this pincode.'}
                      </span>
                    )
                  ) : null}
                </div>
              )}
            </section>

            {/* Payment method */}
            <section className="glass rounded-[2rem] p-8 border border-[var(--border-secondary)]">
              <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[var(--text-primary)] mb-6">
                <i className="fas fa-wallet text-[var(--accent-solid)] mr-3"></i>Payment Method
              </h3>
              <div className="space-y-3">
                {([
                  { id: 'cod' as const, label: 'Cash on Delivery', desc: 'Pay when your order arrives.', disabled: !!delivery && !delivery.is_cod_available },
                  { id: 'online' as const, label: 'Online / Bank Transfer', desc: 'We’ll share a secure payment link.', disabled: false },
                ]).map((opt) => (
                  <label
                    key={opt.id}
                    className={`interactive flex gap-4 p-5 rounded-2xl border transition-all ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed border-[var(--border-primary)]'
                        : paymentMethod === opt.id
                          ? 'border-[var(--accent-solid)] bg-[var(--accent-solid)]/5 cursor-pointer'
                          : 'border-[var(--border-primary)] hover:border-[var(--accent-solid)]/50 cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      disabled={opt.disabled}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="mt-1 accent-[#00f3ff]"
                    />
                    <div className="text-sm">
                      <p className="font-black text-[var(--text-primary)]">{opt.label}</p>
                      <p className="text-[var(--text-secondary)] text-[12px] mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Order notes */}
            <section className="glass rounded-[2rem] p-8 border border-[var(--border-secondary)]">
              <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[var(--text-primary)] mb-6">
                <i className="fas fa-note-sticky text-[var(--accent-solid)] mr-3"></i>Order Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Delivery instructions, landmarks, etc. (optional)"
                className={inputClass}
              />
            </section>
          </div>

          {/* RIGHT: summary */}
          <aside className="lg:sticky lg:top-32 h-fit">
            <div className="glass rounded-[2rem] p-8 border border-[var(--accent-solid)]/20 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Summary</h3>

              <div className="space-y-4">
                {resolved.map((r) => (
                  <div key={r.item.product.id} className="flex items-center gap-4">
                    <img src={r.item.product.image} alt="" className="w-14 h-14 rounded-xl object-cover grayscale opacity-70" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[var(--text-primary)] truncate uppercase">{r.item.product.name}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-bold">Qty {r.item.quantity} · {money(r.price)}</p>
                      {r.stock < r.item.quantity && (
                        <p className="text-[10px] text-red-400 font-bold mt-1">Only {r.stock} in stock</p>
                      )}
                    </div>
                    <span className="font-black text-[var(--text-primary)] text-sm">{money(r.price * r.item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="pt-4 border-t border-[var(--border-primary)]">
                {appliedCoupon?.is_valid ? (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                      <i className="fas fa-tag mr-2"></i>{couponCode.trim().toUpperCase()}
                    </span>
                    <button onClick={removeCoupon} className="interactive text-[10px] font-black uppercase text-[var(--text-secondary)] hover:text-red-400">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className={inputClass + ' py-3 text-xs'}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="interactive px-5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#00f3ff] hover:text-black transition-all disabled:opacity-50"
                    >
                      {validatingCoupon ? '…' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[10px] text-red-400 font-bold mt-2">{couponError}</p>}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-primary)] text-sm">
                <div className="flex justify-between text-[var(--text-secondary)] font-bold">
                  <span>Subtotal</span><span>{money(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount</span><span>−{money(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-[var(--border-primary)]">
                  <span className="font-black uppercase tracking-widest text-[var(--text-primary)]">Total</span>
                  <span className="text-3xl font-black font-heading italic text-[var(--text-primary)]">{money(total)}</span>
                </div>
              </div>

              {formError && (
                <p className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  {formError}
                </p>
              )}

              {!selectedAddressId && !showAddressForm && (
                <p className="text-[11px] font-bold text-amber-500">Select or add a shipping address to continue.</p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder || phase === 'placing'}
                className="interactive w-full py-6 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-[#00f3ff] hover:text-black transition-all shadow-xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {phase === 'placing' ? 'Placing Order…' : `Place Order · ${money(total)}`}
              </button>

              <button
                onClick={() => onNavigate(Page.Cart)}
                className="interactive w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ← Back to Cart
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Checkout;
