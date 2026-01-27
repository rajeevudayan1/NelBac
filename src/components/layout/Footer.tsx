import React from 'react';
import logo from '@/assets/images/nelbac-logo-white.png';

const Footer: React.FC = () => {
  return (
    <footer className="py-32 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 text-center">
        <div className="flex justify-center mb-10">
          <img src={logo} alt="Nelbac" className="h-8 md:h-10 w-auto" />
        </div>
        <div className="flex justify-center gap-12 mb-10">
          <span className="glow-link text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] ml-4 flex items-center gap-2">
            <i className="fas fa-book text-xs"></i>
            Documentation
          </span>
          <span className="glow-link text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] ml-4 flex items-center gap-2">
            <i className="fas fa-signal text-xs"></i>
            API Status
          </span>
          <span className="glow-link text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] ml-4 flex items-center gap-2">
            <i className="fas fa-shield-alt text-xs"></i>
            Privacy
          </span>
        </div>
        <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[1em]">© 2024 NELBAC IOT SYSTEMS • AUTOMATE ANYTHING</p>
      </div>
    </footer>
  );
};

export default Footer;
