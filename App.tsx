
import React, { useState, useEffect, useMemo } from 'react';
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
  const [rotation, setRotation] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800 
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const visionSections = useMemo(() => [
    {
      title: "Labour Optimization",
      id: "AUT-01",
      content: "Automate repetitive field logic with sub-millisecond precision. Redirect human capital to strategy.",
      icon: "fa-person-digging",
      short: "Labour",
      img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Always Reliable",
      id: "REL-02",
      content: "Military-grade recovery protocols. Localized buffers ensure zero data loss during grid failure.",
      icon: "fa-shield-heart",
      short: "Reliability",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Resource Logic",
      id: "EFF-03",
      content: "Algorithmic resource distribution. Save up to 45% on water and power via precise scheduling.",
      icon: "fa-droplet",
      short: "Resource",
      img: "https://images.unsplash.com/photo-1464306208223-e0b4495a5553?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Cloud Mesh",
      id: "CON-04",
      content: "Global accessibility via encrypted P2P tunnels. Manage nodes from any terminal worldwide.",
      icon: "fa-cloud-nodes",
      short: "Connectivity",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Eco Preservation",
      id: "ENV-05",
      content: "Hardware-level bio-monitoring. Real-time pH analysis to protect sensitive ecosystems.",
      icon: "fa-leaf",
      short: "Eco",
      img: "https://images.unsplash.com/photo-1530836361253-efad5d710e4a?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Predictive AI",
      id: "DAT-06",
      content: "Neural-grade forecasting. AI predicts infrastructure failure before any hardware triggers.",
      icon: "fa-chart-network",
      short: "Analytics",
      img: "https://images.unsplash.com/photo-1509228468518-180dd4805a44?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Scaling Arrays",
      id: "FLX-07",
      content: "Protocol agnostic design. Daisy-chain up to 256 modules per gateway for massive landscapes.",
      icon: "fa-layer-group",
      short: "Scalability",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
    }
  ], []);

  const bgBubbles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    size: `${5 + Math.random() * 15}px`,
    duration: `${15 + Math.random() * 20}s`
  })), []);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      const currentlyFocusedId = visionSections[activeVisionIdx]?.id;
      const isHighlightedHovered = hoveredId !== null && hoveredId === currentlyFocusedId;

      if (!isHighlightedHovered) {
        setRotation(prev => (prev + 0.08) % 360);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredId, activeVisionIdx, visionSections]);

  useEffect(() => {
    const step = 360 / visionSections.length;
    const normalizedRot = (rotation) % 360;
    const closestIdx = Math.round((180 - normalizedRot + 360) % 360 / step) % visionSections.length;
    if (closestIdx !== activeVisionIdx) {
      setActiveVisionIdx(closestIdx);
    }
  }, [rotation, visionSections.length, activeVisionIdx]);

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

  // Responsive Scaling Logic optimized for 100vh containment
  const responsiveScale = Math.min(windowSize.width / 1440, windowSize.height / 1000, 1.1);
  const hubSize = Math.max(80, 140 * responsiveScale);
  const bubbleSizeBase = Math.max(60, 110 * responsiveScale);
  const radiusX = windowSize.width > 768 ? 420 * responsiveScale : 140 * responsiveScale;
  const radiusY = windowSize.width > 768 ? 130 * responsiveScale : 180 * responsiveScale;

  const renderHome = () => (
    <>
      <Hero onExplore={setCurrentPage} />
      
      <section 
        className="relative h-screen bg-[var(--bg-secondary)] overflow-hidden flex flex-col border-y border-white/5"
      >
        {/* ENHANCED WATER BUBBLES BACKGROUND */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {bgBubbles.map(b => (
            <div 
              key={b.id}
              className="absolute rounded-full border border-white/20 bg-gradient-to-tr from-[var(--accent-solid)]/5 to-white/10 blur-[0.5px] animate-float-up bubble-shine"
              style={{ 
                left: b.left, 
                width: b.size, 
                height: b.size, 
                animationDelay: b.delay,
                animationDuration: b.duration,
                bottom: '-50px',
                boxShadow: 'inset -1px -1px 3px rgba(255,255,255,0.05)'
              }}
            ></div>
          ))}
        </div>

        {/* TOP: HEADING CONTAINER */}
        <div className="text-center pt-12 md:pt-16 pb-4 relative z-20 px-6 shrink-0 transition-all">
          <span className="text-[var(--accent-solid)] font-black uppercase tracking-[0.6em] text-[10px] block mb-2 md:mb-3 animate-pulse">Nelbac Fluid Logic</span>
          <h2 className="text-4xl md:text-7xl font-black font-heading uppercase italic tracking-tighter text-white leading-none">
            Specification <span className="text-gradient">Sprinkler.</span>
          </h2>
        </div>

        {/* MIDDLE: INTERACTIVE HUB & ORBIT */}
        <div className="relative w-full flex-1 flex items-center justify-center max-w-[1600px] mx-auto px-6 overflow-visible">
          
          {/* CENTRAL HUB */}
          <div className="absolute z-10 flex items-center justify-center" style={{ width: hubSize, height: hubSize }}>
            <div 
              className="relative rounded-full border-[6px] border-white/10 glass flex items-center justify-center shadow-[0_0_80px_rgba(0,243,255,0.2)]"
              style={{ 
                width: '100%', 
                height: '100%', 
                transform: `rotate(${rotation * 3}deg)` 
              }}
            >
              <div className="absolute w-full h-1 bg-[var(--accent-solid)] shadow-[0_0_20px_#00f3ff] opacity-40"></div>
              <div className="absolute h-full w-1 bg-[var(--accent-solid)] shadow-[0_0_20px_#00f3ff] opacity-40"></div>
              <div className="rounded-full bg-black border-2 border-[var(--accent-solid)] flex items-center justify-center shadow-[0_0_30px_#00f3ff]" style={{ width: hubSize * 0.5, height: hubSize * 0.5 }}>
                 <i className={`fas fa-microchip text-[var(--accent-solid)] animate-pulse`} style={{ fontSize: `${18 * responsiveScale}px` }}></i>
              </div>
            </div>
            
            <div className="absolute pointer-events-none opacity-20" style={{ inset: `-${hubSize * 0.7}px` }}>
               {visionSections.map((_, i) => (
                 <div 
                   key={i}
                   className="absolute top-1/2 left-1/2 w-px bg-gradient-to-t from-[var(--accent-solid)] to-transparent"
                   style={{ 
                     height: hubSize * 1.6,
                     transform: `translate(-50%, -100%) rotate(${rotation + i * (360/visionSections.length)}deg)`,
                     transformOrigin: 'bottom center'
                   }}
                 ></div>
               ))}
            </div>
          </div>

          {/* ORBITING NODES */}
          <div className="relative w-full h-full flex items-center justify-center">
            {visionSections.map((v, i) => {
              const step = 360 / visionSections.length;
              const angle = (i * step + rotation) % 360;
              const angleRad = (angle * Math.PI) / 180;
              
              const x = Math.sin(angleRad) * radiusX;
              const y = Math.cos(angleRad) * radiusY;
              
              const distanceFront = Math.abs(angle - 180);
              const isFocused = distanceFront < 20;
              
              const baseDist = Math.cos(angleRad - Math.PI);
              const scaleFactor = Math.pow(Math.max(0, baseDist), 15);
              const scale = 1.0 + (scaleFactor * 3.2); 
              const opacity = 0.4 + (scaleFactor * 0.6);
              const zIndex = Math.round(1000 * scaleFactor);

              return (
                <div 
                  key={v.id}
                  className="absolute cursor-pointer"
                  style={{ 
                    transform: `translate(${x}px, ${y}px) scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity,
                    transition: 'transform 0.05s linear, opacity 0.2s ease-out'
                  }}
                  onMouseEnter={() => setHoveredId(v.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    setRotation((180 - i * step + 360) % 360);
                  }}
                >
                  <div 
                    className={`relative rounded-full overflow-hidden border transition-all duration-700 glass ${isFocused ? 'border-[var(--accent-solid)] shadow-[0_0_50px_rgba(0,243,255,0.6)]' : 'border-white/20'}`}
                    style={{ width: bubbleSizeBase, height: bubbleSizeBase }}
                  >
                    {/* RESTORED IMAGE VISIBILITY WITH MODERATED DIMMING */}
                    <img 
                      src={v.img} 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isFocused ? 'grayscale-0 opacity-100 scale-110 brightness-[0.7]' : 'grayscale opacity-50 blur-[1px]'}`} 
                      alt="" 
                    />
                    
                    {/* PROTECTIVE LAYER FOR TEXT CONTENT */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-40'}`}></div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                      <i className={`fas ${v.icon} mb-1 transition-all duration-700 ${isFocused ? 'text-[var(--accent-solid)] scale-125' : 'text-white/50'}`} style={{ fontSize: `${16 * responsiveScale}px` }}></i>
                      
                      <div className={`transition-all duration-700 ${isFocused ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'}`}>
                         {/* ENHANCED READABILITY PLATE */}
                         <div className="bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10 shadow-2xl">
                           <h3 className="font-black uppercase text-white tracking-widest leading-none mb-1 drop-shadow-xl" style={{ fontSize: `${Math.max(8, 9 * responsiveScale)}px` }}>{v.title}</h3>
                           <p className="text-white font-bold leading-tight mx-auto opacity-100 drop-shadow-lg" style={{ fontSize: `${Math.max(5, 6 * responsiveScale)}px`, maxWidth: `${90 * responsiveScale}px` }}>{v.content}</p>
                         </div>
                      </div>

                      {!isFocused && (
                        <span className="absolute bottom-4 font-black uppercase tracking-[0.3em] text-white/60 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-[2px]" style={{ fontSize: `${Math.max(6, 7 * responsiveScale)}px` }}>{v.short}</span>
                      )}
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none rotate-[-90deg]">
                      <circle 
                        cx="50%" cy="50%" r="48%" 
                        fill="none" 
                        stroke="var(--accent-solid)" 
                        strokeWidth="1.5" 
                        strokeDasharray="400" 
                        strokeDashoffset={isFocused ? 0 : 400}
                        style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                      />
                    </svg>
                  </div>
                  
                  {isFocused && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[var(--accent-solid)] font-black tracking-[0.4em] uppercase whitespace-nowrap animate-pulse drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" style={{ fontSize: `${Math.max(5, 6 * responsiveScale)}px` }}>
                       DATA_STREAM // {v.id}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM: TELEMETRY FOOTER */}
        <div className="relative z-20 pb-12 shrink-0 flex flex-col items-center gap-4 opacity-40">
          <div className="flex gap-4 items-center">
            <div className="h-px w-24 md:w-48 bg-gradient-to-r from-transparent via-[var(--accent-solid)]/30 to-transparent"></div>
            <div className="font-mono text-[8px] md:text-[9px] text-white/60 font-bold tracking-[0.6em] md:tracking-[1em] uppercase whitespace-nowrap">HYDRO_TELEMETRY_SYNC</div>
            <div className="h-px w-24 md:w-48 bg-gradient-to-l from-transparent via-[var(--accent-solid)]/30 to-transparent"></div>
          </div>
          <div className="flex gap-3">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-500 ${activeVisionIdx === i ? 'bg-[var(--accent-solid)] scale-150 shadow-[0_0_10px_#00f3ff]' : 'bg-white/10'}`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      <section id="hardware" className="py-32 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
             <span className="text-[var(--accent-solid)] font-bold uppercase tracking-[0.6em] text-xs block mb-4">Precision Catalog</span>
             <h2 className="text-5xl md:text-8xl font-black font-heading uppercase italic tracking-tighter">Field <span className="text-gradient">Hardware.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderCart = () => (
    <div className="pt-40 pb-32 max-w-5xl mx-auto px-6 min-h-screen">
       <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-10">
          <h2 className="text-5xl md:text-7xl font-black font-heading uppercase italic tracking-tighter leading-none">The <span className="text-gradient">Queue.</span></h2>
          <span className="font-mono text-xs text-[var(--text-secondary)] uppercase">{cartCount} ACTIVE NODES</span>
       </div>

       {cart.length === 0 ? (
         <div className="py-40 text-center">
            <div className="w-24 h-24 rounded-full border border-dashed border-white/10 flex items-center justify-center mx-auto mb-10">
               <i className="fas fa-shopping-bag text-white/20 text-3xl"></i>
            </div>
            <p className="text-[var(--text-secondary)] font-medium mb-12 tracking-wide uppercase text-xs">Your deployment queue is empty.</p>
            <button onClick={() => setCurrentPage(Page.Home)} className="interactive px-14 py-6 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-[var(--accent-solid)] transition-all shadow-xl">Return to Hub</button>
         </div>
       ) : (
         <div className="space-y-6">
           {cart.map(item => (
              <div key={item.product.id} className="glass p-10 flex flex-col md:flex-row items-center justify-between group transition-all hover:border-[var(--accent-solid)]/40 rounded-[2.5rem] shadow-xl">
                <div className="flex items-center gap-12 flex-1">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden border border-white/10 flex-shrink-0 shadow-lg">
                    <img src={item.product.image} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black uppercase font-heading italic text-white mb-2 tracking-tighter">{item.product.name}</h4>
                    <span className="text-[var(--accent-solid)] font-mono text-[11px] tracking-widest uppercase font-black">NODE_ID: {item.product.id.split('-').pop()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-16 mt-8 md:mt-0">
                   <div className="flex items-center gap-8 px-8 py-4 rounded-full bg-white/5 border border-white/10 shadow-inner">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="interactive text-white/30 hover:text-white transition-colors"><i className="fas fa-minus text-[10px]"></i></button>
                      <span className="font-mono text-white text-xl font-black min-w-[24px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="interactive text-white/30 hover:text-white transition-colors"><i className="fas fa-plus text-[10px]"></i></button>
                   </div>
                   <div className="text-right min-w-[140px]">
                      <div className="text-3xl font-black text-white italic font-heading tracking-tighter">${(item.product.price * item.quantity).toFixed(2)}</div>
                      <button onClick={() => {
                        setCart(prev => prev.filter(i => i.product.id !== item.product.id));
                      }} className="text-[9px] font-black uppercase text-red-500/50 hover:text-red-500 mt-3 tracking-widest transition-colors">Abort Node</button>
                   </div>
                </div>
              </div>
           ))}

           <div className="mt-24 pt-12 border-t border-white/5">
              <div className="flex justify-between items-center mb-16">
                 <span className="text-[var(--text-secondary)] font-black uppercase tracking-[0.6em] text-xs">Deployment Subtotal</span>
                 <span className="text-7xl font-black text-white font-heading tracking-tighter italic">${cartTotal.toFixed(2)}</span>
              </div>
              <button className="interactive w-full py-12 bg-[var(--accent-solid)] text-black font-black uppercase tracking-[0.6em] text-[13px] rounded-full hover:shadow-[0_0_60px_rgba(0,243,255,0.4)] transition-all active:scale-[0.98] shadow-2xl">Execute Industrial Deployment</button>
           </div>
         </div>
       )}
    </div>
  );

  return (
    <div className="min-h-screen selection:bg-[var(--accent-solid)] selection:text-black">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} cartCount={cartCount} />
      <main>
        {currentPage === Page.Home && renderHome()}
        {currentPage === Page.Products && renderHome()}
        {currentPage === Page.Cart && renderCart()}
      </main>
      
      <footer className="py-32 bg-[var(--bg-secondary)] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-solid)]/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2">
              <div className="text-4xl font-black font-heading text-white tracking-tighter italic mb-10">NELBAC // SYSTEMS</div>
              <p className="text-[var(--text-secondary)] text-base font-light max-w-md leading-relaxed">Pioneering the next generation of industrial automation through fluid-logic IoT hardware and neural-orchestrated cloud systems.</p>
            </div>
            <div>
              <h5 className="text-[var(--accent-solid)] font-black uppercase tracking-[0.4em] text-[11px] mb-10">Resources</h5>
              <ul className="space-y-5">
                <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors tracking-wide">Developer Hub</a></li>
                <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors tracking-wide">Integration Docs</a></li>
                <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors tracking-wide">Telemetry API</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[var(--accent-solid)] font-black uppercase tracking-[0.4em] text-[11px] mb-10">Legal</h5>
              <ul className="space-y-5">
                <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors tracking-wide">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors tracking-wide">Privacy Protocol</a></li>
                <li><a href="#" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors tracking-wide">Security Matrix</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.5em]">© 2024 NELBAC IOT • HYDRAULIC PRECISION SYSTEMS</p>
            <div className="flex gap-10 text-[var(--text-secondary)] text-lg">
              <a href="#" className="hover:text-[var(--accent-solid)] transition-all hover:scale-125"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="hover:text-[var(--accent-solid)] transition-all hover:scale-125"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-[var(--accent-solid)] transition-all hover:scale-125"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>
      </footer>

      <SmartAdvisor />
    </div>
  );
};

export default App;
