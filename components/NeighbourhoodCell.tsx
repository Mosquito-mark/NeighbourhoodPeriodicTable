
import React, { useRef } from 'react';
import { Neighbourhood } from '../types';
import { COLOR_SCALE } from '../constants';

interface Props {
  neighbourhood: Neighbourhood;
  onClick: (n: Neighbourhood) => void;
  onHover?: (n: Neighbourhood | null, rect?: DOMRect) => void;
  isSelected: boolean;
  isStatic?: boolean;
}

/**
 * Calculates perceived brightness to determine if white or black text should be used.
 * Formula: (R * 0.2126 + G * 0.7152 + B * 0.0722)
 */
const getPerceivedLuminance = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
};

const NeighbourhoodCell: React.FC<Props> = ({ 
  neighbourhood, 
  onClick, 
  onHover, 
  isSelected,
  isStatic = false 
}) => {
  const cellRef = useRef<HTMLButtonElement>(null);

  const getColor = (pct: number) => {
    const index = Math.min(Math.floor((pct / 100) * COLOR_SCALE.length), COLOR_SCALE.length - 1);
    return COLOR_SCALE[index];
  };

  const bgColor = getColor(neighbourhood.sustainableModePct);
  const luminance = getPerceivedLuminance(bgColor);
  const isLightBackground = luminance > 0.5;
  const textColor = isLightBackground ? 'text-slate-950' : 'text-white';
  const mutedTextColor = isLightBackground ? 'text-slate-900/70' : 'text-white/70';

  const containerClasses = `
    relative w-full aspect-[1/1.25] p-[8%] border border-slate-700/40 
    transition-all duration-200 ease-out flex flex-col items-stretch
    will-change-transform transform-gpu group
    [container-type:inline-size]
    ${isStatic ? 'cursor-default pointer-events-none' : 'cursor-pointer hover:border-white/60 hover:z-30 hover:shadow-2xl'}
    ${isSelected ? 'ring-4 ring-blue-400 z-10 scale-105 shadow-2xl' : ''}
  `;

  const handleMouseEnter = () => {
    if (!isStatic && onHover && cellRef.current) {
      onHover(neighbourhood, cellRef.current.getBoundingClientRect());
    }
  };

  return (
    <button
      ref={cellRef}
      onClick={() => !isStatic && onClick(neighbourhood)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => !isStatic && onHover?.(null)}
      className={containerClasses}
      style={{ backgroundColor: bgColor }}
      aria-label={`${neighbourhood.name} neighbourhood details`}
      disabled={isStatic}
    >
      {/* 1. Header Row: Population Metrics */}
      <div className={`flex justify-end items-start text-[8.5cqw] font-black ${textColor} uppercase tracking-tight leading-none h-[15%]`}>
        <div className="text-right flex flex-col items-end">
          <span className="whitespace-nowrap">Pop: {neighbourhood.population.toLocaleString()}</span>
          <span className="whitespace-nowrap">HH: {neighbourhood.households.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. Middle Block: Symbol and Name */}
      <div className="flex-1 flex flex-col justify-center py-[4%]">
        <div className={`text-[30cqw] font-black ${textColor} leading-none tracking-tighter text-left mb-[1%]`}>
          {neighbourhood.symbol}
        </div>
        
        {/* Full Ward Name - Revealed on Rollover */}
        <div className={`text-[7.5cqw] font-bold ${mutedTextColor} uppercase tracking-widest text-left mb-[4%] transition-opacity duration-300 ease-out ${isStatic ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {neighbourhood.ward}
        </div>

        <div className={`text-[11cqw] font-black ${textColor} leading-[1.1] line-clamp-2 uppercase tracking-tighter text-left`}>
          {neighbourhood.name}
        </div>
      </div>

      {/* 3. Footer Block: Affordability and Pricing */}
      <div className="mt-auto pt-[4%] border-t border-current/10 flex items-end justify-between">
        <div className="flex flex-col items-start">
          <span className={`text-[18cqw] font-black ${textColor} leading-none`}>
            {neighbourhood.affordabilityRatio.toFixed(1)}
          </span>
          <span className={`text-[7cqw] ${mutedTextColor} font-black uppercase tracking-widest`}>Ratio</span>
        </div>
        <div className="flex flex-col text-right leading-[1.1]">
          <span className={`text-[11cqw] ${textColor} font-bold whitespace-nowrap`}>
            HHI: ${Math.round(neighbourhood.medianIncome / 1000)}K
          </span>
          <span className={`text-[11cqw] ${textColor} font-bold whitespace-nowrap`}>
            HP: ${Math.round(neighbourhood.medianHomePrice / 1000)}K
          </span>
        </div>
      </div>

      {/* Selection Indicator Dot */}
      {isSelected && (
        <div className="absolute -top-[5%] -right-[5%] w-[15cqw] h-[15cqw] bg-blue-500 rounded-full border-[2cqw] border-slate-950 shadow-lg z-[60]"></div>
      )}
    </button>
  );
};

export default NeighbourhoodCell;
