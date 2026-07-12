import React, { useState } from 'react';
import { Terminal, Plus, Trash2, CheckCircle, Save, Info } from 'lucide-react';
import { PromptTemplate } from '../types';

interface PromptBuilderProps {
  customPrompts: PromptTemplate[];
  onAddPrompt: (newPrompt: PromptTemplate) => void;
  onDeletePrompt: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function PromptBuilder({
  customPrompts,
  onAddPrompt,
  onDeletePrompt,
  setActiveTab
}: PromptBuilderProps) {
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are an expert public sector data auditor.');
  const [userPrompt, setUserPrompt] = useState('');
  const [creativity, setCreativity] = useState(0.4);
  const [category, setCategory] = useState('Summary');
  const [success, setSuccess] = useState(false);

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !userPrompt.trim()) return;

    const newPrompt: PromptTemplate = {
      id: "prompt_" + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      systemPrompt: systemPrompt.trim(),
      userPrompt: userPrompt.trim(),
      creativity,
      category,
      isCustom: true
    };

    onAddPrompt(newPrompt);
    setName('');
    setUserPrompt('');
    setSystemPrompt('You are an expert public sector data auditor.');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
          <Terminal className="w-5 h-5 text-indigo-400" /> Prompt Builder
        </h2>
        <p className="text-xs text-slate-400">
          Craft bespoke System and User Prompt templates. Save them to extend your analytical profiles in the AI Studio playground.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Creator Form */}
        <form onSubmit={handleSavePrompt} className="lg:col-span-7 p-5 glass-panel space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-400" /> Save New Template
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Template Label</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Health Center Audit"
                className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none placeholder-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none cursor-pointer"
              >
                <option value="Summary" className="bg-slate-950 text-white">Summary</option>
                <option value="Trends" className="bg-slate-950 text-white">Trends</option>
                <option value="Anomalies" className="bg-slate-950 text-white">Anomalies</option>
                <option value="Comparison" className="bg-slate-950 text-white">Comparison</option>
                <option value="Risk" className="bg-slate-950 text-white">Risk</option>
                <option value="Recommendations" className="bg-slate-950 text-white">Recommendations</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">System Prompt Directive</label>
            <input
              type="text"
              required
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none placeholder-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">User Prompt Outline</label>
            <textarea
              required
              rows={4}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g. Audit the following state records to pinpoint discrepancies between the Rural and Urban column indices..."
              className="w-full p-3.5 text-xs glass-input text-white placeholder-slate-500 focus:outline-none resize-none font-sans leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span className="uppercase font-semibold">Model Temperature (Creativity)</span>
              <span className="font-bold text-indigo-400">{creativity}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={creativity}
              onChange={(e) => setCreativity(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-white/5 border border-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 glass-btn-primary text-xs font-semibold shadow-lg shadow-indigo-500/10 cursor-pointer"
          >
            Save custom template
          </button>

          {success && (
            <div className="p-3.5 glass-panel border-emerald-500/20 bg-emerald-500/5 rounded-xl text-[11px] text-emerald-400 flex items-center gap-2 animate-fade-in shadow-sm">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Prompt template saved successfully! Select it in the AI Studio play panel.</span>
            </div>
          )}
        </form>

        {/* Saved List */}
        <div className="lg:col-span-5 p-5 glass-panel flex flex-col min-h-87.5 shadow-sm">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono mb-4 flex items-center gap-1.5">
            <Save className="w-4 h-4 text-indigo-400" /> Saved Custom Profiles
          </h3>

          {customPrompts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <p className="text-xs text-slate-500 font-mono">No custom templates compiled yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-105 overflow-y-auto pr-1">
              {customPrompts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 glass-card flex flex-col justify-between hover:bg-white/10 transition-all shadow-sm"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-45" title={p.name}>
                        {p.name}
                      </h4>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[8px] font-mono font-semibold rounded bg-indigo-500/15 text-indigo-300 uppercase">
                        {p.category}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeletePrompt(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition cursor-pointer"
                      title="Delete Template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mt-2.5">
                    {p.userPrompt}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="p-3.5 glass-panel border-white/5 flex items-start gap-2.5 text-[10px] text-slate-400 mt-4 shadow-sm">
            <Info className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
            <p className="leading-relaxed">
              Custom profiles appear dynamically under the <b>Prompt Profiles</b> list inside the AI Ingestion playground.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
