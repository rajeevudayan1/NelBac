import React, { useState, useEffect, useRef } from 'react';
import { COMPANY_INFO, COMPANY_STATS, COMPANY_VALUES, MILESTONES, PARTNERS } from '@/constants.ts';
import nelbacIcon from '@/assets/images/nelbac-icon.png';
import { Page } from '@/types';

interface AboutUsProps {
  onNavigate?: (page: Page) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onNavigate }) => {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll position for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2, rootMargin: '-50px' }
    );

    const refs = [statsRef, missionRef, valuesRef, timelineRef, partnersRef];
    refs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Animate counters when stats section is visible
  useEffect(() => {
    if (!isVisible['stats-section']) return;
    
    const targets = COMPANY_STATS.map(stat => parseFloat(stat.value.replace(/[^0-9.]/g, '')));
    const duration = 2500;
    const steps = 80;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 4);
      
      setCounters(targets.map(target => Math.floor(target * eased)));
      
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible['stats-section']]);

  // Auto-advance timeline
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTimelineIdx(prev => (prev + 1) % MILESTONES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      
      {/* ===== IMMERSIVE HERO SECTION ===== */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(var(--accent-solid) 1px, transparent 1px),
                linear-gradient(90deg, var(--accent-solid) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        </div>

        {/* Floating Orbs with Parallax */}
        <div 
          className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,243,255,0.15) 0%, transparent 70%)',
            transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30 + scrollY * 0.1}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        <div 
          className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,243,255,0.1) 0%, transparent 70%)',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20 - scrollY * 0.05}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />

        {/* Animated Geometric Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#00f3ff]/30 rounded-full animate-pulse"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text Content */}
            <div className="space-y-8">
              {/* Animated Tag */}
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="h-px w-0 bg-[var(--accent-solid)] animate-[expandWidth_1s_ease-out_0.5s_forwards] shadow-[0_0_15px_rgba(0,243,255,0.6)]"></div>
                <span className="text-[var(--accent-solid)] font-black text-[10px] md:text-[11px] tracking-[0.5em] uppercase opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
                  BANGALORE • EST. 2018
                </span>
              </div>

              {/* Main Heading with Stagger Animation */}
              <div className="overflow-hidden">
                <h1 className="text-6xl md:text-8xl lg:text-[130px] font-black font-heading text-[var(--text-primary)] uppercase italic leading-[0.85] tracking-tighter">
                  <span className="block opacity-0 animate-[slideInUp_0.8s_ease-out_0.3s_forwards]">We Are</span>
                  <span className="block text-gradient not-italic opacity-0 animate-[slideInUp_0.8s_ease-out_0.5s_forwards]">Nelbac.</span>
                </h1>
              </div>

              {/* Description with fade */}
              <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-xl font-light leading-relaxed opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
                Pioneering smart irrigation technology from the heart of India. 
                <span className="text-[var(--text-primary)] font-medium"> Making automation aspirational</span> for farmers, landscapers, and homeowners worldwide.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.2s_forwards]">
                <button 
                  onClick={() => onNavigate?.(Page.Products)}
                  className="group relative px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.2em] text-[10px] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">Explore Products</span>
                  <div className="absolute inset-0 bg-[#00f3ff] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                <button className="group px-8 py-4 glass border border-[var(--border-primary)] text-[var(--text-primary)] font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:border-[#00f3ff]/50 transition-all flex items-center gap-3">
                  Watch Our Story
                  <div className="w-6 h-6 rounded-full bg-[#00f3ff]/20 flex items-center justify-center group-hover:bg-[#00f3ff]/40 transition-colors">
                    <i className="fas fa-play text-[8px] text-[#00f3ff]"></i>
                  </div>
                </button>
              </div>
            </div>

            {/* Right: 3D Floating Card */}
            <div className="relative perspective-[1000px] opacity-0 animate-[fadeInScale_1s_ease-out_0.8s_forwards]">
              <div 
                className="relative transform-gpu transition-transform duration-300"
                style={{
                  transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)`
                }}
              >
                {/* Glow Effect */}
                <div className="absolute -inset-8 bg-[#00f3ff]/20 rounded-[4rem] blur-[60px] animate-pulse"></div>
                
                {/* Main Card */}
                <div className="relative glass rounded-[3rem] p-10 md:p-14 border border-[var(--accent-solid)]/30 shadow-[0_0_60px_rgba(0,243,255,0.15)]">
                  {/* Decorative Elements */}
                  <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#00f3ff]/50 rounded-tl-xl"></div>
                  <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[#00f3ff]/50 rounded-br-xl"></div>
                  
                  {/* Scanning Line Animation */}
                  <div className="absolute inset-x-8 top-0 h-px overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent animate-[scanLine_3s_ease-in-out_infinite]"></div>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#00f3ff]/30 rounded-full blur-xl animate-pulse"></div>
                      <img src={nelbacIcon} alt="Nelbac" className="relative w-24 h-24 md:w-32 md:h-32 animate-[float_4s_ease-in-out_infinite]" />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[var(--text-primary)]/5 rounded-2xl p-4 border border-[var(--border-secondary)]">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent-solid)] block mb-1">STATUS</span>
                        <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          Active
                        </span>
                      </div>
                      <div className="bg-[var(--text-primary)]/5 rounded-2xl p-4 border border-[var(--border-secondary)]">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent-solid)] block mb-1">FOUNDED</span>
                        <span className="text-sm font-bold text-[var(--text-primary)]">{COMPANY_INFO.founded}</span>
                      </div>
                    </div>
                    
                    <div className="bg-[var(--text-primary)]/5 rounded-2xl p-4 border border-[var(--border-secondary)]">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent-solid)] block mb-2">RECOGNITION</span>
                      <div className="flex flex-wrap gap-2">
                        {['DPIIT', 'MSME', 'UAS'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-[#00f3ff]/10 text-[#00f3ff] text-[9px] font-black rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-center pt-4 border-t border-[var(--border-secondary)]">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)]">
                        {COMPANY_INFO.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 animate-[fadeIn_1s_ease-out_2s_forwards]">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)]">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-[var(--text-secondary)]/30 flex justify-center pt-2">
            <div className="w-1 h-3 bg-[var(--accent-solid)] rounded-full animate-[scrollBounce_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      {/* ===== STATS SECTION WITH COUNTER ANIMATION ===== */}
      <div 
        ref={statsRef}
        id="stats-section"
        className="relative py-20 md:py-32 bg-[var(--bg-secondary)] border-y border-[var(--border-secondary)] overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 transition-all duration-1000 ${isVisible['stats-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            {COMPANY_STATS.map((stat, idx) => (
              <div 
                key={idx}
                className="group relative"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Hover Glow */}
                <div className="absolute -inset-4 bg-[#00f3ff]/0 group-hover:bg-[#00f3ff]/10 rounded-[3rem] blur-2xl transition-all duration-500"></div>
                
                <div className="relative glass rounded-[2rem] p-8 md:p-12 border border-[var(--border-primary)] group-hover:border-[var(--accent-solid)]/50 transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
                  {/* Corner Accents */}
                  <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#00f3ff]/30 group-hover:border-[#00f3ff] transition-colors"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#00f3ff]/30 group-hover:border-[#00f3ff] transition-colors"></div>
                  
                  <div className="flex items-end gap-1 mb-4">
                    <span className="text-5xl md:text-7xl font-black font-heading text-[var(--text-primary)] tracking-tighter italic tabular-nums">
                      {stat.value.includes('+') ? counters[idx] + '+' : counters[idx]}
                    </span>
                    <span className="text-2xl md:text-4xl font-black text-[var(--accent-solid)] mb-2">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] group-hover:text-[var(--accent-solid)] transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MISSION & VISION SECTION ===== */}
      <div 
        ref={missionRef}
        id="mission-section"
        className="relative py-24 md:py-40 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(0,243,255,0.1), transparent, rgba(0,243,255,0.1), transparent)',
              animation: 'spin 20s linear infinite'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className={`transition-all duration-1000 ${isVisible['mission-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            
            {/* Section Header */}
            <div className="text-center mb-20 md:mb-32">
              <span className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full border border-[var(--border-primary)] text-[var(--accent-solid)] font-black text-[10px] tracking-[0.4em] uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></span>
                Our Purpose
              </span>
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter">
                Mission &<br />
                <span className="text-gradient not-italic">Vision.</span>
              </h2>
            </div>

            {/* Mission Cards Grid */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Mission Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00f3ff]/20 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative glass rounded-[3rem] p-10 md:p-14 border border-[var(--border-primary)] group-hover:border-[#00f3ff]/30 transition-all h-full">
                  <div className="w-16 h-16 rounded-2xl bg-[#00f3ff]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <img src={nelbacIcon} alt="" className="w-10 h-10" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent-solid)] mb-4">Our Mission</h3>
                  <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-snug mb-6 font-heading italic">
                    "{COMPANY_INFO.mission}"
                  </p>
                  <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                    We believe every farmer, regardless of scale, deserves access to technology that can transform their livelihood.
                  </p>
                </div>
              </div>

              {/* Who We Are Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-l from-[#00f3ff]/20 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative glass rounded-[3rem] p-10 md:p-14 border border-[var(--border-primary)] group-hover:border-[#00f3ff]/30 transition-all h-full">
                  <div className="w-16 h-16 rounded-2xl bg-[#00f3ff]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <i className="fas fa-users text-2xl text-[#00f3ff]"></i>
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent-solid)] mb-4">Who We Are</h3>
                  <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-snug mb-6 font-heading italic">
                    "{COMPANY_INFO.whoWeAre}"
                  </p>
                  <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                    {COMPANY_INFO.whatWeDo}
                  </p>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="mt-12 md:mt-20">
              <div className="glass rounded-[2rem] p-8 md:p-12 border border-[var(--border-primary)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00f3ff] via-[#00f3ff]/50 to-transparent"></div>
                <p className="text-[var(--text-secondary)] font-light leading-relaxed md:text-lg pl-6">
                  {COMPANY_INFO.fullDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== VALUES SECTION WITH 3D CARDS ===== */}
      <div 
        ref={valuesRef}
        id="values-section"
        className="py-24 md:py-40 bg-[var(--bg-secondary)] border-y border-[var(--border-secondary)] relative overflow-hidden"
      >
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 border border-[#00f3ff]/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-[#00f3ff]/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className={`transition-all duration-1000 ${isVisible['values-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
              <div>
                <span className="text-[var(--accent-solid)] font-black text-[10px] tracking-[0.5em] uppercase block mb-6">CORE_VALUES</span>
                <h2 className="text-4xl md:text-7xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter">
                  What Drives Us.
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] font-light max-w-md text-sm md:text-base">
                Our values are the foundation of everything we build. They guide our decisions and shape our culture.
              </p>
            </div>

            {/* Values Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {COMPANY_VALUES.map((value, idx) => (
                <div 
                  key={idx}
                  className="group relative perspective-[1000px]"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="relative transform-gpu transition-all duration-500 group-hover:scale-[1.05] group-hover:-translate-y-2">
                    {/* Glow */}
                    <div className="absolute -inset-4 bg-[#00f3ff]/0 group-hover:bg-[#00f3ff]/20 rounded-[3rem] blur-2xl transition-all duration-500"></div>
                    
                    <div className="relative glass rounded-[2rem] p-8 md:p-10 border border-[var(--border-primary)] group-hover:border-[#00f3ff]/50 transition-all overflow-hidden h-full">
                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>

                      {/* Number */}
                      <span className="absolute top-6 right-6 text-6xl font-black font-heading text-[var(--text-primary)]/5 group-hover:text-[#00f3ff]/10 transition-colors">
                        0{idx + 1}
                      </span>

                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-[#00f3ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00f3ff]/20 group-hover:scale-110 transition-all">
                        <img src={nelbacIcon} alt="" className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <h3 className="text-xl md:text-2xl font-black font-heading text-[var(--text-primary)] uppercase italic mb-4 group-hover:text-[#00f3ff] transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed relative z-10">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== TIMELINE SECTION ===== */}
      <div 
        ref={timelineRef}
        id="timeline-section"
        className="py-24 md:py-40 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className={`transition-all duration-1000 ${isVisible['timeline-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-24">
              <span className="text-[var(--accent-solid)] font-black text-[10px] tracking-[0.5em] uppercase block mb-6">JOURNEY_LOG</span>
              <h2 className="text-4xl md:text-7xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter mb-6">
                Our Story.
              </h2>
              <p className="text-[var(--text-secondary)] font-light max-w-2xl mx-auto">
                From a bold idea in Bangalore to India's most innovative irrigation technology company.
              </p>
            </div>

            {/* Timeline Visualization */}
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-[var(--text-primary)]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00f3ff] to-[#00f3ff]/50 rounded-full transition-all duration-700 shadow-[0_0_20px_rgba(0,243,255,0.5)]"
                  style={{ width: `${((activeTimelineIdx + 1) / MILESTONES.length) * 100}%` }}
                ></div>
              </div>

              {/* Year Markers */}
              <div className="hidden md:flex justify-between mb-16 relative">
                {MILESTONES.map((milestone, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTimelineIdx(idx)}
                    className="group flex flex-col items-center"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      idx <= activeTimelineIdx 
                        ? 'bg-[#00f3ff] text-black shadow-[0_0_30px_rgba(0,243,255,0.5)]' 
                        : 'glass border border-[var(--border-primary)] text-[var(--text-secondary)]'
                    }`}>
                      <span className="text-[10px] font-black">{milestone.year.slice(-2)}</span>
                    </div>
                    <span className={`mt-4 text-xs font-bold transition-colors ${
                      idx === activeTimelineIdx ? 'text-[#00f3ff]' : 'text-[var(--text-secondary)]'
                    }`}>
                      {milestone.year}
                    </span>
                  </button>
                ))}
              </div>

              {/* Mobile Year Selector */}
              <div className="flex md:hidden gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                {MILESTONES.map((milestone, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTimelineIdx(idx)}
                    className={`px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      idx === activeTimelineIdx
                        ? 'bg-[#00f3ff] text-black shadow-[0_0_20px_rgba(0,243,255,0.4)]'
                        : 'glass border border-[var(--border-primary)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {milestone.year}
                  </button>
                ))}
              </div>

              {/* Content Card */}
              <div className="relative min-h-[300px]">
                {MILESTONES.map((milestone, idx) => (
                  <div 
                    key={idx}
                    className={`transition-all duration-700 ${
                      idx === activeTimelineIdx 
                        ? 'opacity-100 translate-y-0 relative' 
                        : 'opacity-0 translate-y-8 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    <div className="glass rounded-[3rem] p-10 md:p-16 border border-[var(--border-primary)] relative overflow-hidden">
                      {/* Background Year */}
                      <span className="absolute top-1/2 right-10 -translate-y-1/2 text-[200px] md:text-[300px] font-black font-heading text-[var(--text-primary)]/[0.03] leading-none pointer-events-none">
                        {milestone.year}
                      </span>

                      <div className="relative z-10 max-w-2xl">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f3ff]/10 rounded-full text-[#00f3ff] text-[10px] font-black uppercase tracking-wider mb-6">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-pulse"></span>
                          {milestone.year}
                        </span>
                        <h3 className="text-3xl md:text-5xl font-black font-heading text-[var(--text-primary)] uppercase italic mb-6 tracking-tight">
                          {milestone.title}
                        </h3>
                        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-center gap-4 mt-8">
                <button 
                  onClick={() => setActiveTimelineIdx(prev => (prev - 1 + MILESTONES.length) % MILESTONES.length)}
                  className="w-14 h-14 rounded-full glass border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[#00f3ff]/50 hover:text-[#00f3ff] transition-all active:scale-90"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <button 
                  onClick={() => setActiveTimelineIdx(prev => (prev + 1) % MILESTONES.length)}
                  className="w-14 h-14 rounded-full glass border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[#00f3ff]/50 hover:text-[#00f3ff] transition-all active:scale-90"
                >
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PARTNERS MARQUEE SECTION ===== */}
      <div 
        ref={partnersRef}
        id="partners-section"
        className="py-20 md:py-32 bg-[var(--bg-secondary)] border-y border-[var(--border-secondary)] overflow-hidden"
      >
        <div className={`transition-all duration-1000 ${isVisible['partners-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20 px-6">
            <span className="text-[var(--accent-solid)] font-black text-[10px] tracking-[0.5em] uppercase block mb-6">BACKED_BY</span>
            <h2 className="text-4xl md:text-6xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter">
              Our Partners.
            </h2>
          </div>

          {/* Infinite Marquee */}
          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent z-10"></div>
            
            <div className="flex animate-[marquee_30s_linear_infinite]">
              {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
                <div 
                  key={idx}
                  className="flex-shrink-0 mx-6 md:mx-10"
                >
                  <div className="glass rounded-[2rem] p-8 md:p-10 border border-[var(--border-primary)] hover:border-[#00f3ff]/30 transition-all w-[280px] md:w-[320px]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#00f3ff]/10 flex items-center justify-center">
                        <img src={nelbacIcon} alt="" className="w-7 h-7 opacity-70" />
                      </div>
                      <h3 className="text-sm font-black text-[var(--text-primary)] uppercase">
                        {partner.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== CTA SECTION ===== */}
      <div className="py-24 md:py-40 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full border border-[#00f3ff]/10 animate-[ping_3s_ease-out_infinite]"></div>
            <div className="absolute inset-8 rounded-full border border-[#00f3ff]/10 animate-[ping_3s_ease-out_0.5s_infinite]"></div>
            <div className="absolute inset-16 rounded-full border border-[#00f3ff]/10 animate-[ping_3s_ease-out_1s_infinite]"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
          <div className="glass rounded-[3rem] p-12 md:p-20 border border-[var(--border-primary)] text-center relative overflow-hidden">
            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#00f3ff]/30 rounded-tl-2xl"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#00f3ff]/30 rounded-tr-2xl"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#00f3ff]/30 rounded-bl-2xl"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#00f3ff]/30 rounded-br-2xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full border border-[var(--border-primary)] text-[#00f3ff] text-[9px] font-black uppercase tracking-[0.3em] mb-8">
                <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></span>
                Ready to Transform?
              </div>
              
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter mb-6">
                Let's Build The<br />
                <span className="text-gradient not-italic">Future Together.</span>
              </h2>
              
              <p className="text-[var(--text-secondary)] font-light max-w-xl mx-auto mb-10 text-base md:text-lg">
                Join the irrigation revolution. Whether you're a farmer, landscaper, or homeowner — we have the perfect solution for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => onNavigate?.(Page.Products)}
                  className="group relative px-10 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Explore Products
                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                  </span>
                  <div className="absolute inset-0 bg-[#00f3ff] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                <button className="px-10 py-5 glass border border-[var(--border-primary)] text-[var(--text-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:border-[#00f3ff]/50 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all">
                  Get In Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 3rem; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scanLine {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
