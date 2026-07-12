import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Sliders, AlertTriangle, Key, Sparkles, RefreshCw } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsTabProps {
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  onPurgeDatasets: () => void;
}

export default function SettingsTab({ settings, onUpdateSettings, onPurgeDatasets }: SettingsTabProps) {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(settings.theme);
  const [modelType, setModelType] = useState<string>(settings.model);
  const [isPurging, setIsPurging] = useState(false);
  const [purgedMessage, setPurgedMessage] = useState(false);

  const handleSaveSettings = () => {
    onUpdateSettings({
      ...settings,
      theme: themeMode,
      model: modelType
    });
  };

  const triggerPurge = async () => {
    try {
      setIsPurging(true);
      const res = await fetch("/api/datasets", { method: "DELETE" });
      if (res.ok) {
        onPurgeDatasets();
        setPurgedMessage(true);
        setTimeout(() => setPurgedMessage(false), 3000);
      }
    } catch (err) {
      console.error("Failed to purge datasets:", err);
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
          <Settings className="w-5 h-5 text-indigo-400" /> System Configurations
        </h2>
        <p className="text-xs text-slate-400">
          Configure security, API endpoints, visualization parameters, and manage local databases safely.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Core Security architecture banner */}
        <div className="p-6 glass-panel border-indigo-500/20 bg-indigo-500/5 space-y-3 shadow-md">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" /> Certified Server-Side Architecture
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Your workspace implements strict full-stack security rules. All Gemma-3.5 API connections, PDF compilers, and spreadsheet parsing algorithms run exclusively on isolated backend systems. Your <b>GEMINI_API_KEY</b> credentials remain completely hidden from browser runtimes.
          </p>

          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-indigo-400" /> API: ENCRYPTED</span>
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-emerald-400" /> DB: LOCAL SANDBOX</span>
          </div>
        </div>

        {/* Global parameter configs */}
        <div className="p-6 glass-panel space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-400" /> Default Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Model choice */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Primary Intelligence Model</label>
              <select
                value={modelType}
                onChange={(e) => {
                  setModelType(e.target.value);
                  onUpdateSettings({ ...settings, model: e.target.value });
                }}
                className="w-full px-3.5 py-2.5 glass-input text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="gemini-3.5-flash" className="bg-slate-950 text-white">Gemma 3.5 Flash (Optimized)</option>
                <option value="gemini-3.1-pro-preview" className="bg-slate-950 text-white">Gemma 3.1 Pro (Complex Reasoning)</option>
              </select>
            </div>

            {/* Ingress threshold rows */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Theme Presets</label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setThemeMode('dark');
                    onUpdateSettings({ ...settings, theme: 'dark' });
                  }}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border cursor-pointer transition ${
                    themeMode === 'dark'
                      ? 'border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner'
                      : 'border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Frosted Glass
                </button>
                <button
                  onClick={() => {
                    setThemeMode('light');
                    onUpdateSettings({ ...settings, theme: 'light' });
                  }}
                  disabled
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-white/5 text-slate-600 cursor-not-allowed"
                  title="Light theme coming soon"
                >
                  Light Glass (Locked)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Database administration panel */}
        <div className="p-6 glass-panel border-rose-500/20 bg-rose-500/5 space-y-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-rose-300 tracking-wider uppercase font-mono">
                Compliance Administration & Purging
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed font-sans mt-1.5">
                To guarantee compliance with data localization directives or regional administrative audits, you can purge all ingressed sheets and analytical history records from the workspace sandbox completely. This action is irreversible.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={triggerPurge}
              disabled={isPurging}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 cursor-pointer disabled:opacity-30 transition flex items-center gap-1.5 shadow-sm"
            >
              {isPurging ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Purging database...
                </>
              ) : (
                'Purge Catalog & Logs'
              )}
            </button>
          </div>

          {purgedMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-400 flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Database successfully cleaned. All client and server datasets purged.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
