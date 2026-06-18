import React, { useEffect, useState } from 'react';
import { Page } from '@/types';
import { useAuth } from '@/context/AuthContext';
import ProfilePanel from './ProfilePanel';
import AddressBook from './AddressBook';
import OrdersPanel from './OrdersPanel';

interface AccountProps {
  onNavigate: (page: Page) => void;
  initialTab?: AccountTab;
}

type AccountTab = 'profile' | 'orders' | 'addresses';

const TABS: { id: AccountTab; label: string; icon: string }[] = [
  { id: 'profile', label: 'Profile', icon: 'fa-user' },
  { id: 'orders', label: 'My Orders', icon: 'fa-box' },
  { id: 'addresses', label: 'Addresses', icon: 'fa-location-dot' },
];

const Account: React.FC<AccountProps> = ({ onNavigate, initialTab = 'profile' }) => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<AccountTab>(initialTab);

  useEffect(() => setTab(initialTab), [initialTab]);

  const handleLogout = async () => {
    await logout();
    onNavigate(Page.Home);
  };

  return (
    <div className="pt-40 pb-32 max-w-6xl mx-auto px-6 md:px-8 min-h-screen">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-[var(--accent-solid)] text-[10px] font-black uppercase tracking-[0.5em]">My Account</span>
          <h2 className="text-6xl md:text-7xl font-black font-heading text-[var(--text-primary)] uppercase italic leading-none tracking-tighter mt-2">
            {user?.full_name?.split(' ')[0] || user?.username || 'Account'}.
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="interactive px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>Sign Out
        </button>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Tab nav */}
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`interactive whitespace-nowrap flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                tab === t.id
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)]'
              }`}
            >
              <i className={`fas ${t.icon} w-4`}></i>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Active panel */}
        <div>
          {tab === 'profile' && <ProfilePanel />}
          {tab === 'orders' && <OrdersPanel onNavigate={onNavigate} />}
          {tab === 'addresses' && <AddressBook />}
        </div>
      </div>
    </div>
  );
};

export default Account;
