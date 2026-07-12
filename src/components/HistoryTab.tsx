import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  Calendar,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Brain,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { HistoryItem } from '../types';
import EmptyState from './EmptyState';

interface HistoryTabProps {
  history: HistoryItem[];
  onDeleteHistory: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function HistoryTab({ history, onDeleteHistory, setActiveTab }: HistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const filteredHistory = history.filter(h =>
    h.datasetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.promptName && h.promptName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeItem = history.find(h => h.id === activeItemId);

  const getConfidenceColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
          <History className="w-5 h-5 text-indigo-400" /> Analytical History Ledger
        </h2>
        <p className="text-xs text-slate-400">
          Revisit and inspect past intelligence audits. Click any historical log to view its structured insights.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="py-12">
          <EmptyState
            type="history"
            title="Ledger is Empty"
            description="You have not triggered any AI audits in this workspace yet. Ingest your data and initiate an analysis to populate logs."
            action={{
              label: "Open Gemma Studio",
              onClick: () => setActiveTab('ai-studio')
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: History cards selection */}
          <div className="lg:col-span-5 p-5 glass-panel space-y-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search history logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs glass-input text-white focus:outline-none placeholder-slate-500"
              />
            </div>

            <div className="space-y-2.5 max-h-125 overflow-y-auto pr-1">
              {filteredHistory.map((h) => {
                const isSelected = activeItemId === h.id;
                return (
                  <div
                    key={h.id}
                    className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500/40 bg-indigo-500/10 shadow-inner'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div
                        className="min-w-0 flex-1 cursor-pointer"
                        onClick={() => setActiveItemId(h.id)}
                      >
                        <h4 className="text-xs font-bold text-white truncate" title={h.promptName || 'Prompt Query'}>
                          {h.promptName || 'Gemma Query'}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                          File: {h.datasetName}
                        </p>
                      </div>

                      <button
                        onClick={() => onDeleteHistory(h.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete run log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-1 italic mb-2">
                      "{h.promptText}"
                    </p>

                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 border-t border-white/5 pt-2">
                      <span className="text-indigo-400 uppercase tracking-wide font-semibold">{h.language} • {h.model}</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Calendar className="w-2.5 h-2.5" /> {new Date(h.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Output display */}
          <div className="lg:col-span-7">
            {activeItem && activeItem.response ? (
              <div className="p-6 glass-panel space-y-5 max-h-160 overflow-y-auto shadow-md animate-fade-in">
                <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5 font-display">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Historical Analysis Result
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Ingested: {new Date(activeItem.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <div className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono flex items-center gap-1.5 ${getConfidenceColor(activeItem.response.confidenceScore)}`}>
                    <span>Confidence Score:</span>
                    <b className="font-semibold text-[11px]">{activeItem.response.confidenceScore}%</b>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Summary */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-semibold">Executive Summary</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans p-4 rounded-xl bg-white/5 border border-white/10 shadow-sm">
                      {activeItem.response.summary}
                    </p>
                  </div>

                  {/* Insights */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-semibold">Factual Insights</span>
                    <div className="space-y-2">
                      {activeItem.response.insights.map((ins, ii) => (
                        <div key={ii} className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex items-start gap-3 shadow-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-300 font-sans leading-relaxed">{ins}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="p-5 glass-panel border-white/5 space-y-2 shadow-sm">
                    <h4 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-indigo-400" /> Analytical Reasoning Process
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {activeItem.response.reasoning}
                    </p>
                  </div>

                  {/* Evidence */}
                  {activeItem.response.evidence && (
                    <div className="p-5 glass-panel border-white/5 space-y-2 shadow-sm">
                      <h4 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-400" /> Evidence Utilised
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-mono">
                        {activeItem.response.evidence}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="p-5 glass-panel border-white/5 space-y-3 shadow-sm">
                    <h4 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-emerald-400" /> Strategic Policy Guidance
                    </h4>
                    <div className="space-y-2 font-sans text-xs text-slate-300">
                      {activeItem.response.recommendedActions.map((rec, ri) => (
                        <div key={ri} className="flex gap-2">
                          <span className="font-bold text-emerald-400 shrink-0 font-mono">{ri + 1}.</span>
                          <p className="leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gaps Alert Box */}
                  <div className="p-5 glass-panel border-rose-500/20 bg-rose-500/5 flex items-start gap-3 shadow-sm">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] text-rose-300 uppercase font-mono tracking-wider font-bold mb-1">
                        Data Warnings & Gaps
                      </h4>
                      <p className="text-xs text-rose-200/90 leading-relaxed font-sans">
                        {activeItem.response.limitations}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 glass-panel min-h-87.5 flex flex-col items-center justify-center shadow-md">
                <p className="text-xs text-slate-400 font-mono">Select an audit item in the left panel to display historical findings.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
