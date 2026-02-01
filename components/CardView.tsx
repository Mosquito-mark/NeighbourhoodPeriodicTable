
import React from 'react';
import { Neighbourhood } from '../types';
import { SortConfig, SortKey } from '../App';
import NeighbourhoodCell from './NeighbourhoodCell';

interface Props {
  neighbourhoods: Neighbourhood[];
  onSelect: (n: Neighbourhood) => void;
  selectedId?: string;
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
}

/**
 * CardView provides a mobile-optimized vertical list of neighbourhood cells.
 * Features a custom SortToolbar for mirroring the List View filtering logic.
 */
const CardView: React.FC<Props> = ({ neighbourhoods, onSelect, selectedId, sortConfig, onSort }) => {
  if (neighbourhoods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-40"></i>
        <p className="text-base font-black uppercase tracking-widest">No matching results</p>
      </div>
    );
  }

  const SortBtn = ({ label, sortKey }: { label: string, sortKey: SortKey }) => (
    <button 
      onClick={() => onSort(sortKey)}
      className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap
        ${sortConfig.key === sortKey 
          ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
        }
      `}
    >
      {label} {sortConfig.key === sortKey && (
        <i className={`fa-solid ${sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down'} ml-1`}></i>
      )}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile Sort Toolbar */}
      <div className="sticky top-[100px] z-30 -mx-4 px-4 py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          <SortBtn label="Name" sortKey="name" />
          <SortBtn label="Ward" sortKey="ward" />
          <SortBtn label="Income" sortKey="medianIncome" />
          <SortBtn label="Price" sortKey="medianHomePrice" />
          <SortBtn label="Afford" sortKey="affordabilityRatio" />
          <SortBtn label="Green" sortKey="sustainableModePct" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {neighbourhoods.map((n) => (
          <div key={n.id} className="relative group">
            <NeighbourhoodCell 
              neighbourhood={n} 
              onClick={onSelect} 
              isSelected={selectedId === n.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardView;
