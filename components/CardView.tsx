
import React from 'react';
import { Neighbourhood } from '../types';
import NeighbourhoodCell from './NeighbourhoodCell';

interface Props {
  neighbourhoods: Neighbourhood[];
  onSelect: (n: Neighbourhood) => void;
  selectedId?: string;
}

/**
 * CardView provides a mobile-optimized vertical list of neighbourhood cells.
 * Sort toolbar is now managed by the parent header in App.tsx.
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
    <div className="flex flex-col gap-6 pb-20 mt-4">
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
  );
};

export default CardView;
