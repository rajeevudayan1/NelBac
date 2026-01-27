import React, { useState } from 'react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="card-3d group relative flex flex-col h-full bg-[var(--text-primary)]/5 border border-[var(--border-secondary)] rounded-[2.5rem] p-1.5 transition-all hover:border-[#00f3ff]/40 hover:bg-[var(--text-primary)]/10">
      {/* Immersive Visual Container */}
      <div className="relative aspect-square rounded-[2.2rem] overflow-hidden bg-slate-900">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-all duration-[1s] group-hover:scale-110 grayscale group-hover:grayscale-0 ${product.video && !videoError ? 'group-hover:opacity-0' : 'opacity-60 group-hover:opacity-100'}`}
        />
        
        {product.video && !videoError && (
          <video 
            src={product.video} 
            autoPlay 
            loop 
            muted 
            playsInline 
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000 scale-110"
          />
        )}
        
        {/* AR UI Elements */}
        <div className="absolute inset-0 border border-white/5 rounded-[2.2rem]"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00f3ff]/0 group-hover:border-[#00f3ff]/50 transition-all rounded-tl-[2rem] m-6"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00f3ff]/0 group-hover:border-[#00f3ff]/50 transition-all rounded-br-[2rem] m-6"></div>
        
        <div className="absolute top-6 left-6 px-4 py-1.5 glass border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-[var(--overlay-text)]">
          {product.category}
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-[var(--text-primary)] font-heading leading-tight uppercase italic">{product.name}</h3>
          <div className="text-xl font-black text-[var(--accent-solid)] tracking-tighter">${product.price}</div>
        </div>
        
        <p className="text-[var(--text-secondary)] text-sm font-light mb-10 leading-relaxed min-h-[48px]">
          {product.tagline}
        </p>

        {/* Feature Matrix */}
        <div className="grid grid-cols-2 gap-6 mb-10 border-t border-[var(--border-secondary)] pt-8">
          {product.features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-[0.2em]">Parameter {i+1}</span>
              <span className="text-[10px] text-[var(--text-primary)] font-bold uppercase truncate">{feature}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onAddToCart(product)}
          className="mt-auto group relative w-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-black py-5 rounded-2xl transition-all hover:bg-[#00f3ff] hover:text-black flex items-center justify-center gap-4 uppercase text-[10px] tracking-[0.4em] shadow-xl overflow-hidden active:scale-95"
        >
          <span className="relative z-10">Add to Queue</span>
          <div className="absolute inset-0 bg-[#00f3ff] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
