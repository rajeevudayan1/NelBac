
import React from 'react';
import { Page } from '../types';

interface HeroProps {
  onExplore: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-20">
      {/* Localized 3D Grid Background */}
      <div className="hero-grid-container">
        <div className="grid-3d-floor"></div>
        <div className="grid-3d-scanline"></div>
      </div>

      {/* Background Ambience Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#00f3ff]/10 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 reveal-on-scroll active">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#00f3ff] shadow-[0_0_15px_#00f3ff]"></div>
              <span className="text-[10px] font-black tracking-[0.5em] text-[var(--accent-solid)] uppercase">
                EST. BANGALORE 2024
              </span>
            </div>
            
            <h1 className="text-7xl md:text-[120px] font-black font-heading leading-[0.8] tracking-tighter mb-10 text-[var(--text-primary)] uppercase italic">
              Automate<br />
              <span className="text-gradient not-italic">Anything.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-xl mb-16 font-light leading-relaxed">
              Precision-engineered IoT ecosystems. <span className="text-[var(--text-primary)] font-medium">Simplify labor</span>, maximize yield, and scale your infrastructure with Nelbac’s flagship NC Controller.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <button 
                onClick={() => onExplore(Page.Products)}
                className="group relative w-full sm:w-auto px-14 py-7 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-[#00f3ff] hover:text-black hover:scale-105 active:scale-95 shadow-xl"
              >
                Start Deployment
              </button>
              <button 
                onClick={() => onExplore(Page.Services)}
                className="group w-full sm:w-auto flex items-center justify-center gap-4 px-14 py-7 glass rounded-full font-black text-xs uppercase tracking-[0.3em] text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[#00f3ff]/50 transition-all"
              >
                Services <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-3 transition-transform"></i>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative perspective-2000">
            <div className="relative group animate-float">
              {/* Neon Glow Accents */}
              <div className="absolute -inset-4 bg-[#00f3ff]/10 rounded-[3rem] blur-3xl group-hover:bg-[#00f3ff]/20 transition-all"></div>
              
              <div className="relative glass border border-[var(--border-primary)] rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
                {/* Loop Video Replacement for Image */}
                <video 
                  src="https://cdn.pixabay.com/video/2020/05/25/40134-424919363_large.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                
                {/* Visual Storytelling Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/20 to-transparent"></div>
                
                <div className="absolute bottom-12 left-12 right-12">
                   <div className="flex items-center gap-3 mb-4">
                     <span className="w-2 h-2 rounded-full bg-[#00f3ff] shadow-[0_0_5px_#00f3ff] animate-pulse"></span>
                     <span className="text-[9px] font-black text-[var(--overlay-text)] uppercase tracking-widest">Active System Scan</span>
                   </div>
                   <h3 className="text-3xl font-bold text-[var(--overlay-text)] mb-2 font-heading uppercase italic">NC Flagship</h3>
                   <p className="text-[var(--text-secondary)] text-xs font-light tracking-wide">Multi-zone cloud-ready wireless infrastructure controller.</p>
                </div>
              </div>

              {/* Data Floating HUD */}
              <div className="absolute -right-8 top-1/4 glass p-6 rounded-2xl border border-[var(--border-primary)] shadow-2xl hidden xl:block backdrop-blur-3xl">
                <div className="flex flex-col gap-1">
                   <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase">Reliability</span>
                   <span className="text-xl font-black text-[var(--accent-solid)]">99.9% UP</span>
                   <div className="w-full h-1 bg-[var(--text-primary)]/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-[#00f3ff] w-full animate-pulse shadow-[0_0_10px_#00f3ff]"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
