import React from 'react';

interface CustomCursorProps {
  isHovering: boolean;
  position: { x: number; y: number };
}

const CustomCursor: React.FC<CustomCursorProps> = ({ isHovering, position }) => {
  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1 : 0})`,
        opacity: isHovering ? 1 : 0,
        transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div className="w-8 h-8 rounded-full bg-[#00f3ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.6)]">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: 'rotate(-45deg)' }}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </div>
  );
};

export default CustomCursor;
