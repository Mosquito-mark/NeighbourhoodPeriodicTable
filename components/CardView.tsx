
import React from 'react';
import { Neighbourhood } from '../types';
import NeighbourhoodCell from './NeighbourhoodCell';

interface Props {
  neighbourhoods: Neighbourhood[];
  onSelect: (n: Neighbourhood) => void;
  selectedId?: string;
}

/**
 * CardView provides a mobile-optimized view of neighbourhood cells.
 * Configured specifically to show cards at 45% width on mobile, 
 * creating a clean 2-column layout with consistent gutters.
 */
const CardView: React.FC<Props> = ({ neighbourhoods, onSelect, selectedId }) => {
  if (neighbourhoods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-40"></i>
        <p className="text-base font-black uppercase tracking-widest">No matching results</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-between gap-y-6 md:grid md:grid-cols-3 md:gap-6 pb-24 mt-2 px-[2.5%]">
      {neighbourhoods.map((n) => (
        <div key={n.id} className="w-[47.5%] md:w-auto relative">
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
