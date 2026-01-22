
import React, { useState, useEffect, useRef } from 'react';
import { Page, Product, CartItem } from './types';
import { PRODUCTS } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import SmartAdvisor from './components/SmartAdvisor';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeVisionIdx, setActiveVisionIdx] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0); 
  const visionRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);
  const lastWheelTime = useRef<number>(0);
  const animationFrameRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(null);
  const AUTO_PLAY_DURATION = 6000;

  const visionSections = [
    {
      title: "Get productive.",
      subtitle: "Simplify labour.",
      id: "AUT-01",
      tag: "AUTOMATION_ENGINE",
      content: "Experience the power of automation in your daily life. Reduce the need for manual intervention and repetitive tasks. Reallocate labour to more strategic or specialized tasks, maximizing productivity and output.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920",
      accent: "Productive"
    },
    {
      title: "Always reliable.",
      subtitle: "Consistent performance.",
      id: "REL-02",
      tag: "CORE_STABILITY",
      content: "Once set. All set. Our power failure recovery feature automatically resumes operation after a power outage, ensuring uninterrupted watering schedules and industrial precision.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1920",
      accent: "Reliable"
    },
    {
      title: "Stay efficient.",
      subtitle: "Control your yield.",
      id: "EFF-03",
      tag: "RESOURCE_LOGIC",
      content: "Our configurable controller streamlines processes with multi-zone control, programmable schedules, and condition-based adjustments to regulate pressure and flow precisely.",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1920",
      accent: "Efficient"
    },
    {
      title: "Be on the go.",
      subtitle: "Stay connected.",
      id: "CON-04",
      tag: "REMOTE_MESH",
      content: "Remote monitoring and control empowers proactive decision-making. Receive instant updates and insights into device status and performance from anywhere in the world.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920",
      accent: "Connected"
    },
    {
      title: "Resource Efficient.",
      subtitle: "Conserve life.",
      id: "ENV-05",
      tag: "ECO_OPTIMIZATION",
      content: "Prevent over or under watering with precise scheduling and zone-based optimal distribution. Protect resources while maintaining lush environments through intelligent systems.",
      image: "https://images.unsplash.com/photo-1468476775582-6bede20f356f?auto=format&fit=crop&q=80&w=1920",
      accent: "Conserve"
    },
    {
      title: "Analyse data.",
      subtitle: "Unlock precision.",
      id: "DAT-06",
      tag: "ANALYTICS_CORE",
      content: "Harness data analytics for smarter irrigation. Make data-driven decisions regarding irrigation, leading to better crop health, increased yields, and improved quality of produce.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1920",
      accent: "Precision"
    },
    {
      title: "Be flexible.",
      subtitle: "Automate anywhere.",
      id: "FLX-07",
      tag: "PROTOCOL_AGNOSTIC",
      content: "Integrate any IoT device into your workflow. Our device is compatible with all standard valves be it AC or DC, 12V or 24V. Scale without technical debt.",
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1000",
      accent: "Flexible"
    }
  ];

  const scrollToSlide = (index: number) => {
    if (!visionRef.current) return;
    
    isAutoScrolling.current = true;
    setActiveVisionIdx(index);
    setSlideProgress(0);

    const totalHeightPerSlide = window.innerHeight;
    const target = visionRef.current.offsetTop + (index * totalHeightPerSlide);

    window.scrollTo({
      top: target,
      behavior: 'smooth'
    });

    setTimeout(() => {
      isAutoScrolling.current = false;
      lastTimeRef.current = performance.now();
    }, 800);
  };

  const handleNext = () => {
    const nextIdx = (activeVisionIdx + 1) % visionSections.length;
    scrollToSlide(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeVisionIdx - 1 + visionSections.length) % visionSections.length;
    scrollToSlide(prevIdx);
  };

  useEffect(() => {
    const handleVisionWheel = (e: WheelEvent) => {
      if (currentPage !== Page.Home || !visionRef.current || isAutoScrolling.current) return;

      const rect = visionRef.current.getBoundingClientRect();
      const now = Date.now();
      
      if (rect.top <= 10 && rect.bottom >= window.innerHeight - 10) {
        if (now - lastWheelTime.current < 700) {
           e.preventDefault();
           return;
        }

        if (e.deltaY > 20) {
          if (activeVisionIdx < visionSections.length - 1) {
            e.preventDefault();
            lastWheelTime.current = now;
            handleNext();
          }
        } else if (e.deltaY < -20) {
          if (activeVisionIdx > 0) {
            e.preventDefault();
            lastWheelTime.current = now;
            handlePrev();
          } else {
            e.preventDefault();
            isAutoScrolling.current = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => { isAutoScrolling.current = false; }, 800);
          }
        }
      } 
      else if (window.scrollY < 50 && e.deltaY > 20) {
        e.preventDefault();
        isAutoScrolling.current = true;
        window.scrollTo({ top: visionRef.current.offsetTop, behavior: 'smooth' });
        setTimeout(() => { isAutoScrolling.current = false; }, 800);
      }
    };

    window.addEventListener('wheel', handleVisionWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleVisionWheel);
  }, [currentPage, activeVisionIdx, visionSections.length]);

  useEffect(() => {
    const animate = (time: number) => {
      if (!visionRef.current || currentPage !== Page.Home || isAutoScrolling.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      
      const rect = visionRef.current.getBoundingClientRect();
      if (rect.top <= 50 && rect.bottom >= window.innerHeight - 50) {
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
  }, [activeVisionIdx, visionSections.length, currentPage]);

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

  const totalBarWidth = ((activeVisionIdx + 1) / visionSections.length) * 100;

  const renderHome = () => (
    <>
      <Hero onExplore={setCurrentPage} />
      
      <section 
        ref={visionRef} 
        className="relative w-full bg-[var(--bg-primary)]"
        style={{ height: `${visionSections.length * 100}vh` }} 
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          <div className="absolute inset-0 z-0">
            {visionSections.map((section, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${idx === activeVisionIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
              >
                <img 
                  src={section.image} 
                  className="w-full h-full object-cover absolute inset-0" 
                  style={{ filter: `brightness(var(--bg-img-brightness, 0.4))` }} 
                  alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-transparent to-transparent opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] opacity-80"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black font-heading text-[var(--nelbac-accent)] uppercase italic select-none pointer-events-none whitespace-nowrap opacity-[0.03]">
                  {section.accent}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-24 md:top-32 left-0 right-0 z-20 pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 md:px-8 text-center mb-4">
               <span className="text-[var(--accent-solid)] font-black text-[9px] uppercase tracking-[0.5em] opacity-40">System Navigation</span>
            </div>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="w-full h-[3px] bg-[var(--text-primary)]/10 rounded-full relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-[var(--accent-solid)] shadow-[0_0_200px_rgba(0,243,255,0.8)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ width: `${totalBarWidth}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full h-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-20 items-center justify-center px-6 md:px-16 pt-20 lg:pt-0">
            <div className="absolute top-36 md:top-48 left-6 md:left-16 flex items-center gap-4 md:gap-6 z-30">
              <button 
                onClick={handlePrev}
                className="interactive group w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] hover:border(--accent-solid) hover:bg-[var(--accent-solid)] hover:text-black transition-all shadow-xl active:scale-90"
              >
                <i className="fas fa-arrow-left text-sm md:text-base group-hover:-translate-x-1 transition-transform"></i>
              </button>
              <button 
                onClick={handleNext}
                className="interactive group w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] hover:border(--accent-solid) hover:bg-[var(--accent-solid)] hover:text-black transition-all shadow-xl active:scale-90"
              >
                <i className="fas fa-arrow-right text-sm md:text-base group-hover:translate-x-1 transition-transform"></i>
              </button>
              <button 
                onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="interactive group flex items-center gap-3 px-6 h-12 md:h-16 rounded-full glass border border-[var(--border-primary)] text-[var(--text-primary)] hover:border(--accent-solid) hover:bg-[var(--accent-solid)] hover:text-black transition-all shadow-xl active:scale-90 ml-2 md:ml-4"
              >
                <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em]">Hardware Catalog</span>
                <i className="fas fa-angles-down text-xs group-hover:translate-y-1 transition-transform"></i>
              </button>
            </div>

            <div className="relative w-full h-[25vh] md:h-[30vh] lg:h-[60vh] flex flex-col justify-center">
              {visionSections.map((section, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    idx === activeVisionIdx 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : idx < activeVisionIdx 
                      ? 'opacity-0 -translate-y-10 lg:-translate-y-20 scale-95' 
                      : 'opacity-0 translate-y-10 lg:translate-y-20 scale-95'
                  }`}
                >
                  <div className="vision-heading-box">
                    <div className="flex items-center gap-4 md:gap-6 mb-3 md:mb-6">
                      <div className="w-8 md:w-12 h-1 bg-[var(--accent-solid)] shadow-[0_0_15px_rgba(0,243,255,0.4)]"></div>
                      <span className="text-[var(--accent-solid)] font-black text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.6em] uppercase">MODULE_0{idx+1}</span>
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
                {visionSections.map((section, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-x-8 md:inset-x-16 top-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
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
                            width: `${idx === activeVisionIdx ? slideProgress : (idx < activeVisionIdx ? 100 : 0)}%`
                          }}
                        ></div>
                      </div>
                      <span className="index-text font-black font-heading text-lg md:text-2xl italic">0{visionSections.length}</span>
                    </div>
                  </div>
                ))}
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
              <h2 className="text-5xl md:text-9xl font-black font-heading text-[var(--text-primary)] uppercase italic leading-none tracking-tighter">HARDWARE.</h2>
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} cartCount={cartCount} />
      <main>
        {currentPage === Page.Home && renderHome()}
        {currentPage === Page.Products && renderProducts()}
        {currentPage === Page.Cart && renderCart()}
      </main>
      
      <footer className="py-32 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="text-3xl font-black font-heading text-[var(--text-primary)] mb-10 tracking-tighter italic">NELBAC // SYSTEMS</div>
          <div className="flex justify-center gap-12 mb-10">
             <a href="#" className="glow-link text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] ml-4">Documentation</a>
             <a href="#" className="glow-link text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] ml-4">API Status</a>
             <a href="#" className="glow-link text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] ml-4">Privacy</a>
          </div>
          <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest mt-4">© 2024 NELBAC IOT SYSTEMS • AUTOMATE ANYTHING</p>
        </div>
      </footer>

      {/* Floating Nelbac AI Advisor */}
      <SmartAdvisor />
    </div>
  );
};

export default App;
