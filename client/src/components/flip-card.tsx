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
      }, 300);
      
      // Remove flip animation class
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  }, [value, displayValue]);

  const sizeClasses = {
    large: "text-8xl md:text-9xl lg:text-[12rem] p-8",
    small: "text-4xl md:text-5xl lg:text-6xl p-4"
  };

  const cardSizeClasses = {
    large: "rounded-2xl",
    small: "rounded-xl ml-4"
  };

  return (
    <div className={`flip-card ${isFlipping ? 'flip-animation' : ''}`}>
      <div 
        className={`control-shadow border border-gray-800 ${cardSizeClasses[size]}`}
        style={{ backgroundColor: 'var(--card-dark)' }}
      >
        <div className={`font-light time-shadow tracking-tight ${sizeClasses[size]}`}>
          {displayValue}
        </div>
      </div>
    </div>
  );
}
