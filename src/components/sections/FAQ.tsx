import React, { useState } from 'react';
import { Page } from '@/types';
import { FAQS } from '@/constants';

interface FAQProps {
  onNavigate: (page: Page) => void;
}

const FAQ: React.FC<FAQProps> = ({ onNavigate }) => {
  // Track open item as "categoryIndex-itemIndex"; first item open by default.
  const [openKey, setOpenKey] = useState<string | null>('0-0');

  return (
    <div className="pt-40 pb-32 max-w-4xl mx-auto px-6 md:px-8 min-h-screen">
      <div className="mb-16">
        <span className="text-[var(--accent-solid)] text-[10px] font-black uppercase tracking-[0.5em]">Support</span>
        <h2 className="text-6xl md:text-8xl font-black font-heading text-[var(--text-primary)] uppercase italic leading-none tracking-tighter mt-3">
          FAQ.
        </h2>
        <p className="text-[var(--text-secondary)] text-sm md:text-base font-light mt-6 max-w-xl">
          Everything you need to know about our controllers, ordering, delivery and your account.
        </p>
      </div>

      <div className="space-y-14">
        {FAQS.map((group, gIdx) => (
          <section key={group.category}>
            <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-[0.25em] text-[var(--text-primary)] mb-6">
              <i className={`fas ${group.icon} text-[var(--accent-solid)]`}></i>
              {group.category}
            </h3>

            <div className="space-y-3">
              {group.items.map((item, iIdx) => {
                const key = `${gIdx}-${iIdx}`;
                const open = openKey === key;
                return (
                  <div
                    key={key}
                    className={`glass rounded-[1.5rem] border transition-all ${open ? 'border-[var(--accent-solid)]/40' : 'border-[var(--border-secondary)]'}`}
                  >
                    <button
                      onClick={() => setOpenKey(open ? null : key)}
                      className="interactive w-full flex items-center justify-between gap-4 p-6 text-left"
                    >
                      <span className="font-black text-[var(--text-primary)] text-[15px] md:text-base">{item.q}</span>
                      <i className={`fas fa-plus text-[var(--accent-solid)] text-sm transition-transform duration-300 shrink-0 ${open ? 'rotate-45' : ''}`}></i>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 text-[var(--text-secondary)] text-sm font-light leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Still need help */}
      <div className="glass rounded-[2.5rem] p-10 md:p-12 border border-[var(--accent-solid)]/20 mt-20 text-center">
        <h3 className="text-2xl md:text-3xl font-black font-heading uppercase italic tracking-tighter text-[var(--text-primary)] mb-3">
          Still have questions?
        </h3>
        <p className="text-[var(--text-secondary)] text-sm font-light mb-8">
          Explore our controllers or learn more about what we do.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => onNavigate(Page.Products)}
            className="interactive px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-[#00f3ff] hover:text-black transition-all shadow-xl active:scale-95"
          >
            View Products
          </button>
          <button
            onClick={() => onNavigate(Page.AboutUs)}
            className="interactive px-8 py-4 border border-[var(--border-primary)] text-[var(--text-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:border-[var(--accent-solid)] transition-all active:scale-95"
          >
            About Nelbac
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
