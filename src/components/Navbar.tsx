import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Sparkles, Bell, User, FileText, Database, HelpCircle } from 'lucide-react';
import { UserProfile, Dataset, Report, HistoryItem, PromptTemplate } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  datasets: Dataset[];
  reports: Report[];
  history: HistoryItem[];
  prompts: PromptTemplate[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  profile,
  datasets,
  reports,
  history,
  prompts,
  theme,
  toggleTheme
}: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{
    datasets: Dataset[];
    reports: Report[];
    prompts: PromptTemplate[];
  }>({ datasets: [], reports: [], prompts: [] });

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults({ datasets: [], reports: [], prompts: [] });
      return;
    }

    const term = searchTerm.toLowerCase();

    const filteredDatasets = datasets.filter(d => 
      d.name.toLowerCase().includes(term) || d.type.toLowerCase().includes(term)
    );

    const filteredReports = reports.filter(r => 
      r.title.toLowerCase().includes(term) || r.datasetName.toLowerCase().includes(term)
    );

    const filteredPrompts = prompts.filter(p => 
      p.name.toLowerCase().includes(term) || p.userPrompt.toLowerCase().includes(term)
    );

    setResults({
      datasets: filteredDatasets,
      reports: filteredReports,
      prompts: filteredPrompts
    });
  }, [searchTerm, datasets, reports, prompts]);

  const handleResultClick = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass-header">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('dashboard')}>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-gold shadow-lg shadow-gold/10 animate-pulse-slow">
          <Sparkles className="w-5 h-5 text-emerald-950" />
        </div>
        <div>
          <h1 className="text-md font-bold tracking-tight leading-tight font-display bg-clip-text text-transparent bg-linear-to-r from-white via-slate-100 to-gold">
            KrishiSathi AI
          </h1>
          <span className="text-[9px] text-gold font-mono uppercase tracking-widest block mt-0.5">
            Premium Agritech Engine
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-lg mx-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search datasets, reports, prompts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs glass-input text-white placeholder-slate-400"
          />
        </div>

        {/* Global Search Results Dropdown */}
        {showResults && searchTerm.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 p-3 rounded-xl border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-2xl z-50 max-h-100 overflow-y-auto">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Matching Resources</span>
              <button onClick={() => setShowResults(false)} className="hover:text-white">Close</button>
            </div>

            {results.datasets.length === 0 && results.reports.length === 0 && results.prompts.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No matching results for "{searchTerm}"
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Datasets Matches */}
                {results.datasets.length > 0 && (
                  <div>
                    <h4 className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Database className="w-3 h-3" /> Datasets
                    </h4>
                    <div className="space-y-1">
                      {results.datasets.map(d => (
                        <div
                          key={d.id}
                          onClick={() => handleResultClick('datasets')}
                          className="p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/4 cursor-pointer transition flex justify-between items-center"
                        >
                          <span className="font-medium truncate">{d.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{d.rowCount} rows</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reports Matches */}
                {results.reports.length > 0 && (
                  <div>
                    <h4 className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Reports
                    </h4>
                    <div className="space-y-1">
                      {results.reports.map(r => (
                        <div
                          key={r.id}
                          onClick={() => handleResultClick('reports')}
                          className="p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/4 cursor-pointer transition truncate font-medium"
                        >
                          {r.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prompts Matches */}
                {results.prompts.length > 0 && (
                  <div>
                    <h4 className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Custom Prompts
                    </h4>
                    <div className="space-y-1">
                      {results.prompts.map(p => (
                        <div
                          key={p.id}
                          onClick={() => handleResultClick('prompts')}
                          className="p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/4 cursor-pointer transition truncate font-medium"
                        >
                          {p.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Navigation Shortcuts */}
        <div className="hidden lg:flex items-center gap-1.5 glass-panel p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('ai-studio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'ai-studio' ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-slate-400 hover:text-white'}`}
          >
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'datasets' ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-slate-400 hover:text-white'}`}
          >
            Datasets
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'reports' ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-slate-400 hover:text-white'}`}
          >
            Reports
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          title="Toggle UI Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Profile Card Summary */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer shadow-sm"
        >
          <div className="w-7.5 h-7.5 rounded-lg bg-linear-to-br from-emerald-600 to-gold flex items-center justify-center font-bold text-xs text-emerald-950 shadow-md shadow-gold/20">
            {profile.name ? profile.name.charAt(0) : <User className="w-3.5 h-3.5" />}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-[11px] font-semibold text-white leading-tight font-display">
              {profile.name}
            </p>
            <p className="text-[9px] text-gold font-mono tracking-wider mt-0.5">
              {profile.role}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
