import React, { useState, useEffect } from 'react';
import logo from '@/assets/images/nelbac-logo-white.png';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Animation timeline
    const stage1 = setTimeout(() => setAnimationStage(1), 100);  // Logo appears
    const stage2 = setTimeout(() => setAnimationStage(2), 800);  // Glow pulse
    const stage3 = setTimeout(() => setAnimationStage(3), 1800); // Start fade out
    const complete = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 500);
    }, 2300);

    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
      clearTimeout(complete);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#01040a] transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Radial glow background */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          animationStage >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 243, 255, 0.08) 0%, transparent 50%)',
        }}
      />
      
      {/* Logo container */}
      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <img
          src={logo}
          alt="Nelbac"
          className={`h-12 md:h-16 w-auto transition-all duration-700 ease-out ${
            animationStage >= 1 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-75 translate-y-4'
          }`}
          style={{
            filter: animationStage >= 2 
              ? 'drop-shadow(0 0 20px rgba(0, 243, 255, 0.5))' 
              : 'none',
            transition: 'filter 0.5s ease-out, opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        
        {/* Animated line */}
        <div className="relative mt-6 h-[2px] w-24 overflow-hidden">
          <div 
            className={`absolute inset-y-0 left-0 bg-[#00f3ff] transition-all duration-700 ease-out ${
              animationStage >= 2 ? 'w-full' : 'w-0'
            }`}
            style={{
              boxShadow: '0 0 10px rgba(0, 243, 255, 0.8)',
            }}
          />
        </div>
        
        {/* Tagline */}
        <p 
          className={`mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#00f3ff]/70 transition-all duration-500 ${
            animationStage >= 2 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2'
          }`}
        >
          Automate Anything
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
