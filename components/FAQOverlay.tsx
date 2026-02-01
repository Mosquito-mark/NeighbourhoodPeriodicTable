
import React, { useEffect } from 'react';
import NeighbourhoodCell from './NeighbourhoodCell';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FAQOverlay: React.FC<Props> = ({ isOpen, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  // Mock data for the legend example
  const legendExample = {
    id: 'legend-item',
    ward: 'Ward Name',
    name: 'Neighbourhood',
    type: 'Residential',
    population: 5000,
    households: 2100,
    medianIncome: 95000,
    medianHomePrice: 450000,
    sustainableModePct: 45,
    affordabilityRatio: 4.7,
    symbol: 'Ex',
    row: 0,
    col: 0
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-full overflow-y-auto rounded-3xl shadow-2xl custom-scrollbar">
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">How to Read the Grid</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">A Guide to the Periodic Table of Edmonton</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-8 space-y-12">
          {/* Section 1: The Periodic Logic */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h3 className="text-xl font-black text-blue-400 uppercase tracking-tight">The Grid Logic</h3>
              <p className="text-slate-300 leading-relaxed font-medium">
                Neighbourhoods aren't placed randomly. Like the chemical elements, their position tells a story:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-indigo-400">
                    <i className="fa-solid fa-arrows-up-down"></i>
                  </div>
                  <div>
                    <span className="text-white font-bold block">Vertical (Rows): Affordability</span>
                    <span className="text-slate-400 text-sm">Top rows are the most affordable (Lowest HHI/Home Price ratio). Bottom rows represent higher relative costs.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-400">
                    <i className="fa-solid fa-arrows-left-right"></i>
                  </div>
                  <div>
                    <span className="text-white font-bold block">Horizontal (Cols): Sustainability</span>
                    <span className="text-slate-400 text-sm">Left columns have low active transit usage. Far right columns represent "15-minute" areas with high walking and cycling rates.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center">
              <div className="w-48 h-10 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 rounded-full mb-4"></div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Color Legend (Sustainable Mode %)</span>
              <div className="flex justify-between w-full px-2 mt-2 text-[10px] font-bold text-slate-500 uppercase">
                <span>0% - Driving</span>
                <span>100% - Active</span>
              </div>
            </div>
          </section>

          {/* Section 2: Anatomy of a Cell */}
          <section className="space-y-6 pt-6 border-t border-slate-800">
            <h3 className="text-xl font-black text-blue-400 uppercase tracking-tight">Anatomy of a Cell</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center">
                <div className="w-56 shadow-2xl pointer-events-none">
                  <NeighbourhoodCell neighbourhood={legendExample} onClick={() => {}} isSelected={false} isStatic />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300 text-sm"><strong className="text-white">Top Right:</strong> Population (Top) and Total Households (Bottom)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300 text-sm"><strong className="text-white">Large Letter:</strong> Ward Symbol (e.g., Od = O-day'min)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300 text-sm"><strong className="text-white">Center Text:</strong> Neighbourhood Name & Ward Name</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300 text-sm"><strong className="text-white">Bottom Left:</strong> Affordability Ratio (Median Income / Median Home Price)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300 text-sm"><strong className="text-white">Bottom Right:</strong> Median Income (Top) and Home Price (Bottom) in Thousands</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Interaction */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30">
              <i className="fa-solid fa-hand-pointer text-blue-400 text-xl mb-3"></i>
              <h4 className="text-white font-bold mb-2">Detailed View</h4>
              <p className="text-slate-400 text-sm">Click any cell to open a side panel with AI-powered demographic analysis and investment verdicts.</p>
            </div>
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30">
              <i className="fa-solid fa-magnifying-glass-plus text-blue-400 text-xl mb-3"></i>
              <h4 className="text-white font-bold mb-2">Zoom & Navigate</h4>
              <p className="text-slate-400 text-sm">Use CTRL + Scroll to zoom the grid. On mobile, use pinch-to-zoom gestures.</p>
            </div>
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30">
              <i className="fa-solid fa-list text-blue-400 text-xl mb-3"></i>
              <h4 className="text-white font-bold mb-2">Switch Views</h4>
              <p className="text-slate-400 text-sm">Switch between Grid, List (sortable table), and Cards (mobile focus) in the header.</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-full transition-all shadow-lg shadow-blue-900/40"
          >
            Got it, Let's Explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQOverlay;
