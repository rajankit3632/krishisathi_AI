import React from 'react';
import { Database, FileText, Sparkles, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  type: 'datasets' | 'reports' | 'history' | 'prompts';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'datasets':
        return <Database className="w-10 h-10 text-emerald-400" />;
      case 'reports':
        return <FileText className="w-10 h-10 text-indigo-400" />;
      case 'history':
        return <Sparkles className="w-10 h-10 text-emerald-400" />;
      case 'prompts':
        return <FolderOpen className="w-10 h-10 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 glass-panel shadow-lg shadow-indigo-950/15 max-w-sm mx-auto my-4">
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner mb-4">
        {getIcon()}
      </div>
      <h3 className="text-base font-semibold text-white tracking-tight mb-2 font-display">
        {title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 glass-btn-primary text-xs font-semibold shadow-md cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
