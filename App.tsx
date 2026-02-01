
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { Neighbourhood } from './types';
import { fetchNeighbourhoods, calculateStats } from './services/dataService';
import NeighbourhoodCell from './components/NeighbourhoodCell';
import ListView from './components/ListView';
import CardView from './components/CardView';
import AnalysisPanel from './components/AnalysisPanel';
import { COLOR_SCALE } from './constants';

export type SortKey = 'name' | 'ward' | 'medianIncome' | 'medianHomePrice' | 'affordabilityRatio' | 'sustainableModePct' | 'symbol';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

/**
 * Main Application Component
 * Orchestrates grid, list, and card views.
 * Desktop: Grid (Default) and List.
 * Mobile: Cards (Default), List, and Grid.
 */
const App: React.FC = () => {
  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<Neighbourhood | null>(null);
  const [hoveredNeighbourhood, setHoveredNeighbourhood] = useState<Neighbourhood | null>(null);
  const [hoveredRect, setHoveredRect] = useState<{ top: number, left: number, width: number, height: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'cards'>('grid');
  const [zoom, setZoom] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const mainScrollRef = useRef<HTMLElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollRequestRef = useRef<number | null>(null);
  const touchState = useRef({ initialDist: 0, initialZoom: 1 });

  // Initial Data Fetch & Responsive Default View
  useEffect(() => {
    const data = fetchNeighbourhoods();
    setNeighbourhoods(data);
    
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      setViewMode('cards');
    } else {
      setViewMode('grid'); // Desktop default is Grid
    }
  }, []);

  // Handle Resize and Mode Constraints
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // If we move to desktop while in 'cards' mode, switch to 'grid'
      if (!mobile && viewMode === 'cards') {
        setViewMode('grid');
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // --- AUTO-FIT LOGIC FOR LIST VIEW ---
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
      } else if (viewMode === 'cards' || viewMode === 'grid') {
        // Reset zoom for consistency unless user manual zooms grid
        if (viewMode === 'cards') setZoom(1);
      }
    };

    handleFitToWidth();
    window.addEventListener('resize', handleFitToWidth);
    return () => window.removeEventListener('resize', handleFitToWidth);
  }, [viewMode]);

  // --- SORTING LOGIC ---
  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedNeighbourhoods = useMemo(() => {
    const filtered = neighbourhoods.filter(n => 
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.ward.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
  }, [neighbourhoods, searchQuery, sortConfig]);

  // --- ZOOM & PINCH LOGIC ---
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if ((e.ctrlKey || e.metaKey) && viewMode !== 'cards') {
        e.preventDefault();
        const delta = -e.deltaY;
        const zoomSpeed = 0.005;
        setZoom(prev => Math.min(Math.max(prev + delta * zoomSpeed, 0.4), 2.5));
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2 && viewMode !== 'cards') {
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        touchState.current = { initialDist: dist, initialZoom: zoom };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && viewMode !== 'cards') {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const factor = dist / touchState.current.initialDist;
        const newZoom = touchState.current.initialZoom * factor;
        setZoom(Math.min(Math.max(newZoom, 0.4), 2.5));
      }
    };

    const container = mainScrollRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [zoom, viewMode]);

  // --- EDGE SCROLLING (PERIMETER MOTION) LOGIC ---
  useEffect(() => {
    const EDGE_THRESHOLD = 80; 
    const MAX_SPEED = 24;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!scrollRequestRef.current) {
        scrollRequestRef.current = requestAnimationFrame(scrollLoop);
      }
    };

    const scrollLoop = () => {
      const { x, y } = mousePos.current;
      const { innerWidth, innerHeight } = window;
      const container = mainScrollRef.current;
      
      if (!container) return;

      let dx = 0;
      let dy = 0;

      if (x < EDGE_THRESHOLD) {
        dx = -MAX_SPEED * (1 - x / EDGE_THRESHOLD);
      } else if (x > innerWidth - EDGE_THRESHOLD) {
        dx = MAX_SPEED * (1 - (innerWidth - x) / EDGE_THRESHOLD);
      }

      if (y < EDGE_THRESHOLD) {
        dy = -MAX_SPEED * (1 - y / EDGE_THRESHOLD);
      } else if (y > innerHeight - EDGE_THRESHOLD) {
        dy = MAX_SPEED * (1 - (innerHeight - y) / EDGE_THRESHOLD);
      }

      if (dx !== 0 || dy !== 0) {
        container.style.scrollBehavior = 'auto';
        container.scrollLeft += dx;
        container.scrollTop += dy;
        scrollRequestRef.current = requestAnimationFrame(scrollLoop);
      } else {
        container.style.scrollBehavior = '';
        scrollRequestRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollRequestRef.current) cancelAnimationFrame(scrollRequestRef.current);
    };
  }, [viewMode]);

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
      {/* Header */}
      <header className="p-4 md:p-6 bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center text-xl md:text-2xl font-black shadow-lg shadow-blue-900/50 text-white">Ed</div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Periodic Edmonton</h1>
              <p className="text-slate-300 text-[10px] md:text-xs font-bold uppercase tracking-widest">Socio-Economic Grid</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 flex-1 justify-end">
            {viewMode !== 'cards' && (
              <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zoom</span>
                <span className="text-xs font-bold text-white w-8">{Math.round(zoom * 100)}%</span>
                <input 
                  type="range" min="0.4" max="2.5" step="0.1" value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-20 accent-blue-500"
                />
              </div>
            )}

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
          </div>
        </div>
      </header>

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
            <div className="w-full max-w-[600px] mx-auto">
              <CardView 
                neighbourhoods={sortedNeighbourhoods}
                onSelect={setSelectedNeighbourhood}
                selectedId={selectedNeighbourhood?.id}
                sortConfig={sortConfig}
                onSort={handleSort}
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

      <footer className="p-4 bg-slate-900 border-t border-slate-800 text-center relative z-40">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Edmonton Periodic Table &bull; Hover near screen edges to auto-scroll &bull; Grid View is default on Desktop
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-to-center {
          from { position: fixed; top: var(--source-y); left: var(--source-x); width: var(--source-w); height: var(--source-h); opacity: 0; transform: scale(0.8); }
          to { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); width: 18vw; height: auto; opacity: 1; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default App;
