
import React from 'react';
import { Neighbourhood } from '../types';
import { COLOR_SCALE } from '../constants';
import { SortConfig, SortKey } from '../App';

interface Props {
  neighbourhoods: Neighbourhood[];
  onSelect: (n: Neighbourhood) => void;
  selectedId?: string;
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
}

const getPerceivedLuminance = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
};

const getBgColor = (pct: number) => {
  const index = Math.min(Math.floor((pct / 100) * COLOR_SCALE.length), COLOR_SCALE.length - 1);
  return COLOR_SCALE[index];
};

/**
 * ListView component
 * Renders a data-rich table. The outer scroll container is handled by the parent
 * App component to enable consistent perimeter edge scrolling behavior.
 */
const ListView: React.FC<Props> = ({ neighbourhoods, onSelect, selectedId, sortConfig, onSort }) => {
  if (neighbourhoods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-40"></i>
        <p className="text-base font-black uppercase tracking-widest">No neighbourhoods found</p>
      </div>
    );
  }

  const SortHeader = ({ label, sortKey, align = 'left' }: { label: string, sortKey: SortKey, align?: 'left' | 'right' }) => (
    <th className={`px-6 py-4 text-base font-black text-slate-100 uppercase tracking-widest ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <button 
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-2 hover:text-blue-400 transition-colors group ${align === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {label}
        <span className="flex flex-col text-xs opacity-40 group-hover:opacity-100">
          <i className={`fa-solid fa-caret-up ${sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'text-blue-500 opacity-100' : ''}`}></i>
          <i className={`fa-solid fa-caret-down ${sortConfig.key === sortKey && sortConfig.direction === 'desc' ? 'text-blue-500 opacity-100' : ''}`}></i>
        </span>
      </button>
    </th>
  );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl overflow-hidden">
      <table className="w-full text-left border-collapse min-w-[1400px]">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-700">
            <SortHeader label="Sym" sortKey="symbol" />
            <SortHeader label="Neighbourhood" sortKey="name" />
            <SortHeader label="Ward" sortKey="ward" />
            <SortHeader label="Income" sortKey="medianIncome" align="right" />
            <SortHeader label="Home Price" sortKey="medianHomePrice" align="right" />
            <SortHeader label="Affordability" sortKey="affordabilityRatio" align="right" />
            <SortHeader label="Sustainable" sortKey="sustainableModePct" align="right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/20">
          {neighbourhoods.map((n) => {
            const rowColor = getBgColor(n.sustainableModePct);
            const luminance = getPerceivedLuminance(rowColor);
            const isLight = luminance > 0.5;
            const textColor = isLight ? 'text-slate-950' : 'text-white';
            const mutedColor = isLight ? 'text-slate-900/70' : 'text-slate-300';
            const isSelected = selectedId === n.id;

            return (
              <tr 
                key={n.id} onClick={() => onSelect(n)}
                style={{ backgroundColor: rowColor }}
                className={`group cursor-pointer transition-all duration-150 relative ${isSelected ? 'ring-inset ring-4 ring-blue-500 z-10' : 'hover:brightness-110'}`}
              >
                <td className="px-6 py-6">
                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded text-xl font-black border transition-colors ${isLight ? 'bg-white/30 border-black/10' : 'bg-black/20 border-white/10'} ${textColor}`}>
                    {n.symbol}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className={`text-base font-black uppercase tracking-tight ${textColor}`}>{n.name}</div>
                  <div className={`text-base font-bold uppercase tracking-wider ${mutedColor}`}>{n.type}</div>
                </td>
                <td className="px-6 py-6">
                  <span className={`text-base font-bold ${textColor}`}>{n.ward}</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className={`text-base font-mono font-bold ${textColor}`}>${n.medianIncome.toLocaleString()}</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className={`text-base font-mono font-bold ${textColor}`}>${n.medianHomePrice.toLocaleString()}</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className={`text-base font-black ${isLight ? (n.affordabilityRatio > 6 ? 'text-red-700' : 'text-emerald-800') : (n.affordabilityRatio > 6 ? 'text-red-300' : 'text-emerald-400')}`}>
                    {n.affordabilityRatio.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                     <div className={`w-24 h-3 rounded-full overflow-hidden border ${isLight ? 'bg-black/10 border-black/10' : 'bg-white/10 border-white/10'}`}>
                       <div className={`h-full ${isLight ? 'bg-slate-900' : 'bg-white'}`} style={{ width: `${n.sustainableModePct}%` }} />
                     </div>
                     <span className={`text-base font-black w-10 ${textColor}`}>{Math.round(n.sustainableModePct)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
