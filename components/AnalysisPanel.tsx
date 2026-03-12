
import React, { useState, useEffect } from 'react';
import { Neighbourhood, AnalysisResponse } from '../types';
import { analyzeNeighbourhood } from '../services/geminiService';

interface Props {
  neighbourhood: Neighbourhood | null;
  onClose: () => void;
}

const AnalysisPanel: React.FC<Props> = ({ neighbourhood, onClose }) => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);

  useEffect(() => {
    if (neighbourhood) {
      setLoading(true);
      setError(null);
      setAnalysis(null);
      setIsQuotaError(false);
      
      analyzeNeighbourhood(neighbourhood)
        .then(res => setAnalysis(res))
        .catch(err => {
          if (err.message === "QUOTA_EXHAUSTED") {
            setIsQuotaError(true);
            setError("The AI analysis quota has been reached for the moment. Please try again in a minute.");
          } else {
            setError("Failed to generate AI analysis. Please check your connection or try again later.");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [neighbourhood]);

  if (!neighbourhood) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[25%] bg-slate-950 border-l border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/80 backdrop-blur-md">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{neighbourhood.name}</h2>
          <p className="text-blue-400 font-bold text-lg md:text-xl uppercase tracking-widest">Ward {neighbourhood.ward}</p>
        </div>
        <button 
          onClick={onClose} 
          className="text-slate-400 hover:text-white transition-colors p-2 -mr-2 -mt-2" 
          aria-label="Close panel"
        >
          <i className="fa-solid fa-xmark text-3xl"></i>
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatBox label="Population" value={neighbourhood.population.toLocaleString()} sub="Residents" icon="fa-users" />
          <StatBox label="Households" value={neighbourhood.households.toLocaleString()} sub="Dwellings" icon="fa-house" />
          <StatBox label="Afford" value={neighbourhood.affordabilityRatio.toFixed(2)} sub="Ratio (HHI/HP)" icon="fa-hand-holding-dollar" />
          <StatBox label="Transit" value={`${Math.round(neighbourhood.sustainableModePct)}%`} sub="Active/Transit" icon="fa-bicycle" />
          <StatBox label="Income" value={`$${(neighbourhood.medianIncome / 1000).toFixed(0)}k`} sub="Median HHI" icon="fa-wallet" />
          <StatBox label="Home" value={`$${(neighbourhood.medianHomePrice / 1000).toFixed(0)}k`} sub="Median Price" icon="fa-house-chimney" />
        </div>

        {/* AI Insight Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-indigo-400 border-b border-indigo-900/30 pb-3">
            <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
            <h3 className="text-base font-black uppercase tracking-[0.2em]">Gemini AI Analysis</h3>
          </div>

          {loading ? (
            <div className="space-y-5 py-4">
              <div className="h-10 bg-slate-900 rounded animate-pulse w-full"></div>
              <div className="h-10 bg-slate-900 rounded animate-pulse w-11/12"></div>
              <div className="h-10 bg-slate-900 rounded animate-pulse w-10/12"></div>
            </div>
          ) : error ? (
            <div className={`p-6 border rounded-xl text-base italic leading-relaxed ${isQuotaError ? 'bg-amber-950/30 border-amber-900/30 text-amber-200' : 'bg-red-950/30 border-red-900/30 text-red-200'}`}>
              <div className="flex gap-3 items-start">
                <i className={`fa-solid ${isQuotaError ? 'fa-hourglass-half' : 'fa-circle-exclamation'} mt-1`}></i>
                <span>{error}</span>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-10">
              <p className="text-slate-100 text-lg md:text-xl leading-relaxed font-medium italic opacity-90">
                "{analysis.summary}"
              </p>
              
              <div className="space-y-5">
                <h4 className="text-base font-black text-slate-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-4">Key Observations</h4>
                <ul className="space-y-5">
                  {analysis.keyHighlights.map((point, i) => (
                    <li key={i} className="flex gap-4 text-base md:text-lg text-slate-200 leading-snug items-start">
                      <span className="text-indigo-500 font-black text-2xl leading-none mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-7 bg-indigo-950/20 border border-indigo-800/30 rounded-2xl shadow-inner">
                <h4 className="text-base font-black text-indigo-400 uppercase tracking-widest mb-4">Investment Verdict</h4>
                <p className="text-lg md:text-xl font-extrabold text-white leading-tight tracking-tight">{analysis.recommendation}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <p className="text-base text-slate-500 font-semibold leading-relaxed">
          Socio-economic visualization based on Edmonton Open Data. 
          AI summaries generated by Gemini 3 Flash. 
          Always verify current real estate data locally.
        </p>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: string }) => (
  <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors group flex flex-col justify-between">
    <div className="flex items-center gap-2 text-slate-400 mb-2 group-hover:text-blue-400 transition-colors">
      <i className={`fa-solid ${icon} text-lg`}></i>
      <span className="text-xs md:text-sm font-black uppercase tracking-wider truncate">{label}</span>
    </div>
    <div>
      <div className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-1 truncate">{value}</div>
      <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wide truncate">{sub}</div>
    </div>
  </div>
);

export default AnalysisPanel;
