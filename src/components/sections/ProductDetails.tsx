import React, { useState, useEffect, useRef } from 'react';
import { Product, Page } from '@/types';
import { PRODUCTS } from '@/constants';
import DeliveryChecker from '@/components/ui/DeliveryChecker';
import heroVideo from '@/assets/images/products/nelbac1.mp4';
import powerFailureImg from '@/assets/images/products/power_failure_recovery.jpg';
import installationImg from '@/assets/images/products/installation.jpg';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: Page) => void;
  onSelectProduct: (product: Product) => void;
}

// Extended product details (dummy content for the detail page)
const PRODUCT_EXTENDED_DETAILS: Record<string, {
  highlights: { label: string; value: string; icon: string }[];
  detailedSpecs: { label: string; value: string; icon: string }[];
  features: { title: string; subtitle: string; description: string; image: string }[];
  gallery: string[];
}> = {
  'nbgatv3-2': {
    highlights: [
      { label: 'Zones', value: '2', icon: 'fa-layer-group' },
      { label: 'Memory', value: 'EEPROM', icon: 'fa-microchip' },
      { label: 'Power', value: '12V DC', icon: 'fa-bolt' },
      { label: 'Warranty', value: '2 Years', icon: 'fa-shield-halved' },
    ],
    detailedSpecs: [
      { label: 'Dimensions', value: '160 mm × 100 mm × 45 mm', icon: 'fa-ruler-combined' },
      { label: 'Operating Voltage', value: '12V DC / 24V AC', icon: 'fa-plug-circle-bolt' },
      { label: 'Weight', value: '320g', icon: 'fa-weight-hanging' },
      { label: 'Processor', value: 'ATmega328P Microcontroller', icon: 'fa-microchip' },
      { label: 'Memory', value: 'EEPROM Non-Volatile Storage', icon: 'fa-memory' },
      { label: 'Valve Support', value: 'AC Solenoid / DC Latch', icon: 'fa-faucet-drip' },
      { label: 'Enclosure Rating', value: 'IP65 Weather Resistant', icon: 'fa-droplet-slash' },
      { label: 'Display', value: 'LED Status Indicators', icon: 'fa-display' },
    ],
    features: [
      {
        title: 'Smart Zone\nManagement',
        subtitle: 'Intelligent control for every corner.',
        description: 'Manage two independent irrigation zones with customized schedules and durations. Set different watering times for each zone based on plant type, soil conditions, and sunlight exposure. The controller automatically sequences between zones for optimal water distribution.',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=1200',
      },
      {
        title: 'Power Failure\nRecovery',
        subtitle: 'Never miss a watering cycle.',
        description: 'Our proprietary EEPROM-based memory system ensures your irrigation schedules persist through power outages. When power returns, the controller automatically resumes operations exactly where it left off — no reprogramming needed, no missed cycles, no wasted water.',
        image: powerFailureImg,
      },
      {
        title: 'Flexible\nInstallation',
        subtitle: 'Built for Indian conditions.',
        description: 'Designed with an IP65-rated enclosure for indoor and outdoor mounting. Compatible with standard AC solenoid valves and DC latch valves. Supports direct water pump control with built-in relay protection. Installation takes under 30 minutes with our quick-connect terminal system.',
        image: installationImg,
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
      powerFailureImg,
      installationImg,
    ],
  },
  'nbgatv3-4': {
    highlights: [
      { label: 'Zones', value: '4', icon: 'fa-layer-group' },
      { label: 'Memory', value: 'EEPROM', icon: 'fa-microchip' },
      { label: 'Power', value: '12V DC', icon: 'fa-bolt' },
      { label: 'Warranty', value: '2 Years', icon: 'fa-shield-halved' },
    ],
    detailedSpecs: [
      { label: 'Dimensions', value: '200 mm × 120 mm × 50 mm', icon: 'fa-ruler-combined' },
      { label: 'Operating Voltage', value: '12V DC / 24V AC', icon: 'fa-plug-circle-bolt' },
      { label: 'Weight', value: '450g', icon: 'fa-weight-hanging' },
      { label: 'Processor', value: 'ATmega2560 Microcontroller', icon: 'fa-microchip' },
      { label: 'Memory', value: 'EEPROM Non-Volatile Storage', icon: 'fa-memory' },
      { label: 'Valve Support', value: 'AC Solenoid / DC Latch', icon: 'fa-faucet-drip' },
      { label: 'Enclosure Rating', value: 'IP65 Weather Resistant', icon: 'fa-droplet-slash' },
      { label: 'Display', value: 'LCD with Backlight', icon: 'fa-display' },
    ],
    features: [
      {
        title: 'Per-Zone\nDuration Control',
        subtitle: 'Precision for every plant type.',
        description: 'Set individual watering durations for each of the four zones based on your specific plant requirements, emitter types, water pressure, and flow rate. From delicate flowers to hardy shrubs — every zone gets exactly what it needs, nothing more, nothing less.',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=1200',
      },
      {
        title: 'Hydroponics\nReady',
        subtitle: 'Engineered for soilless growing.',
        description: 'Purpose-built timing precision makes the NBGATV3.4 ideal for hydroponic and aquaponic setups. Control nutrient delivery, drainage cycles, and flood-and-drain sequences with second-level accuracy. The four independent zones let you manage different growth stages simultaneously.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1200',
      },
      {
        title: 'Robust\nMemory System',
        subtitle: 'Set once. Run forever.',
        description: 'Advanced non-volatile EEPROM storage retains all programming through unlimited power cycles. Your schedules, zone configurations, and custom settings survive everything — from planned maintenance shutdowns to unexpected outages. The system resumes autonomously without any user intervention.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    ],
  },
  'nbgatv3-6': {
    highlights: [
      { label: 'Zones', value: '6', icon: 'fa-layer-group' },
      { label: 'Memory', value: 'EEPROM', icon: 'fa-microchip' },
      { label: 'Power', value: '24V AC', icon: 'fa-bolt' },
      { label: 'Warranty', value: '3 Years', icon: 'fa-shield-halved' },
    ],
    detailedSpecs: [
      { label: 'Dimensions', value: '240 mm × 140 mm × 55 mm', icon: 'fa-ruler-combined' },
      { label: 'Operating Voltage', value: '12V DC / 24V AC', icon: 'fa-plug-circle-bolt' },
      { label: 'Weight', value: '580g', icon: 'fa-weight-hanging' },
      { label: 'Processor', value: 'ESP32 Dual-Core Microcontroller', icon: 'fa-microchip' },
      { label: 'Memory', value: 'EEPROM + Flash Storage', icon: 'fa-memory' },
      { label: 'Valve Support', value: 'AC Solenoid / DC Latch', icon: 'fa-faucet-drip' },
      { label: 'Enclosure Rating', value: 'IP67 Weather Resistant', icon: 'fa-droplet-slash' },
      { label: 'Display', value: 'LCD with Backlight', icon: 'fa-display' },
    ],
    features: [
      {
        title: 'Farm-Scale\nAutomation',
        subtitle: 'From smallholdings to commercial plots.',
        description: 'Six independently configurable zones cover up to 2 acres of mixed cultivation. Assign different crop types to different zones with unique watering schedules, durations, and frequencies. The sequential zone activation prevents pressure drops and ensures consistent coverage across your entire operation.',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
      },
      {
        title: 'Industrial\nReliability',
        subtitle: 'Built to outlast harsh conditions.',
        description: 'Military-grade IP67 enclosure withstands dust storms, heavy rainfall, and temperature extremes from -10°C to 55°C. Surge-protected inputs handle voltage spikes common in rural power grids. Stainless steel terminal blocks resist corrosion in high-humidity environments.',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200',
      },
      {
        title: 'Future-Ready\nConnectivity',
        subtitle: 'IoT integration at its core.',
        description: 'Powered by the ESP32 dual-core processor with built-in Wi-Fi and Bluetooth capabilities. Access real-time zone status, modify schedules remotely, and receive alerts for anomalies. OTA firmware updates ensure your controller evolves with new features — without a single farm visit.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    ],
  },
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onAddToCart, onNavigate, onSelectProduct }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'features'>('specs');
  const [quantity, setQuantity] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [heroParallax, setHeroParallax] = useState(0);

  const extended = PRODUCT_EXTENDED_DETAILS[product.id] || PRODUCT_EXTENDED_DETAILS['nbgatv3-4'];
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id);

  useEffect(() => {
    setIsVisible(true);
    setQuantity(1);
    setActiveGalleryIdx(0);
    setActiveTab('specs');
  }, [product.id]);

  // Simple fade overlay near loop boundary to smooth the transition
  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;
    let rafId: number;

    const FADE_IN = 1.0;
    const FADE_OUT = 1.0;
    const ease = (t: number) => t * t * (3 - 2 * t);

    const check = () => {
      if (video.duration > 0) {
        const remaining = video.duration - video.currentTime;
        const t = video.currentTime;

        if (remaining <= FADE_IN) {
          const p = 1 - remaining / FADE_IN;
          overlay.style.opacity = String(ease(Math.min(p, 1)));
        } else if (t < FADE_OUT) {
          const p = t / FADE_OUT;
          overlay.style.opacity = String(ease(1 - Math.min(p, 1)));
        } else {
          overlay.style.opacity = '0';
        }
      }
      rafId = requestAnimationFrame(check);
    };

    rafId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Hero parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHeroParallax(scrollY * 0.3);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-[var(--bg-primary)] transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* ===================== HERO SECTION ===================== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background video with blur/fade overlay to mask loop restart */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src={heroVideo}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: `translateY(${heroParallax}px)` }}
          />
          {/* Blur/fade overlay — fades in at end, holds through restart, fades out */}
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0,
              background: 'var(--bg-primary)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              transform: `translateY(${heroParallax}px)`,
              willChange: 'opacity',
            }}
          />
          <div className="absolute inset-0 bg-black/45"></div>
        </div>
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]" style={{ zIndex: 1 }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/90 via-[var(--bg-primary)]/40 to-transparent" style={{ zIndex: 1 }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full pt-32 pb-20">
          <div className="max-w-3xl">
            
            {/* Product Info */}
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-3 mb-8">
                <button 
                  onClick={() => onNavigate(Page.Products)}
                  className="interactive text-[var(--text-secondary)] hover:text-[var(--accent-solid)] transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
                >
                  Products
                </button>
                <i className="fas fa-chevron-right text-[var(--text-secondary)]/30 text-[8px]"></i>
                <span className="text-[var(--accent-solid)] text-[10px] font-black uppercase tracking-[0.3em]">{product.name}</span>
              </div>

              {/* Category Tag */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border border-[var(--border-primary)] mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-solid)] animate-pulse"></span>
                <span className="text-[var(--accent-solid)] font-black text-[9px] tracking-[0.4em] uppercase">{product.category}_SERIES</span>
              </div>

              {/* Product Name */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-heading text-[var(--text-primary)] uppercase italic leading-[0.85] tracking-tighter mb-6">
                {product.name}
              </h1>

              {/* Tagline */}
              <h2 className="text-xl md:text-2xl font-light text-[var(--text-secondary)] uppercase tracking-[0.2em] italic mb-8">
                {product.tagline}
              </h2>

              {/* Description */}
              <p className="text-[var(--text-secondary)] text-sm md:text-base font-light leading-relaxed mb-10 max-w-lg">
                {product.description}
              </p>

              {/* Price & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
                <div>
                  <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Unit Price</span>
                  <span className="text-5xl md:text-6xl font-black font-heading text-[var(--text-primary)] italic tracking-tighter">₹{product.price}</span>
                </div>
                
                <div className="flex items-center gap-4 sm:ml-8">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 px-5 py-3 glass rounded-2xl border border-[var(--border-primary)]">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                      className="interactive text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <i className="fas fa-minus text-xs"></i>
                    </button>
                    <span className="font-black text-[var(--text-primary)] text-lg font-mono w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)} 
                      className="interactive text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <i className="fas fa-plus text-xs"></i>
                    </button>
                  </div>
                  
                  {/* Add to Cart */}
                  <button 
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) onAddToCart(product);
                    }}
                    className="interactive group relative px-10 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-[var(--accent-solid)] hover:text-black transition-all shadow-xl active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <i className="fas fa-cart-plus"></i>
                      Add to Cart
                    </span>
                    <div className="absolute inset-0 bg-[var(--accent-solid)] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                </div>
              </div>

              {/* Delivery Check */}
              <div className="mb-12 max-w-md">
                <DeliveryChecker orderValue={product.price * quantity} />
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {extended.highlights.map((stat, idx) => (
                  <div 
                    key={idx}
                    className="relative glass rounded-2xl p-5 border border-[var(--border-secondary)] hover:border-[var(--accent-solid)]/30 transition-all group"
                  >
                    <i className={`fas ${stat.icon} text-[var(--accent-solid)] text-lg mb-3 block group-hover:scale-110 transition-transform`}></i>
                    <div className="text-2xl font-black font-heading text-[var(--text-primary)] italic tracking-tight">{stat.value}</div>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 animate-bounce">
          <span className="text-[var(--text-secondary)] text-[8px] font-black uppercase tracking-[0.5em]">Explore</span>
          <i className="fas fa-chevron-down text-[var(--accent-solid)] text-sm"></i>
        </div>
      </section>


      {/* ===================== PRODUCT SHOWCASE SECTION ===================== */}
      <section className="relative py-24 md:py-40 bg-[var(--bg-primary)] border-t border-[var(--border-secondary)] overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[var(--accent-solid)]/3 blur-[200px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          {/* Top Badge */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="grid grid-cols-2 gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-solid)]"></span>
                <span className="w-2 h-2 rounded-full bg-[var(--accent-solid)]/50"></span>
                <span className="w-2 h-2 rounded-full bg-[var(--accent-solid)]/50"></span>
                <span className="w-2 h-2 rounded-full bg-[var(--accent-solid)]"></span>
              </div>
            </div>
            <span className="text-[var(--accent-solid)] font-black text-[10px] tracking-[0.5em] uppercase mb-8">NELBAC</span>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading text-[var(--text-primary)] text-center leading-[1.1] tracking-tight mb-8">
              Welcome to Smart<br />
              <span className="text-gradient not-italic">Irrigation</span>
            </h2>

            {/* Description */}
            <p className="text-[var(--text-secondary)] text-sm md:text-base font-light leading-relaxed text-center max-w-3xl">
              {product.description}. Engineered for reliability and built for Indian conditions — our controllers bring precision automation to every garden, farm, and landscape.
            </p>
          </div>

          {/* Three Product Images Layout */}
          <div className="relative flex items-center justify-center gap-4 md:gap-8 lg:gap-12 my-16 md:my-24 px-4">
            {/* Left Product */}
            {relatedProducts[0] && (
              <div 
                className="relative flex-shrink-0 w-[140px] md:w-[220px] lg:w-[280px] group cursor-pointer"
                onClick={() => {
                  onSelectProduct(relatedProducts[0]);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-[var(--border-secondary)] group-hover:border-[var(--accent-solid)]/30 transition-all duration-500 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]">
                  <img 
                    src={relatedProducts[0].image} 
                    alt={relatedProducts[0].name}
                    className="w-full h-auto object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
                <p className="text-center text-[var(--text-secondary)] text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] mt-4 group-hover:text-[var(--accent-solid)] transition-colors">{relatedProducts[0].name}</p>
              </div>
            )}

            {/* Center Product (Current - Large) */}
            <div className="relative flex-shrink-0 w-[200px] md:w-[320px] lg:w-[420px] z-10">
              {/* Decorative accent arcs */}
              <div className="absolute -top-4 -right-6 md:-top-6 md:-right-10 w-16 h-24 md:w-24 md:h-36 pointer-events-none">
                <svg viewBox="0 0 60 90" fill="none" className="w-full h-full">
                  <path d="M10 90 C10 40, 50 40, 50 0" stroke="var(--accent-solid)" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
                </svg>
              </div>
              <div className="absolute -bottom-4 -left-6 md:-bottom-6 md:-left-10 w-16 h-24 md:w-24 md:h-36 pointer-events-none rotate-180">
                <svg viewBox="0 0 60 90" fill="none" className="w-full h-full">
                  <path d="M10 90 C10 40, 50 40, 50 0" stroke="var(--accent-solid)" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
                </svg>
              </div>
              {/* Purple/blue decorative arcs (secondary color) */}
              <div className="absolute top-1/4 -left-8 md:-left-12 w-12 h-20 md:w-20 md:h-32 pointer-events-none">
                <svg viewBox="0 0 50 80" fill="none" className="w-full h-full">
                  <path d="M40 0 C0 10, 0 70, 40 80" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>
              <div className="absolute top-1/4 -right-8 md:-right-12 w-12 h-20 md:w-20 md:h-32 pointer-events-none">
                <svg viewBox="0 0 50 80" fill="none" className="w-full h-full">
                  <path d="M10 0 C50 10, 50 70, 10 80" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>

              <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-2 border-[var(--accent-solid)]/20 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] shadow-2xl shadow-[var(--accent-solid)]/5">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/20 via-transparent to-transparent pointer-events-none"></div>
              </div>
              <p className="text-center text-[var(--accent-solid)] text-xs md:text-sm font-black uppercase tracking-[0.3em] mt-5">{product.name}</p>
            </div>

            {/* Right Product */}
            {relatedProducts[1] && (
              <div 
                className="relative flex-shrink-0 w-[140px] md:w-[220px] lg:w-[280px] group cursor-pointer"
                onClick={() => {
                  onSelectProduct(relatedProducts[1]);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-[var(--border-secondary)] group-hover:border-[var(--accent-solid)]/30 transition-all duration-500 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]">
                  <img 
                    src={relatedProducts[1].image} 
                    alt={relatedProducts[1].name}
                    className="w-full h-auto object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
                <p className="text-center text-[var(--text-secondary)] text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] mt-4 group-hover:text-[var(--accent-solid)] transition-colors">{relatedProducts[1].name}</p>
              </div>
            )}
          </div>

          {/* Highlight Spec Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
            {extended.highlights.map((stat, idx) => (
              <div 
                key={idx}
                className="relative glass rounded-2xl p-6 md:p-8 border border-[var(--border-secondary)] hover:border-[var(--accent-solid)]/30 transition-all group text-center"
              >
                <i className={`fas ${stat.icon} text-[var(--text-secondary)] text-lg md:text-xl mb-4 block group-hover:text-[var(--accent-solid)] transition-colors`}></i>
                <div className="text-xl md:text-2xl font-black font-heading text-[var(--text-primary)] tracking-tight mb-1">{stat.value}</div>
                <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button 
              onClick={() => {
                const specsSection = document.querySelector('[data-section="tech-specs"]');
                if (specsSection) specsSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="interactive group relative px-10 py-4 bg-[var(--accent-solid)] text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:shadow-lg hover:shadow-[var(--accent-solid)]/20 transition-all active:scale-95"
            >
              Technical Specification
            </button>
          </div>
        </div>
      </section>


      {/* ===================== FEATURE HIGHLIGHTS — ALTERNATING ===================== */}
      {extended.features.map((feature, idx) => (
        <section 
          key={idx}
          className="relative py-24 md:py-40 overflow-hidden border-t border-[var(--border-secondary)]"
          style={{ background: idx % 2 === 1 ? 'var(--bg-secondary)' : 'var(--bg-primary)' }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute w-[500px] h-[500px] rounded-full bg-[var(--accent-solid)]/5 blur-[150px] ${idx % 2 === 0 ? 'top-20 right-20' : 'bottom-20 left-20'}`}></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${idx % 2 === 1 ? 'direction-rtl' : ''}`}>
              
              {/* Image Side */}
              <div className={`${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative group">
                  <div className="absolute -inset-4 rounded-[3rem] bg-[var(--accent-solid)]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="relative rounded-[2.5rem] overflow-hidden border border-[var(--border-primary)]">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: `brightness(var(--bg-img-brightness, 0.7))` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/60 via-transparent to-transparent"></div>
                    
                    {/* Corner frames */}
                    <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[var(--accent-solid)]/40 rounded-tl-2xl"></div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[var(--accent-solid)]/40 rounded-br-2xl"></div>
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className={`${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border border-[var(--border-primary)] mb-8">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-solid)] animate-pulse"></span>
                  <span className="text-[var(--accent-solid)] font-black text-[9px] tracking-[0.4em] uppercase">NELBAC</span>
                </div>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading text-[var(--text-primary)] uppercase italic leading-[0.85] tracking-tighter mb-6 whitespace-pre-line">
                  {feature.title}
                </h2>

                <h3 className="text-lg md:text-xl font-light text-[var(--accent-solid)] uppercase tracking-[0.2em] italic mb-8">
                  {feature.subtitle}
                </h3>

                <p className="text-[var(--text-secondary)] text-sm md:text-base font-light leading-relaxed mb-10 max-w-lg">
                  {feature.description}
                </p>

                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) onAddToCart(product);
                    }}
                    className="interactive group relative px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-[var(--accent-solid)] hover:text-black transition-all shadow-xl active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10">Order Now</span>
                    <div className="absolute inset-0 bg-[var(--accent-solid)] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                  <button 
                    onClick={() => onNavigate(Page.Products)}
                    className="interactive px-8 py-4 glass border border-[var(--border-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl text-[var(--text-primary)] hover:border-[var(--accent-solid)]/50 transition-all"
                  >
                    All Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}


      {/* ===================== TECH SPECS SECTION ===================== */}
      <section data-section="tech-specs" className="relative py-24 md:py-40 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-solid)]/20 to-transparent"></div>
          <div className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full bg-[var(--accent-solid)]/3 blur-[200px]"></div>
          <div className="absolute bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-purple-500/3 blur-[180px]"></div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">

          {/* --- Top: Header with product image hero --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-20 md:mb-28">
            
            {/* Left: Title area */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border border-[var(--border-primary)] mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-solid)] animate-pulse"></span>
                <span className="text-[var(--accent-solid)] font-black text-[9px] tracking-[0.4em] uppercase">TECHNICAL_SPECIFICATION</span>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter leading-[0.9] mb-6">
                Technology<br />
                <span className="text-gradient not-italic">friendly</span><br />
                <span className="text-[var(--text-secondary)]/60">to all.</span>
              </h2>
              <p className="text-[var(--text-secondary)] font-light max-w-lg text-sm md:text-base leading-relaxed mb-8">
                Engineered with precision. Designed for simplicity. Every specification crafted for real-world performance in demanding environments.
              </p>

              {/* Price banner inline */}
              <div className="inline-flex items-baseline gap-4 glass rounded-2xl px-8 py-5 border border-[var(--accent-solid)]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-solid)]/10 rounded-full blur-[50px]"></div>
                <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em]">From</span>
                <span className="text-4xl md:text-5xl font-black font-heading text-[var(--text-primary)] italic tracking-tighter relative">₹{product.price}</span>
                <span className="text-[var(--text-secondary)] text-xs font-light">/unit</span>
              </div>
            </div>

            {/* Right: Product image */}
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="absolute -inset-6 rounded-[3rem] bg-[var(--accent-solid)]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                {/* Decorative ring */}
                <div className="absolute -inset-3 rounded-[2.8rem] border border-[var(--accent-solid)]/10"></div>
                
                <div className="relative rounded-[2.5rem] overflow-hidden border border-[var(--border-primary)] bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)]/60 via-transparent to-transparent"></div>
                  
                  {/* Floating product name */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[var(--accent-solid)] text-[9px] font-black uppercase tracking-[0.4em]">{product.category}</span>
                    <h3 className="text-3xl font-black font-heading text-white uppercase italic tracking-tight">{product.name}</h3>
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-10 h-10 border-t-2 border-l-2 border-[var(--accent-solid)]/30 rounded-tl-2xl"></div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-2 border-r-2 border-[var(--accent-solid)]/30 rounded-br-2xl"></div>
              </div>
            </div>
          </div>

          {/* --- Specs Grid: Bento-style layout --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12">
            {extended.detailedSpecs.map((spec, idx) => {
              // Make first two items span 2 columns on large screens
              const isLarge = idx < 2;
              return (
                <div 
                  key={idx}
                  className={`group relative glass rounded-[1.5rem] p-6 md:p-7 border border-[var(--border-secondary)] hover:border-[var(--accent-solid)]/30 transition-all duration-500 overflow-hidden ${isLarge ? 'lg:col-span-2' : ''}`}
                >
                  {/* Hover glow */}
                  <div className="absolute -inset-1 bg-[var(--accent-solid)]/0 group-hover:bg-[var(--accent-solid)]/5 rounded-[1.8rem] blur-xl transition-all duration-500"></div>
                  
                  {/* Subtle corner gradient */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-solid)]/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                  <div className="relative flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-solid)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent-solid)]/20 group-hover:scale-110 transition-all duration-300">
                      <i className={`fas ${spec.icon} text-[var(--accent-solid)] text-base`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-2">{spec.label}</h4>
                      <p className="text-[var(--text-primary)] font-bold text-sm md:text-base truncate">{spec.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                for (let i = 0; i < quantity; i++) onAddToCart(product);
              }}
              className="interactive group relative px-12 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-[var(--accent-solid)] hover:text-black transition-all shadow-xl active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <i className="fas fa-cart-plus"></i>
                Order Now
              </span>
              <div className="absolute inset-0 bg-[var(--accent-solid)] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
            <button 
              onClick={() => onNavigate(Page.Products)}
              className="interactive px-12 py-5 glass border border-[var(--border-primary)] font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl text-[var(--text-primary)] hover:border-[var(--accent-solid)]/50 transition-all"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>


      {/* ===================== PROMOTIONAL VIDEO SECTION ===================== */}
      {product.video && (
        <section className="relative py-24 md:py-40 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--accent-solid)]/3 via-transparent to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <div className="text-center mb-16 md:mb-24">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border border-[var(--border-primary)] mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-solid)] animate-pulse"></span>
                <span className="text-[var(--accent-solid)] font-black text-[9px] tracking-[0.4em] uppercase">NELBAC</span>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter mb-6">
                See the<br />
                <span className="text-gradient not-italic">promotional video.</span>
              </h2>
            </div>

            {/* Video Player */}
            <div className="relative group max-w-4xl mx-auto">
              <div className="absolute -inset-4 rounded-[3rem] bg-[var(--accent-solid)]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden border border-[var(--border-primary)] bg-black aspect-video">
                <video 
                  src={product.video}
                  controls
                  className="w-full h-full object-cover"
                  poster={product.image}
                />
              </div>
              {/* Corner frames */}
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-[var(--accent-solid)]/30 rounded-tl-2xl pointer-events-none"></div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-[var(--accent-solid)]/30 rounded-br-2xl pointer-events-none"></div>
            </div>
          </div>
        </section>
      )}


      {/* ===================== KEY FEATURES GRID ===================== */}
      <section className="relative py-24 md:py-40 bg-[var(--bg-primary)] border-t border-[var(--border-secondary)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter mb-6">
              Key<br />
              <span className="text-gradient not-italic">Features.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.features.map((feature, idx) => (
              <div 
                key={idx}
                className="group relative glass rounded-[2rem] p-8 md:p-10 border border-[var(--border-secondary)] hover:border-[var(--accent-solid)]/30 transition-all duration-500"
              >
                <div className="absolute -inset-1 bg-[var(--accent-solid)]/0 group-hover:bg-[var(--accent-solid)]/5 rounded-[2rem] blur-xl transition-all duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-solid)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--accent-solid)]/20 transition-colors">
                    <span className="text-2xl font-black font-heading text-[var(--accent-solid)] italic">0{idx + 1}</span>
                  </div>
                  <p className="text-[var(--text-primary)] font-bold text-sm leading-relaxed">
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===================== RELATED PRODUCTS ===================== */}
      <section className="relative py-24 md:py-40 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--accent-solid)]/5 blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border border-[var(--border-primary)] mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-solid)] animate-pulse"></span>
              <span className="text-[var(--accent-solid)] font-black text-[9px] tracking-[0.4em] uppercase">EXPLORE_MORE</span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-heading text-[var(--text-primary)] uppercase italic tracking-tighter">
              Other<br />
              <span className="text-gradient not-italic">Controllers.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {relatedProducts.map(rp => (
              <div 
                key={rp.id}
                className="group relative glass rounded-[2.5rem] p-2 border border-[var(--border-secondary)] hover:border-[var(--accent-solid)]/30 transition-all cursor-pointer"
                onClick={() => {
                  onSelectProduct(rp);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="absolute -inset-2 bg-[var(--accent-solid)]/0 group-hover:bg-[var(--accent-solid)]/5 rounded-[3rem] blur-2xl transition-all duration-500"></div>
                <div className="relative rounded-[2.2rem] overflow-hidden bg-slate-900 aspect-square">
                  <img 
                    src={rp.image} 
                    alt={rp.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Corner frames */}
                  <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[var(--accent-solid)]/0 group-hover:border-[var(--accent-solid)]/50 transition-all rounded-tl-xl"></div>
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[var(--accent-solid)]/0 group-hover:border-[var(--accent-solid)]/50 transition-all rounded-br-xl"></div>

                  {/* Product Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="text-[var(--accent-solid)] text-[9px] font-black uppercase tracking-[0.4em] mb-3 block">{rp.category}</span>
                    <h3 className="text-2xl md:text-3xl font-black font-heading text-white uppercase italic tracking-tight mb-2">{rp.name}</h3>
                    <p className="text-white/60 text-sm font-light mb-4">{rp.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black font-heading text-[var(--accent-solid)] italic">₹{rp.price}</span>
                      <span className="interactive text-[9px] font-black uppercase tracking-[0.3em] text-white/80 group-hover:text-[var(--accent-solid)] transition-colors flex items-center gap-2">
                        View Details <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProductDetails;
