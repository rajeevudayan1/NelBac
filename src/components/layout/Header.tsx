import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Page, SearchableItem } from '@/types';
import { NAV_ITEMS, SEARCHABLE_CONTENT } from '@/constants.ts';
import logo from '@/assets/images/nelbac-logo-white.png';
import nelbacIcon from '@/assets/images/nelbac-icon.png';

interface SearchResult extends SearchableItem {
  action: () => void;
}

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, cartCount }) => {
  const [isLight, setIsLight] = useState(document.documentElement.classList.contains('light'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Build searchable content with actions from constants
  const searchableContent = useMemo<SearchResult[]>(() => 
    SEARCHABLE_CONTENT.map(item => ({
      ...item,
      action: () => { setCurrentPage(item.targetPage); setIsSearchOpen(false); }
    })),
    [setCurrentPage]
  );

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = searchableContent.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
    setSearchResults(filtered.slice(0, 6));
  }, [searchQuery]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            {NAV_ITEMS.map((item) => (
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
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 ${isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900' : 'bg-white/5 text-slate-400 hover:text-[#00f3ff]'}`}
              title="Search (⌘K)"
            >
              <i className="fas fa-search text-xs md:text-sm"></i>
            </button>

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
            {NAV_ITEMS.map((item) => (
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

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          onClick={() => setIsSearchOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          {/* Search Container */}
          <div 
            className="relative w-full max-w-2xl mx-4 animate-[slideDown_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`rounded-[2rem] overflow-hidden border shadow-2xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}>
              {/* Search Input */}
              <div className={`flex items-center gap-4 px-8 py-6 border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <i className={`fas fa-search text-lg ${isLight ? 'text-slate-400' : 'text-[#00f3ff]'}`}></i>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, features, pages..."
                  className={`flex-1 bg-transparent outline-none text-lg font-medium ${isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'}`}
                />
                <kbd className={`hidden md:flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-slate-400'}`}>
                  ESC
                </kbd>
              </div>

              {/* Search Results */}
              <div className="max-h-[50vh] overflow-y-auto">
                {searchQuery.trim() === '' ? (
                  <div className={`px-8 py-12 text-center ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    <i className="fas fa-lightbulb text-2xl mb-4 block opacity-50"></i>
                    <p className="text-sm font-medium">Type to search across all content</p>
                    <p className="text-xs mt-2 opacity-70">Products • Features • Pages</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className={`px-8 py-12 text-center ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    <i className="fas fa-search text-2xl mb-4 block opacity-50"></i>
                    <p className="text-sm font-medium">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="py-4">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={result.action}
                        className={`w-full px-8 py-4 flex items-center gap-4 text-left transition-all ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          result.category === 'product' 
                            ? 'bg-[#00f3ff]/20' 
                            : result.category === 'feature'
                              ? (isLight ? 'bg-emerald-100' : 'bg-emerald-500/20')
                              : (isLight ? 'bg-slate-100' : 'bg-white/10')
                        }`}>
                          <img src={nelbacIcon} alt="" className="w-5 h-5 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{result.title}</p>
                          <p className={`text-xs truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{result.description}</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                          result.category === 'product'
                            ? 'bg-[#00f3ff]/20 text-[#00f3ff]'
                            : result.category === 'feature'
                              ? (isLight ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400')
                              : (isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-slate-400')
                        }`}>
                          {result.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`px-8 py-4 border-t flex items-center justify-between ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/5'}`}>
                <div className={`flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="flex items-center gap-1"><kbd className={`px-1.5 py-0.5 rounded ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>↑↓</kbd> Navigate</span>
                  <span className="flex items-center gap-1"><kbd className={`px-1.5 py-0.5 rounded ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>↵</kbd> Select</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  NELBAC_SEARCH
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
