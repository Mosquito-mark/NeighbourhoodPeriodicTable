
import React from 'react';
import { SortConfig, SortKey } from '../App';

interface Props {
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
}

/**
 * SortToolbar component
 * Provides a horizontal scrolling set of sorting buttons for mobile views.
 */
const SortToolbar: React.FC<Props> = ({ sortConfig, onSort }) => {
  const SortBtn = ({ label, sortKey }: { label: string, sortKey: SortKey }) => (
    <button 
      onClick={() => onSort(sortKey)}
      className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap
        ${sortConfig.key === sortKey 
          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
          : 'bg-slate-700 border-slate-600 text-slate-300 hover:text-white'
        }
      `}
    >
      {label} {sortConfig.key === sortKey && (
        <i className={`fa-solid ${sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down'} ml-1`}></i>
      )}
    </button>
  );

  return (
    <div className="w-full pt-2 border-t border-slate-800/50 mt-2 md:hidden">
      <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar -mx-4 px-4">
        <SortBtn label="Name" sortKey="name" />
        <SortBtn label="Ward" sortKey="ward" />
        <SortBtn label="Income" sortKey="medianIncome" />
        <SortBtn label="Price" sortKey="medianHomePrice" />
        <SortBtn label="Afford" sortKey="affordabilityRatio" />
        <SortBtn label="Green" sortKey="sustainableModePct" />
      </div>
    </div>
  );
};

export default SortToolbar;
