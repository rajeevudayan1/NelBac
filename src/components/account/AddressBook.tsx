import React, { useEffect, useState } from 'react';
import type { Address } from '@/types';
import { addressApi } from '@/api/commerce';
import { ApiError } from '@/api/client';
import AddressForm from './AddressForm';
import { primaryBtn } from './formStyles';

const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    addressApi
      .list()
      .then((list) => { if (!cancelled) setAddresses(list); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : 'Could not load addresses.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (addr: Address) => { setEditing(addr); setShowForm(true); };

  const handleSaved = (saved: Address) => {
    setAddresses((prev) => {
      const exists = prev.some((a) => a.id === saved.id);
      const next = exists ? prev.map((a) => (a.id === saved.id ? saved : a)) : [...prev, saved];
      // If this one became default, clear the flag on the others locally.
      return saved.is_default ? next.map((a) => (a.id === saved.id ? a : { ...a, is_default: false })) : next;
    });
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this address?')) return;
    setBusyId(id);
    setError(null);
    try {
      await addressApi.remove(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete address.');
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    setBusyId(id);
    setError(null);
    try {
      await addressApi.setDefault(id);
      setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update default.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p className="text-[var(--text-secondary)] uppercase font-black tracking-[0.5em] text-[10px]">Loading addresses…</p>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-[12px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4">{error}</p>
      )}

      {showForm ? (
        <div className="glass rounded-[2rem] p-8 border border-[var(--border-secondary)]">
          <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[var(--text-primary)] mb-6">
            {editing ? 'Edit Address' : 'New Address'}
          </h3>
          <AddressForm initial={editing} onSaved={handleSaved} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-[var(--text-secondary)] text-sm font-medium">
              {addresses.length === 0 ? 'No addresses saved yet.' : `${addresses.length} saved address${addresses.length === 1 ? '' : 'es'}`}
            </p>
            <button onClick={openAdd} className={primaryBtn}>+ Add Address</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="glass rounded-[2rem] p-6 border border-[var(--border-secondary)] flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <p className="font-black text-[var(--text-primary)] uppercase tracking-tight">{addr.full_name}</p>
                  {addr.is_default && (
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-[#00f3ff]/20 text-[var(--accent-solid)]">Default</span>
                  )}
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed flex-1">
                  {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}<br />
                  {addr.city}, {addr.state} {addr.postal_code}<br />
                  {addr.country}<br />
                  <span className="text-[var(--text-primary)] font-bold">{addr.phone}</span>
                </p>
                <div className="flex gap-4 mt-5 pt-4 border-t border-[var(--border-primary)] text-[10px] font-black uppercase tracking-[0.2em]">
                  <button onClick={() => openEdit(addr)} className="interactive text-[var(--accent-solid)] hover:underline">Edit</button>
                  {!addr.is_default && (
                    <button onClick={() => handleSetDefault(addr.id)} disabled={busyId === addr.id} className="interactive text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40">
                      Set Default
                    </button>
                  )}
                  <button onClick={() => handleDelete(addr.id)} disabled={busyId === addr.id} className="interactive text-red-400 hover:underline ml-auto disabled:opacity-40">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AddressBook;
