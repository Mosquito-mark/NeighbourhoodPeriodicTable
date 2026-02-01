
import React, { useEffect, useState } from 'react';
import NeighbourhoodCell from './NeighbourhoodCell';
import { CSV_TEMPLATE_HEADER } from '../constants';
import { FIELD_DEFINITIONS } from '../dataDefinition';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: () => void;
}

const FAQOverlay: React.FC<Props> = ({ isOpen, onClose, onUpload }) => {
  const [activeTab, setActiveTab] = useState<'reading' | 'integration'>('reading');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const copyTemplate = () => {
    navigator.clipboard.writeText(CSV_TEMPLATE_HEADER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-full overflow-hidden rounded-3xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Information Center</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1">Guide & Municipal Integration Platform</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950/50 p-1 mx-6 md:mx-8 mt-6 rounded-xl border border-slate-800 self-start">
          <button 
            onClick={() => setActiveTab('reading')}
            className={`px-4 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reading' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            How to Read
          </button>
          <button 
            onClick={() => setActiveTab('integration')}
            className={`px-4 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'integration' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Municipal Integration
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-12 custom-scrollbar">
          {activeTab === 'reading' ? (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              {/* Section 1: The Periodic Logic */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-blue-400 uppercase tracking-tight">The Grid Logic</h3>
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                    Neighbourhoods are organized to reveal socio-economic patterns:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-blue-400 flex-shrink-0 font-black">Y</div>
                      <p className="text-slate-400 text-sm"><strong className="text-white">Vertical Axis:</strong> Affordability. Lower ratios (Top) represent more affordable housing relative to income.</p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0 font-black">X</div>
                      <p className="text-slate-400 text-sm"><strong className="text-white">Horizontal Axis:</strong> Sustainable Mode %. Areas with more walking/cycling/transit usage shift to the right.</p>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="max-w-[180px] mx-auto">
                    <NeighbourhoodCell neighbourhood={legendExample} onClick={() => {}} isSelected={false} isStatic />
                  </div>
                  <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500 mt-4">Example Cell Anatomy</p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-black text-blue-400 uppercase tracking-tight">Heatmap Scale</h3>
                <div className="flex items-center gap-1 h-8 rounded-lg overflow-hidden border border-slate-800">
                  <div className="flex-1 bg-[#2c7bb6]"></div>
                  <div className="flex-1 bg-[#abd9e9]"></div>
                  <div className="flex-1 bg-[#ffffbf]"></div>
                  <div className="flex-1 bg-[#fdae61]"></div>
                  <div className="flex-1 bg-[#d7191c]"></div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  <span>Low Sustainability (Car Centric)</span>
                  <span>High Sustainability (Active Transit)</span>
                </div>
              </section>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-2 duration-300 space-y-8 pb-10">
              <div className="bg-blue-900/20 border border-blue-800/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white mb-2">Deploy for your City</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    This platform is designed to be data-agnostic. By providing a CSV file matching the schema below, 
                    municipalities can instantly visualize their neighborhood statistics in this interactive periodic grid.
                  </p>
                </div>
                <button 
                  onClick={onUpload}
                  className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-upload"></i>
                  Upload Now
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">CSV Header Template</h4>
                  <button 
                    onClick={copyTemplate}
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded bg-slate-800 border transition-all ${copied ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-300 hover:text-white'}`}
                  >
                    {copied ? <><i className="fa-solid fa-check mr-1"></i> Copied</> : 'Copy Template'}
                  </button>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-blue-300 whitespace-nowrap">
                  {CSV_TEMPLATE_HEADER}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Data Field Specification</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-500 uppercase tracking-widest font-black">
                      <tr>
                        <th className="px-4 py-3">Column</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Visual Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {FIELD_DEFINITIONS.map((field) => (
                        <tr key={field.column} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 font-bold text-white">{field.column}</td>
                          <td className="px-4 py-3 text-slate-400">{field.dataType}</td>
                          <td className="px-4 py-3 text-slate-300 italic">{field.visualImpact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-800 italic text-sm text-slate-400">
                <i className="fa-solid fa-info-circle mr-2 text-blue-400"></i>
                The engine uses rank-based normalization to distribute neighbourhoods across the grid rows (by affordability) and columns (by sustainability) automatically.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-slate-800 text-center bg-slate-950/50">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Edmonton Open Data Visualization Engine v1.2 &bull; 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQOverlay;
