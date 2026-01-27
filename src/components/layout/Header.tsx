import React, { useState } from 'react';
import { Page } from '@/types';
import logo from '@/assets/images/nelbac-logo-white.png';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, cartCount }) => {
  const [isLight, setIsLight] = useState(document.documentElement.classList.contains('light'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    document.documentElement.classList.add('theme-transition');
    const newStatus = !isLight;
    setIsLight(newStatus);
    
    if (newStatus) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  };

  const navItems = ['Home', 'Products', 'Services', 'Blog'];

  const handleNavClick = (e: React.MouseEvent, item: string) => {
    e.preventDefault();
    setCurrentPage(item.toLowerCase() as Page);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="glass rounded-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between border border-white/10 shadow-2xl relative">
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#00f3ff] transition-colors"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
          </button>

          {/* Logo */}
          <a 
            href="#"
            className="flex items-center cursor-none group"
            onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Home); }}
          >
            <img 
              src={logo} 
              alt="Nelbac" 
              className={`h-6 md:h-8 w-auto transition-all group-hover:scale-105 ${isLight ? 'brightness-0' : 'brightness-100'}`}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`glow-link text-[10px] font-black uppercase tracking-[0.3em] transition-all ml-4 ${currentPage === item.toLowerCase() ? 'active text-[#00f3ff]' : (isLight ? 'text-slate-500' : 'text-slate-400')}`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
            <a 
              href="#"
              onClick={toggleTheme}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-white/5 text-[#00f3ff]'}`}
              title="Switch Theme"
            >
              <i className={`fas ${isLight ? 'fa-moon' : 'fa-sun'} text-xs md:text-sm`}></i>
            </a>

            <a 
              href="#cart"
              onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Cart); }}
              className={`relative transition-colors w-8 h-8 md:w-10 md:h-10 flex items-center justify-center ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-[#00f3ff]'}`}
            >
              <i className="fas fa-shopping-bag text-base md:text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#00f3ff] text-black text-[7px] md:text-[8px] font-black w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center rounded-full shadow-[0_0_5px_#00f3ff]">
                  {cartCount}
                </span>
              )}
            </a>

            <a 
              href="https://app.nelbac.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:block px-4 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black hover:bg-[#00f3ff]'}`}
            >
              Portal
            </a>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out mt-4 overflow-hidden ${isMenuOpen ? 'max-h-[400px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}>
          <div className="glass rounded-[2rem] p-6 border border-white/10 shadow-2xl flex flex-col gap-2">
            {navItems.map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`w-full text-left px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.4em] transition-all ${
                  currentPage === item.toLowerCase() 
                  ? 'bg-[#00f3ff] text-black shadow-[0_0_20px_rgba(0,243,255,0.3)]' 
                  : (isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5')
                }`}
              >
                {item}
              </a>
            ))}
            <a 
              href="https://app.nelbac.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`sm:hidden w-full text-left px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.4em] mt-2 ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}
            >
              System Portal <i className="fas fa-external-link-alt ml-2 text-[8px]"></i>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
