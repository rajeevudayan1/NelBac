import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { VisionSection } from '@/types';

interface VisionOrbitProps {
  visionSections: VisionSection[];
}

const VisionOrbit: React.FC<VisionOrbitProps> = ({ visionSections }) => {
  const [activeVisionIdx, setActiveVisionIdx] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800 
  });
  
  // Use ref for rotation to avoid re-renders on every frame
  const rotationRef = useRef(0);
  const [, forceUpdate] = useState(0);

  // Icon mapping for vision sections - memoized
  const iconMap = useMemo<Record<string, string>>(() => ({
    'Get productive.': 'fa-person-digging',
    'Always reliable.': 'fa-shield-heart',
    'Stay efficient.': 'fa-droplet',
    'Be on the go.': 'fa-cloud',
    'Resource Efficient.': 'fa-leaf',
    'Analyse data.': 'fa-chart-line',
    'Be flexible.': 'fa-layer-group',
  }), []);

  // Short labels for vision sections - memoized
  const shortLabelMap = useMemo<Record<string, string>>(() => ({
    'Get productive.': 'Productive',
    'Always reliable.': 'Reliable',
    'Stay efficient.': 'Efficient',
    'Be on the go.': 'Connected',
    'Resource Efficient.': 'Conserve',
    'Analyse data.': 'Analytics',
    'Be flexible.': 'Flexible',
  }), []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reduce bubbles from 15 to 8
  const bgBubbles = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    size: `${5 + Math.random() * 15}px`,
    duration: `${15 + Math.random() * 20}s`
  })), []);

  const setRotation = useCallback((value: number | ((prev: number) => number)) => {
    if (typeof value === 'function') {
      rotationRef.current = value(rotationRef.current);
    } else {
      rotationRef.current = value;
    }
    forceUpdate(n => n + 1);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    const targetFPS = 30; // Reduce from 60 to 30 FPS
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= frameInterval) {
        const currentSection = visionSections[activeVisionIdx];
        const currentlyFocusedId = currentSection?.title;
        const isHighlightedHovered = hoveredId !== null && hoveredId === currentlyFocusedId;

        if (!isHighlightedHovered) {
          rotationRef.current = (rotationRef.current + 0.15) % 360;
          
          // Only update activeVisionIdx when needed
          const step = 360 / visionSections.length;
          const normalizedRot = rotationRef.current % 360;
          const closestIdx = Math.round((180 - normalizedRot + 360) % 360 / step) % visionSections.length;
          if (closestIdx !== activeVisionIdx) {
            setActiveVisionIdx(closestIdx);
          }
          
          forceUpdate(n => n + 1);
        }
        lastTime = currentTime - (deltaTime % frameInterval);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredId, activeVisionIdx, visionSections]);

  // Responsive Scaling Logic optimized for 100vh containment
  const responsiveScale = Math.min(windowSize.width / 1440, windowSize.height / 1000, 1.1);
  const hubSize = Math.max(80, 140 * responsiveScale);
  const bubbleSizeBase = Math.max(60, 110 * responsiveScale);
  const radiusX = windowSize.width > 768 ? 420 * responsiveScale : 140 * responsiveScale;
  const radiusY = windowSize.width > 768 ? 130 * responsiveScale : 180 * responsiveScale;

  return (
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
      <div className="text-center pt-24 md:pt-28 pb-4 relative z-20 px-6 shrink-0 transition-all">
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
              transform: `rotate(${rotationRef.current * 3}deg)` 
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
                   transform: `translate(-50%, -100%) rotate(${rotationRef.current + i * (360/visionSections.length)}deg)`,
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
            const angle = (i * step + rotationRef.current) % 360;
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

            const icon = iconMap[v.title] || 'fa-circle';
            const shortLabel = shortLabelMap[v.title] || v.accent;

            // Dynamic sizing - morph tied to scale factor for smooth zoom transition
            const morphProgress = Math.min(1, scaleFactor * 2); // 0 to 1 based on zoom
            const currentWidth = bubbleSizeBase + (bubbleSizeBase * 0.8 * morphProgress); // Grows from 1x to 1.8x
            // Use pixel-based radius: circle (50% of height) to rounded rectangle (12px)
            const circleRadius = bubbleSizeBase / 2; // Perfect circle when not expanded
            const currentBorderRadius = circleRadius - (morphProgress * (circleRadius - 12)); // From circle to 12px rounded corners
            const isExpanded = morphProgress > 0.3;

            return (
              <div 
                key={v.title}
                className="absolute cursor-pointer interactive"
                style={{ 
                  transform: `translate(${x}px, ${y}px) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  transition: 'transform 0.05s linear, opacity 0.2s ease-out'
                }}
                onMouseEnter={() => setHoveredId(v.title)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  setRotation((180 - i * step + 360) % 360);
                }}
              >
                <div 
                  className={`relative overflow-hidden ${isExpanded ? 'shadow-[0_0_40px_rgba(0,243,255,0.5)]' : ''}`}
                  style={{ 
                    width: currentWidth, 
                    height: bubbleSizeBase,
                    borderRadius: `${currentBorderRadius}px`,
                    border: isExpanded ? '0.5px solid rgba(0,243,255,0.8)' : '0.5px solid rgba(255,255,255,0.15)',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  {/* Background Image */}
                  <img 
                    src={v.image} 
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ 
                      filter: isExpanded ? 'grayscale(0) brightness(0.5)' : 'grayscale(1) blur(1px)',
                      opacity: isExpanded ? 1 : 0.5,
                      transform: isExpanded ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.4s ease'
                    }}
                    alt="" 
                  />
                  
                  {/* Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"
                    style={{ opacity: isExpanded ? 1 : 0.4, transition: 'opacity 0.4s ease' }}
                  ></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    {/* Circle state - Icon & Label centered */}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      style={{ 
                        opacity: 1 - morphProgress,
                        transform: `scale(${1 - morphProgress * 0.25})`,
                        transition: 'opacity 0.2s ease, transform 0.2s ease'
                      }}
                    >
                      <i className={`fas ${icon} text-white/70`} style={{ fontSize: `${18 * responsiveScale}px` }}></i>
                      <span className="mt-1 font-black uppercase tracking-wider text-white/60" style={{ fontSize: `${Math.max(6, 7 * responsiveScale)}px` }}>{shortLabel}</span>
                    </div>

                    {/* Expanded state - Full content */}
                    <div 
                      className="absolute inset-0 flex items-center gap-2 px-3"
                      style={{ 
                        opacity: morphProgress,
                        transform: `scale(${0.9 + morphProgress * 0.1})`,
                        transition: 'opacity 0.2s ease, transform 0.2s ease'
                      }}
                    >
                      {/* Icon */}
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-[var(--accent-solid)]/20 border border-[var(--accent-solid)]/40 flex items-center justify-center">
                        <i className={`fas ${icon} text-[var(--accent-solid)]`} style={{ fontSize: `${12 * responsiveScale}px` }}></i>
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black uppercase text-white tracking-wide leading-none truncate" style={{ fontSize: `${Math.max(8, 9 * responsiveScale)}px` }}>
                          {v.title}
                        </h3>
                        <p className="text-white/70 leading-snug mt-0.5" style={{ fontSize: `${Math.max(5, 6 * responsiveScale)}px` }}>
                          {v.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VERTICAL NAVIGATION COLUMN - LEFT SIDE */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
          {visionSections.map((v, i) => {
            const isActive = activeVisionIdx === i;
            const step = 360 / visionSections.length;
            const icon = iconMap[v.title] || 'fa-circle';
            
            return (
              <button
                key={v.title}
                onClick={() => setRotation((180 - i * step + 360) % 360)}
                className={`group relative flex items-center gap-3 transition-all duration-300 cursor-pointer interactive`}
              >
                {/* Icon Button */}
                <div 
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-[var(--accent-solid)]/20 border-2 border-[var(--accent-solid)] shadow-[0_0_20px_rgba(0,243,255,0.4)]' 
                      : 'bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20'
                  }`}
                >
                  <i className={`fas ${icon} transition-all duration-300 ${
                    isActive 
                      ? 'text-[var(--accent-solid)]' 
                      : 'text-white/40 group-hover:text-white/70'
                  }`} style={{ fontSize: `${Math.max(14, 16 * responsiveScale)}px` }}></i>
                </div>
                
                {/* Label - visible on hover or when active */}
                <span 
                  className={`absolute left-full ml-3 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    isActive 
                      ? 'text-[var(--accent-solid)] opacity-100 translate-x-0' 
                      : 'text-white/60 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                  style={{ fontSize: `${Math.max(11, 12 * responsiveScale)}px` }}
                >
                  {v.accent || shortLabelMap[v.title]}
                </span>
                
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent-solid)] rounded-r-full shadow-[0_0_10px_#00f3ff]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VisionOrbit;
