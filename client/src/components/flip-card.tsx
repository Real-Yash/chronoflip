import { useState, useEffect } from "react";

interface FlipCardProps {
  value: string;
  size: 'small' | 'large';
}

export default function FlipCard({ value, size }: FlipCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      
      // Update the display value halfway through the flip animation
      setTimeout(() => {
        setDisplayValue(value);
      }, 200);
      
      // Remove flip animation class
      setTimeout(() => {
        setIsFlipping(false);
      }, 400);
    }
  }, [value, displayValue]);

  const sizeClasses = {
    large: "text-6xl md:text-8xl lg:text-9xl w-28 h-36 md:w-36 md:h-44 lg:w-40 lg:h-48",
    small: "text-3xl md:text-5xl lg:text-6xl w-18 h-24 md:w-24 md:h-28 lg:w-28 lg:h-32"
  };

  return (
    <div className="flip-container" style={{ perspective: '1000px' }}>
      <div 
        className={`flip-digit border border-white/20 rounded-2xl flex items-center justify-center font-mono font-semibold text-white/90 ${sizeClasses[size]} ${
          isFlipping ? 'flip-animation' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          backgroundColor: '#29292e',
          boxShadow: 'inset 0 -2px 4px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <span className="select-none" style={{ 
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' 
        }}>
          {displayValue}
        </span>
      </div>
    </div>
  );
}
