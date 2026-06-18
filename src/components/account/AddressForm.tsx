import React, { useState } from 'react';
import type { Address, AddressInput, DeliveryCheck } from '@/types';
import { addressApi, deliveryApi } from '@/api/commerce';
import { ApiError } from '@/api/client';
import { labelClass, inputClass, primaryBtn, ghostBtn } from './formStyles';

interface AddressFormProps {
  initial?: Address | null;
  onSaved: (address: Address) => void;
  onCancel: () => void;
}

const toInput = (a?: Address | null): AddressInput => ({
  full_name: a?.full_name || '',
  phone: a?.phone || '',
  address_line1: a?.address_line1 || '',
  address_line2: a?.address_line2 || '',
  city: a?.city || '',
  state: a?.state || '',
  postal_code: a?.postal_code || '',
  country: a?.country || 'India',
  is_default: a?.is_default || false,
  is_shipping: true,
});

const AddressForm: React.FC<AddressFormProps> = ({ initial, onSaved, onCancel }) => {
  const [form, setForm] = useState<AddressInput>(toInput(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [delivery, setDelivery] = useState<DeliveryCheck | null>(null);
  const [checking, setChecking] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  const set = (patch: Partial<AddressInput>) => setForm((prev) => ({ ...prev, ...patch }));

  const checkDelivery = async () => {
    const code = form.postal_code.trim();
    if (code.length < 3) {
      setDeliveryError('Enter a valid pincode.');
      setDelivery(null);
      return;
    }
    setChecking(true);
    setDeliveryError(null);
    setDelivery(null);
    try {
      setDelivery(await deliveryApi.check(code));
    } catch (err) {
      setDeliveryError(err instanceof ApiError ? err.message : 'Could not check delivery.');
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const saved = initial
        ? await addressApi.update(initial.id, form)
        : await addressApi.create(form);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save address.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input required value={form.full_name} onChange={(e) => set({ full_name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input required value={form.phone} onChange={(e) => set({ phone: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Address Line 1</label>
        <input required value={form.address_line1} onChange={(e) => set({ address_line1: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Address Line 2 (optional)</label>
        <input value={form.address_line2} onChange={(e) => set({ address_line2: e.target.value })} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input required value={form.city} onChange={(e) => set({ city: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input required value={form.state} onChange={(e) => set({ state: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Postal Code</label>
          <div className="flex gap-2">
            <input
              required
              value={form.postal_code}
              onChange={(e) => { set({ postal_code: e.target.value }); setDelivery(null); setDeliveryError(null); }}
              className={inputClass}
            />
            <button
              type="button"
              onClick={checkDelivery}
              disabled={checking || form.postal_code.trim().length < 3}
              className="interactive shrink-0 px-4 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.2em] text-[9px] rounded-2xl hover:bg-[#00f3ff] hover:text-black transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {checking ? '…' : 'Check'}
            </button>
          </div>
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input required value={form.country} onChange={(e) => set({ country: e.target.value })} className={inputClass} />
        </div>
      </div>

      {deliveryError && <p className="text-[11px] font-bold text-red-400">{deliveryError}</p>}
      {delivery && (
        <p className="text-[11px] font-bold">
          {delivery.is_available ? (
            <span className="text-emerald-400">
              <i className="fas fa-truck-fast mr-2"></i>
              Delivers to {delivery.pincode}
              {delivery.city ? ` · ${delivery.city}${delivery.state ? `, ${delivery.state}` : ''}` : ''}
              {delivery.estimated_delivery_days ? ` · ~${delivery.estimated_delivery_days} days` : ''}
              {delivery.is_cod_available ? ' · COD available' : ''}
            </span>
          ) : (
            <span className="text-amber-500">
              <i className="fas fa-circle-exclamation mr-2"></i>
              {delivery.message || 'We don’t deliver to this pincode yet.'}
            </span>
          )}
        </p>
      )}

      <label className="flex items-center gap-3 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={!!form.is_default}
          onChange={(e) => set({ is_default: e.target.checked })}
          className="accent-[#00f3ff] w-4 h-4"
        />
        Set as default address
      </label>

      {error && (
        <p className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className={primaryBtn}>
          {saving ? 'Saving…' : initial ? 'Update Address' : 'Save Address'}
        </button>
        <button type="button" onClick={onCancel} className={ghostBtn}>Cancel</button>
      </div>
    </form>
  );
};

export default AddressForm;
