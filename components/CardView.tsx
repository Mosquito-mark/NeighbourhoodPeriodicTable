
import React from 'react';
import { Neighbourhood } from '../types';
import NeighbourhoodCell from './NeighbourhoodCell';

interface Props {
  neighbourhoods: Neighbourhood[];
  onSelect: (n: Neighbourhood) => void;
  selectedId?: string;
  aggregateStats?: {
    avgIncome: number;
    avgPrice: number;
    totalPop: number;
    totalHouseholds: number;
  };
}

/**
 * CardView provides a mobile-optimized view of neighbourhood cells.
 * Configured specifically to show cards at 45% width on mobile, 
 * creating a clean 2-column layout with consistent gutters.
 */
const CardView: React.FC<Props> = ({ neighbourhoods, onSelect, selectedId, aggregateStats }) => {
  if (neighbourhoods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-40"></i>
        <p className="text-base font-black uppercase tracking-widest">No matching results</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 landscape:grid-cols-4 gap-4 md:grid-cols-4 md:gap-6 pb-24 mt-2">
      {aggregateStats && (
        <div className="col-span-2 landscape:col-span-4 md:col-span-4 w-full h-[21.375vw] max-h-[100px] min-h-[70px] bg-slate-800 rounded-xl border border-slate-700 px-4 flex justify-between items-center shadow-md mb-2">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Avg Income</span>
            <span className="text-sm font-bold text-emerald-400">${Math.round(aggregateStats.avgIncome).toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Avg Price</span>
            <span className="text-sm font-bold text-blue-400">${Math.round(aggregateStats.avgPrice).toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Total Pop</span>
            <span className="text-sm font-bold text-white">{aggregateStats.totalPop.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Households</span>
            <span className="text-sm font-bold text-purple-400">{aggregateStats.totalHouseholds.toLocaleString()}</span>
          </div>
        </div>
      )}
      {neighbourhoods.map((n) => (
        <div key={n.id} className="w-full relative">
          <NeighbourhoodCell 
            neighbourhood={n} 
            onClick={onSelect} 
            isSelected={selectedId === n.id}
          />
        </div>
      ))}
    </div>
  );
};

export default CardView;
