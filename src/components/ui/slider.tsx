'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  className?: string;
}

const Slider = ({ min, max, step = 0.1, value, onValueChange, className }: SliderProps) => {
  const [minVal, maxVal] = value;
  const range = max - min;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxVal - step);
    onValueChange([newMin, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minVal + step);
    onValueChange([minVal, newMax]);
  };

  const minPercent = ((minVal - min) / range) * 100;
  const maxPercent = ((maxVal - min) / range) * 100;

  return (
    <div className={cn('relative w-full h-6', className)}>
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full bg-muted">
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        style={{ pointerEvents: 'auto' }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        style={{ pointerEvents: 'auto' }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-md"
        style={{ left: `calc(${minPercent}% - 8px)` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-md"
        style={{ left: `calc(${maxPercent}% - 8px)` }}
      />
    </div>
  );
};

export { Slider };
