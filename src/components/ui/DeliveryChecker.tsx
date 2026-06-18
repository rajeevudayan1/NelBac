import React, { useState } from 'react';
import type { DeliveryCheck } from '@/types';
import { deliveryApi } from '@/api/commerce';
import { ApiError } from '@/api/client';

interface DeliveryCheckerProps {
  // Order value used by the backend to compute delivery charge / free-delivery threshold.
  orderValue?: number;
}

const DeliveryChecker: React.FC<DeliveryCheckerProps> = ({ orderValue }) => {
  const [pincode, setPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<DeliveryCheck | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = pincode.trim();
    if (code.length < 3) {
      setError('Enter a valid pincode.');
      setResult(null);
      return;
    }
    setChecking(true);
    setError(null);
    setResult(null);
    try {
      setResult(await deliveryApi.check(code, orderValue));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not check delivery. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 border border-[var(--border-secondary)]">
      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-4">
        <i className="fas fa-truck-fast text-[var(--accent-solid)]"></i>
        Check Delivery
      </span>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="Enter pincode"
          className="flex-1 bg-[var(--input-bg)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[#00f3ff] transition-all"
        />
        <button
          type="submit"
          disabled={checking || pincode.trim().length < 3}
          className="interactive px-5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-[var(--accent-solid)] hover:text-black transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {checking ? '…' : 'Check'}
        </button>
      </form>

      {error && <p className="text-[11px] font-bold text-red-400 mt-3">{error}</p>}

      {result && (
        <div className="mt-4 text-[12px] font-medium">
          {result.is_available ? (
            <div className="space-y-1.5 text-[var(--text-primary)]">
              <p className="text-emerald-400 font-black uppercase tracking-wider text-[11px]">
                <i className="fas fa-circle-check mr-2"></i>
                Delivery available
                {result.city ? ` · ${result.city}${result.state ? `, ${result.state}` : ''}` : ''}
              </p>
              {result.estimated_delivery_days != null && (
                <p className="text-[var(--text-secondary)]">
                  <i className="fas fa-clock w-4 text-[var(--accent-solid)]"></i>
                  Arrives in ~{result.estimated_delivery_days} day{result.estimated_delivery_days === 1 ? '' : 's'}
                </p>
              )}
              <p className="text-[var(--text-secondary)]">
                <i className="fas fa-indian-rupee-sign w-4 text-[var(--accent-solid)]"></i>
                {result.delivery_charge > 0 ? `Delivery charge ₹${result.delivery_charge.toFixed(2)}` : 'Free delivery'}
              </p>
              <p className="text-[var(--text-secondary)]">
                <i className="fas fa-money-bill-wave w-4 text-[var(--accent-solid)]"></i>
                Cash on Delivery {result.is_cod_available ? 'available' : 'not available'}
              </p>
            </div>
          ) : (
            <p className="text-amber-500 font-bold">
              <i className="fas fa-circle-exclamation mr-2"></i>
              {result.message || 'Sorry, we don’t deliver to this pincode yet.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryChecker;
