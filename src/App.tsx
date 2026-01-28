import React, { useState, useEffect, useRef } from 'react';
import { Page, Product, CartItem } from '@/types';
import { PRODUCTS, VISION_SECTIONS, AUTO_PLAY_DURATION, TESTIMONIALS } from '@/constants.ts';
import { Header, Footer, Hero, ProductCard, CustomCursor, SplashScreen, AboutUs } from '@/components';
import { useCustomCursor } from '@/hooks/useCustomCursor';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeVisionIdx, setActiveVisionIdx] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const { position: cursorPosition, isHovering: isHoveringInteractive } = useCustomCursor();
  
  const visionRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);
  const lastSnapTime = useRef<number>(0);
  const animationFrameRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(null);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  // Paginated Hero-to-Vision Snap (Desktop Only)
  useEffect(() => {
    const handleHeroSnap = (e: WheelEvent) => {
      if (window.innerWidth < 1024 || currentPage !== Page.Home || isAutoScrolling.current || !visionRef.current) return;

      const now = Date.now();
      if (now - lastSnapTime.current < 1200) return;

      const scrollY = window.scrollY;
      const visionTop = visionRef.current.offsetTop;
      const snapThreshold = 15;

      if (scrollY < snapThreshold && e.deltaY > 30) {
        e.preventDefault();
        isAutoScrolling.current = true;
        lastSnapTime.current = now;
        window.scrollTo({ top: visionTop, behavior: 'smooth' });
        setTimeout(() => { isAutoScrolling.current = false; }, 1000);
      } 
      else if (activeVisionIdx === 0 && scrollY >= visionTop - snapThreshold && scrollY <= visionTop + snapThreshold && e.deltaY < -30) {
        e.preventDefault();
        isAutoScrolling.current = true;
        lastSnapTime.current = now;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => { isAutoScrolling.current = false; }, 1000);
      }
    };

    window.addEventListener('wheel', handleHeroSnap, { passive: false });
    return () => window.removeEventListener('wheel', handleHeroSnap);
  }, [currentPage, activeVisionIdx]);

  // Manual Scroll Handling
  useEffect(() => {
    const handleScroll = () => {
      if (!visionRef.current || isAutoScrolling.current) return;
      
      const rect = visionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableRange = rect.height - viewportHeight;
      
      if (rect.top > viewportHeight || rect.bottom < 0) return;

      const scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollableRange));
      const totalSlides = VISION_SECTIONS.length;
      const rawIndex = scrollProgress * totalSlides;
      const index = Math.min(Math.floor(rawIndex), totalSlides - 1);
      const subProgress = (rawIndex % 1) * 100;
      
      setActiveVisionIdx(index);
      setSlideProgress(subProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [VISION_SECTIONS.length]);

  const scrollToSlide = (index: number) => {
    if (!visionRef.current || isAutoScrolling.current) return;
    
    isAutoScrolling.current = true;
    setActiveVisionIdx(index);
    setSlideProgress(0);

    const totalHeight = visionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableRange = totalHeight - viewportHeight;
    const segmentSize = scrollableRange / VISION_SECTIONS.length;
    const target = visionRef.current.offsetTop + (index * segmentSize);

    window.scrollTo({ top: target, behavior: 'smooth' });

    setTimeout(() => {
      isAutoScrolling.current = false;
      lastTimeRef.current = performance.now();
    }, 800);
  };

  const skipToHardware = () => {
    if (!productsRef.current) return;
    isAutoScrolling.current = true;
    productsRef.current.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { isAutoScrolling.current = false; }, 1000);
  };

  const handleNext = () => {
    const nextIdx = (activeVisionIdx + 1) % VISION_SECTIONS.length;
    scrollToSlide(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeVisionIdx - 1 + VISION_SECTIONS.length) % VISION_SECTIONS.length;
    scrollToSlide(prevIdx);
  };

  // Auto-Play
  useEffect(() => {
    const animate = (time: number) => {
      if (!visionRef.current || currentPage !== Page.Home || isAutoScrolling.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      
      const rect = visionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (Math.abs(rect.top) < 10 && rect.bottom >= viewportHeight - 10) {
        setSlideProgress(prev => {
          const increment = (deltaTime / AUTO_PLAY_DURATION) * 100;
          const next = prev + increment;
          if (next >= 100) {
            handleNext();
            return 100;
          }
          return next;
        });
      }
      
      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeVisionIdx, VISION_SECTIONS.length, currentPage]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalBarWidth = ((activeVisionIdx + (slideProgress / 100)) / VISION_SECTIONS.length) * 100;

  const renderHome = () => (
    <>
      <Hero onExplore={setCurrentPage} />
      
      <section 
        ref={visionRef} 
        className="relative w-full bg-[var(--bg-primary)]"
        style={{ height: `${VISION_SECTIONS.length * 60}vh` }} 
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            {VISION_SECTIONS.map((section, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${idx === activeVisionIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
              >
                <img 
                  src={section.image} 
                  className="w-full h-full object-cover absolute inset-0" 
                  style={{ filter: `brightness(var(--bg-img-brightness, 0.7))` }} 
                  alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-transparent to-transparent opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] opacity-40"></div>
              </div>
            ))}
          </div>

          <div className="absolute top-24 md:top-32 left-0 right-0 z-20 pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="w-full h-[3px] bg-[var(--text-primary)]/10 rounded-full relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-[var(--accent-solid)] shadow-[0_0_200px_rgba(0,243,255,0.8)]"
                  style={{ 
                    width: `${totalBarWidth}%`,
                    transition: isAutoScrolling.current ? 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none' 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full h-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-20 items-center justify-center px-6 md:px-16 pt-20 lg:pt-0">
            <div className="absolute top-36 md:top-48 left-6 md:left-16 flex items-center gap-4 md:gap-6 z-30">
              <button 
                onClick={handlePrev}
                className="interactive group w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent-solid)] hover:bg-[var(--accent-solid)] hover:text-black transition-all shadow-xl active:scale-90"
              >
                <i className="fas fa-arrow-left text-sm md:text-base group-hover:-translate-x-1 transition-transform"></i>
              </button>
              <button 
                onClick={handleNext}
                className="interactive group w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent-solid)] hover:bg-[var(--accent-solid)] hover:text-black transition-all shadow-xl active:scale-90"
              >
                <i className="fas fa-arrow-right text-sm md:text-base group-hover:translate-x-1 transition-transform"></i>
              </button>
              
              <button 
                onClick={skipToHardware}
                className="interactive group flex items-center gap-3 px-6 h-12 md:h-16 rounded-full glass border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--accent-solid)] hover:bg-[var(--accent-solid)] hover:text-black transition-all shadow-xl active:scale-90 ml-2 md:ml-4"
              >
                <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em]">Skip to Products</span>
                <span className="md:hidden text-[9px] font-black uppercase tracking-widest">Skip</span>
                <i className="fas fa-angles-down text-xs group-hover:translate-y-1 transition-transform"></i>
              </button>
            </div>

            <div className="relative w-full h-[25vh] md:h-[30vh] lg:h-[60vh] flex flex-col justify-center">
              {VISION_SECTIONS.map((section, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    idx === activeVisionIdx 
                    ? 'opacity-100 translate-y-0' 
                    : idx < activeVisionIdx 
                      ? 'opacity-0 -translate-y-10 lg:-translate-y-20' 
                      : 'opacity-0 translate-y-10 lg:translate-y-20'
                  }`}
                >
                  <div className="vision-heading-box">
                    <div className="flex items-center gap-4 md:gap-6 mb-3 md:mb-6">
                      <div className="w-8 md:w-12 h-1 bg-[var(--accent-solid)] shadow-[0_0_15px_rgba(0,243,255,0.4)]"></div>
                      <span className="text-[var(--accent-solid)] font-black text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.6em] uppercase">Product Highlights</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl lg:text-8xl font-black font-heading text-[var(--text-primary)] uppercase italic leading-[0.85] tracking-tighter">
                      {section.title}
                    </h2>
                    <h3 className="text-sm md:text-2xl font-light text-[var(--text-secondary)] uppercase tracking-[0.2em] md:tracking-[0.3em] italic mt-3 md:mt-8">
                      {section.subtitle}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative w-full h-[35vh] md:h-[40vh] lg:h-[50vh] flex items-center">
              <div className="vision-card w-full rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col justify-center min-h-[220px] md:min-h-[300px] shadow-2xl">
                <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-[var(--accent-solid)]/30"></div>
                <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-[var(--accent-solid)]/30"></div>

                {VISION_SECTIONS.map((section, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-x-8 md:inset-x-16 top-1/2 -translate-y-1/2 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      idx === activeVisionIdx 
                      ? 'opacity-100 translate-x-0' 
                      : idx < activeVisionIdx 
                        ? 'opacity-0 -translate-x-12' 
                        : 'opacity-0 translate-x-12'
                    }`}
                  >
                    <p className="text-sm md:text-xl font-light leading-relaxed mb-6 md:mb-12">
                      {section.content}
                    </p>

                    <div className="flex items-center gap-4 md:gap-8">
                      <span className="index-text font-black font-heading text-lg md:text-2xl italic">0{idx+1}</span>
                      <div className="flex-1 h-[2px] bg-[var(--text-primary)]/10 rounded-full relative overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-[var(--accent-solid)] shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                          style={{ 
                            width: `${idx === activeVisionIdx ? slideProgress : (idx < activeVisionIdx ? 100 : 0)}%`,
                            transition: isAutoScrolling.current ? 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
                          }}
                        ></div>
                      </div>
                      <span className="index-text font-black font-heading text-lg md:text-2xl italic">0{VISION_SECTIONS.length}</span>
                    </div>
                  </div>
                ))}

                <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-3 md:gap-4">
                   {VISION_SECTIONS.map((_, dotIdx) => (
                     <div 
                       key={dotIdx}
                       className={`interactive w-1 transition-all duration-300 rounded-full cursor-none hover:bg-[var(--accent-solid)]/50 ${
                         dotIdx === activeVisionIdx 
                         ? 'h-8 md:h-12 bg-[var(--accent-solid)] shadow-[0_0_10px_rgba(0,243,255,0.4)]' 
                         : 'h-2 md:h-3 bg-[var(--text-primary)]/10'
                       }`}
                       onClick={() => scrollToSlide(dotIdx)}
                     />
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-40 bg-[var(--bg-secondary)] border-y border-[var(--border-secondary)] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#00f3ff]/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00f3ff]/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <span className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full border border-[var(--border-primary)] text-[var(--accent-solid)] font-black text-[9px] md:text-[10px] tracking-[0.4em] uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></span>
              TRUSTED_WORLDWIDE
            </span>
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter mb-6">
              What Our<br />
              <span className="text-gradient not-italic">Customers Say.</span>
            </h2>
            <p className="text-[var(--text-secondary)] font-light max-w-2xl mx-auto text-sm md:text-base">
              Real stories from farmers, landscapers, and homeowners who transformed their irrigation with Nelbac.
            </p>
          </div>

          {/* Testimonials Grid - Same Size Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="group relative"
              >
                {/* Hover Glow */}
                <div className="absolute -inset-2 bg-[#00f3ff]/0 group-hover:bg-[#00f3ff]/10 rounded-[3rem] blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                
                <div className="relative glass rounded-[2rem] p-8 md:p-10 border border-[var(--border-primary)] group-hover:border-[#00f3ff]/30 transition-all duration-500 h-full flex flex-col">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-[#00f3ff]/10 group-hover:text-[#00f3ff]/20 transition-colors">
                    <i className="fas fa-quote-right text-4xl md:text-5xl"></i>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-[#00f3ff] text-xs"></i>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-[var(--text-primary)] font-light leading-relaxed mb-8 flex-grow text-sm md:text-base">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-secondary)]">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00f3ff]/30 to-[#00f3ff]/10 flex items-center justify-center border border-[#00f3ff]/20">
                      <span className="text-[#00f3ff] font-black text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[var(--text-primary)] text-sm truncate">{testimonial.name}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)] truncate">{testimonial.role}, {testimonial.company}</p>
                      <p className="text-[9px] text-[var(--accent-solid)] font-black uppercase tracking-wider mt-1 flex items-center gap-1">
                        <i className="fas fa-map-marker-alt text-[8px]"></i>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-16 md:mt-24 glass rounded-[2rem] p-8 md:p-12 border border-[var(--border-primary)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black font-heading text-[var(--text-primary)] italic mb-2">500+</div>
                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black font-heading text-[var(--text-primary)] italic mb-2">4.9</div>
                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black font-heading text-[var(--text-primary)] italic mb-2">15+</div>
                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black font-heading text-[var(--text-primary)] italic mb-2">98%</div>
                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Would Recommend</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={productsRef} id="hardware-section" className="py-24 md:py-40 bg-[var(--bg-primary)] border-t border-[var(--border-secondary)] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20 md:mb-32">
            <div>
              <span className="text-[var(--accent-solid)] font-black uppercase text-[10px] md:text-[12px] tracking-[0.5em] md:tracking-[1em] block mb-4 md:mb-8">INVENTORY_NODE // GLOBAL</span>
              <h2 className="text-5xl md:text-9xl font-black font-heading text-[var(--text-primary)] uppercase italic leading-none tracking-tighter">PRODUCTS.</h2>
            </div>
            <a 
              href="#products"
              onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Products); }}
              className="glow-link text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[var(--text-secondary)] hover:text-[var(--accent-solid)] transition-all ml-4"
            >
              REQUEST_SCHEMATICS
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
             {PRODUCTS.map(product => (
               <div key={product.id} className="reveal-on-scroll">
                  <ProductCard product={product} onAddToCart={addToCart} />
               </div>
             ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderProducts = () => (
    <section className="pt-48 pb-40 min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-32 reveal-on-scroll active">
          <h1 className="text-8xl md:text-[140px] font-black font-heading text-[var(--text-primary)] mb-16 uppercase italic leading-[0.8] tracking-tighter">THE<br/><span className="not-italic text-gradient">CATALOG.</span></h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {PRODUCTS.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
        </div>
      </div>
    </section>
  );

  const renderCart = () => (
    <div className="pt-48 max-w-5xl mx-auto px-8 min-h-screen">
       <h2 className="text-7xl font-black font-heading text-[var(--text-primary)] mb-20 uppercase italic leading-none tracking-tighter">THE QUEUE.</h2>
       {cart.length === 0 ? (
         <div className="glass p-32 text-center rounded-[3rem] border-dashed border-[var(--border-primary)]">
           <p className="text-[var(--text-secondary)] uppercase font-black tracking-[0.8em] text-[10px] mb-8">NO ACTIVE NODES DETECTED IN BUFFER.</p>
           <a 
             href="#products" 
             onClick={(e) => { e.preventDefault(); setCurrentPage(Page.Products); }} 
             className="glow-link text-[var(--accent-solid)] font-black uppercase tracking-[0.5em] text-xs ml-4"
           >
             REQUEST SCHEMATICS
           </a>
         </div>
       ) : (
         <div className="space-y-8">
           {cart.map(item => (
              <div key={item.product.id} className="glass p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between border border-[var(--border-secondary)]/40 transition-all">
                <div className="flex items-center gap-12">
                  <img src={item.product.image} className="w-24 h-24 rounded-[1.5rem] object-cover grayscale opacity-60" alt="" />
                  <div>
                    <h4 className="text-2xl font-black text-[var(--text-primary)] uppercase font-heading tracking-tight italic">{item.product.name}</h4>
                    <p className="text-[var(--accent-solid)] text-[11px] font-black uppercase tracking-widest mt-3">UNIT_COST: ${item.product.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-12 mt-8 md:mt-0">
                   <div className="flex items-center gap-8 px-6 py-3 bg-[var(--text-primary)]/5 rounded-xl border border-[var(--border-primary)]">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="interactive text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><i className="fas fa-minus text-xs"></i></button>
                      <span className="font-black text-[var(--text-primary)] text-lg font-mono">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="interactive text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><i className="fas fa-plus text-xs"></i></button>
                   </div>
                   <div className="text-right min-w-[140px] font-black text-[var(--accent-solid)] text-3xl font-heading tracking-tighter italic">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
           ))}
           <div className="glass p-16 rounded-[3rem] mt-20 border border-[var(--accent-solid)]/20">
              <div className="flex justify-between items-center mb-12">
                 <span className="text-[var(--text-secondary)] uppercase font-black tracking-[0.8em] text-[11px]">TOTAL_ALLOCATION</span>
                 <span className="text-6xl font-black text-[var(--text-primary)] font-heading tracking-tighter italic">${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={() => alert("INITIALIZING DEPLOYMENT SEQUENCE...")} className="w-full py-10 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.8em] text-[12px] rounded-2xl hover:bg-[#00f3ff] transition-all shadow-2xl">EXECUTE_DEPLOYMENT_CMD</button>
           </div>
         </div>
       )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] cursor-default">
      {showSplash && (
        <SplashScreen 
          onComplete={() => setShowSplash(false)} 
        />
      )}
      <CustomCursor isHovering={isHoveringInteractive} position={cursorPosition} />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} cartCount={cartCount} />
      <main>
        {currentPage === Page.Home && renderHome()}
        {currentPage === Page.Products && renderProducts()}
        {currentPage === Page.AboutUs && <AboutUs onNavigate={setCurrentPage} />}
        {currentPage === Page.Cart && renderCart()}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
