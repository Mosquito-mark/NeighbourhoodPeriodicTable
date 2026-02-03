
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { Neighbourhood } from './types';
import { fetchNeighbourhoods, parseNeighbourhoods } from './services/dataService';
import NeighbourhoodCell from './components/NeighbourhoodCell';
import ListView from './components/ListView';
import CardView from './components/CardView';
import AnalysisPanel from './components/AnalysisPanel';
import FAQOverlay from './components/FAQOverlay';
import SortToolbar from './components/SortToolbar';
import WardFilter from './components/WardFilter';
import { RAW_CSV_DATA } from './constants';

export type SortKey = 'name' | 'ward' | 'medianIncome' | 'medianHomePrice' | 'affordabilityRatio' | 'sustainableModePct' | 'symbol';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

/**
 * Main Application Component
 * Manages global state for neighborhood data, filtering, and view modes.
 */
const App: React.FC = () => {
  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [isCustomData, setIsCustomData] = useState(false);
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<Neighbourhood | null>(null);
  const [hoveredNeighbourhood, setHoveredNeighbourhood] = useState<Neighbourhood | null>(null);
  const [hoveredRect, setHoveredRect] = useState<{ top: number, left: number, width: number, height: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'cards'>('grid');
  const [zoom, setZoom] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  
  const mainScrollRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial Data Fetch
  useEffect(() => {
    const data = fetchNeighbourhoods();
    setNeighbourhoods(data);
    
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      setViewMode('cards');
    } else {
      setViewMode('grid');
    }
  }, []);

  // --- DERIVED STATE ---
  const uniqueWards = useMemo(() => {
    const rawWards = neighbourhoods.map(n => n.ward.replace(/'/g, '’'));
    const wards: string[] = Array.from(new Set(rawWards));
    return wards.sort((a, b) => a.localeCompare(b));
  }, [neighbourhoods]);

  const sortedNeighbourhoods = useMemo(() => {
    const filtered = neighbourhoods.filter(n => {
      const normalizedWard = n.ward.replace(/'/g, '’');
      const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            normalizedWard.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWard = !selectedWard || normalizedWard === selectedWard;
      return matchesSearch && matchesWard;
    });

    return [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [neighbourhoods, searchQuery, selectedWard, sortConfig]);

  // --- DATA UPLOAD LOGIC ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const parsed = parseNeighbourhoods(content);
        if (parsed.length > 0) {
          setNeighbourhoods(parsed);
          setIsCustomData(true);
          setSelectedWard(null);
          setUploadMessage(`Successfully loaded ${parsed.length} neighbourhoods.`);
          setTimeout(() => setUploadMessage(null), 5000);
        } else {
          alert("Invalid CSV format. Please ensure your columns match the template in the 'How to Read' section.");
        }
      } catch (err) {
        alert("Failed to parse file. Please use a valid CSV.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetData = () => {
    const data = parseNeighbourhoods(RAW_CSV_DATA);
    setNeighbourhoods(data);
    setIsCustomData(false);
    setSelectedWard(null);
    setUploadMessage("Restored Edmonton Default Dataset.");
    setTimeout(() => setUploadMessage(null), 3000);
  };

  // --- RESPONSIVE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && viewMode === 'cards') {
        setViewMode('grid');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  useLayoutEffect(() => {
    const handleFitToWidth = () => {
      if (viewMode === 'list') {
        const viewportWidth = window.innerWidth;
        const padding = 48;
        const contentWidth = 1400; 
        const availableWidth = viewportWidth - (padding * 2);
        if (availableWidth < contentWidth) {
          const fitZoom = availableWidth / contentWidth;
          setZoom(Math.max(fitZoom, 0.4));
        } else {
          setZoom(1);
        }
      } else if (viewMode === 'cards') {
        setZoom(1);
      }
    };
    handleFitToWidth();
    window.addEventListener('resize', handleFitToWidth);
    return () => window.removeEventListener('resize', handleFitToWidth);
  }, [viewMode]);

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if ((e.ctrlKey || e.metaKey) && viewMode !== 'cards') {
        e.preventDefault();
        const delta = -e.deltaY;
        const zoomSpeed = 0.005;
        setZoom(prev => Math.min(Math.max(prev + delta * zoomSpeed, 0.4), 2.5));
      }
    };
    const container = mainScrollRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, viewMode]);

  const grid: (Neighbourhood | null)[][] = Array.from({ length: 9 }, () => Array.from({ length: 21 }, () => null));
  const filteredMap = new Set(sortedNeighbourhoods.map(n => n.id));
  
  neighbourhoods.forEach(n => {
    if (filteredMap.has(n.id) && n.row >= 0 && n.row < 9 && n.col >= 0 && n.col < 21) {
      if (!grid[n.row][n.col]) grid[n.row][n.col] = n;
    }
  });

  const handleHover = (n: Neighbourhood | null, rect?: DOMRect) => {
    setHoveredNeighbourhood(n);
    if (n && rect) {
      setHoveredRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    } else {
      setHoveredRect(null);
    }
  };

  const availableModes = (['grid', 'list', 'cards'] as const).filter(mode => {
    if (!isMobile && mode === 'cards') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200 overflow-x-hidden">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".csv" 
        className="hidden" 
      />

      {/* Header */}
      <header className="p-4 md:p-6 bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center text-xl md:text-2xl font-black shadow-lg shadow-blue-900/50 text-white">
              {isCustomData ? 'Mu' : 'Ed'}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                {isCustomData ? 'Municipal Grid' : 'Periodic Edmonton'}
              </h1>
              <p className="text-slate-300 text-[10px] md:text-xs font-bold uppercase tracking-widest">Municipal Data-at-a-Glance</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 flex-1 justify-end">
            
            {/* Primary Action Buttons: Grouped on same line on mobile */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* How to Read moved to the LEFT */}
              <button 
                onClick={() => setIsFAQOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 text-slate-200 hover:text-white transition-all group"
              >
                <i className="fa-solid fa-circle-question text-blue-400 group-hover:scale-110 transition-transform"></i>
                <span className="text-[9px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">How to Read</span>
              </button>

              {isCustomData && (
                <button 
                  onClick={handleResetData}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 text-slate-400 hover:text-white transition-all group"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                  <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">Reset</span>
                </button>
              )}

              {/* Load Data moved to the RIGHT */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 rounded-full border border-emerald-500/50 text-emerald-400 hover:text-emerald-300 transition-all group"
              >
                <i className="fa-solid fa-file-csv text-base"></i>
                <span className="text-[9px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">Load Data</span>
              </button>
            </div>

            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 w-full md:w-auto">
              {availableModes.map(mode => (
                <button 
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:text-slate-100'}`}
                >
                  {mode === 'cards' ? 'Cards' : mode === 'grid' ? 'Grid' : 'List'}
                </button>
              ))}
            </div>

            <div className="relative group w-full md:w-80">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="text" placeholder="Search..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-11 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {viewMode === 'cards' && <SortToolbar sortConfig={sortConfig} onSort={handleSort} />}
          </div>
        </div>
      </header>

      <WardFilter 
        wards={uniqueWards} 
        selectedWard={selectedWard} 
        onWardSelect={setSelectedWard} 
      />

      {uploadMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl z-[60] font-black uppercase tracking-widest text-xs animate-in slide-in-from-top-4">
          <i className="fa-solid fa-check-circle mr-2"></i>
          {uploadMessage}
        </div>
      )}

      <main ref={mainScrollRef} className="flex-1 overflow-auto p-4 md:p-10 select-none scroll-smooth relative">
        <div 
          className={`max-w-max mx-auto relative transition-transform duration-150 ease-out transform-gpu ${viewMode === 'list' ? 'origin-top' : 'origin-top-left'}`}
          style={{ transform: viewMode === 'cards' ? 'none' : `scale(${zoom})` }}
        >
          {viewMode === 'grid' && (
            <div className={`periodic-grid min-w-[1600px] transition-all duration-500 ${hoveredNeighbourhood ? 'opacity-30 blur-[2px]' : ''}`}>
              {grid.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <div key={`${rIdx}-${cIdx}`} className="min-h-[140px] relative">
                      {cell ? (
                        <NeighbourhoodCell 
                          neighbourhood={cell} onClick={setSelectedNeighbourhood}
                          onHover={handleHover} isSelected={selectedNeighbourhood?.id === cell.id}
                        />
                      ) : <div className="w-full h-full border border-slate-900/20 rounded opacity-5"></div>}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="min-w-[1400px]">
              <ListView 
                neighbourhoods={sortedNeighbourhoods} 
                onSelect={setSelectedNeighbourhood}
                selectedId={selectedNeighbourhood?.id}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>
          )}

          {viewMode === 'cards' && (
            <div className="w-full max-w-[1000px] mx-auto">
              <CardView 
                neighbourhoods={sortedNeighbourhoods}
                onSelect={setSelectedNeighbourhood}
                selectedId={selectedNeighbourhood?.id}
              />
            </div>
          )}
        </div>
      </main>

      {hoveredNeighbourhood && hoveredRect && viewMode === 'grid' && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
           <div 
            className="shadow-[0_50px_100px_rgba(0,0,0,1)] border-4 border-white/30 transform-gpu overflow-hidden rounded-md"
            style={{ 
              width: '18vw', minWidth: '320px',
              animation: 'slide-to-center 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              '--source-x': `${hoveredRect.left}px`, '--source-y': `${hoveredRect.top}px`,
              '--source-w': `${hoveredRect.width}px`, '--source-h': `${hoveredRect.height}px`,
            } as React.CSSProperties}
           >
              <NeighbourhoodCell neighbourhood={hoveredNeighbourhood} onClick={() => {}} isSelected={false} isStatic />
           </div>
        </div>
      )}

      <AnalysisPanel neighbourhood={selectedNeighbourhood} onClose={() => setSelectedNeighbourhood(null)} />
      <FAQOverlay isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} onUpload={() => fileInputRef.current?.click()} />

      <footer className="p-4 bg-slate-900 border-t border-slate-800 text-center relative z-40">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Periodic Data Engine &bull; {isCustomData ? 'Active: Municipal Overlay' : 'Active: Edmonton Census 2024'} &bull; Scale: Rank Normalization
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-to-center {
          from { position: fixed; top: var(--source-y); left: var(--source-x); width: var(--source-w); height: var(--source-h); opacity: 0; transform: scale(0.8); }
          to { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); width: 18vw; height: auto; opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default App;
