
import React, { useState, useRef, useEffect } from 'react';

interface Props {
  wards: string[];
  selectedWard: string | null;
  onWardSelect: (ward: string | null) => void;
}

/**
 * WardFilter Component
 * A custom dropdown menu for selecting administrative wards.
 * Replaces the horizontal scroll for better space efficiency and mobile ergonomics.
 */
const WardFilter: React.FC<Props> = ({ wards, selectedWard, onWardSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (wards.length === 0) return null;

  const handleSelect = (ward: string | null) => {
    onWardSelect(ward);
    setIsOpen(false);
  };

  return (
    <div className="w-full bg-slate-900/80 border-b border-slate-800/50 py-3 px-4 md:px-6 backdrop-blur-md sticky top-[88px] md:top-[104px] z-30">
      <div className="max-w-[1800px] mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400 whitespace-nowrap">
          <i className="fa-solid fa-map-location-dot text-[12px] text-blue-400"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">Administrative District:</span>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-between gap-4 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border min-w-[220px] shadow-lg ${
              selectedWard 
                ? 'bg-blue-600 border-blue-500 text-white shadow-blue-900/40' 
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span>{selectedWard || 'All Wards'}</span>
            <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-[260px] bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                <button
                  onClick={() => handleSelect(null)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                    selectedWard === null 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-globe mr-2 opacity-50"></i>
                  All Wards (City-Wide)
                </button>
                
                <div className="h-px bg-slate-800 my-2 mx-2"></div>
                
                {wards.map(ward => (
                  <button
                    key={ward}
                    onClick={() => handleSelect(ward)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between ${
                      selectedWard === ward 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{ward}</span>
                    {selectedWard === ward && <i className="fa-solid fa-check text-[10px]"></i>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedWard && (
          <button 
            onClick={() => handleSelect(null)}
            className="text-[10px] font-black text-slate-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
          >
            <i className="fa-solid fa-circle-xmark"></i>
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default WardFilter;
