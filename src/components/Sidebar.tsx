import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  Upload,
  LineChart,
  Brain,
  Terminal,
  FileText,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  storageUsed: string;
}

export default function Sidebar({ activeTab, setActiveTab, storageUsed }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'datasets', label: 'Dataset Library', icon: Database },
    { id: 'upload', label: 'Upload Dataset', icon: Upload },
    { id: 'visualizations', label: 'Visualizations', icon: LineChart },
    { id: 'ai-studio', label: 'Gemma', icon: Brain },
    { id: 'prompts', label: 'Prompt Builder', icon: Terminal },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-[calc(100vh-73px)] glass-sidebar select-none shrink-0"
    >
      {/* Sidebar Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-3.5 z-10 flex items-center justify-center w-7 h-7 rounded-full border border-white/10 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl cursor-pointer"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Workspace Nav
          </div>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-medium cursor-pointer transition-all duration-300 relative group ${
                isActive
                  ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveHighlight"
                  className="absolute left-0 top-1/4 w-1 h-1/2 rounded-r bg-linear-to-b from-emerald-500 to-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-gold' : 'text-slate-400 group-hover:text-white'}`} />
              {!collapsed && (
                <span className="font-medium tracking-wide">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Storage Indicator */}
      <div className="p-4 border-t border-white/10">
        {!collapsed ? (
          <div className="p-4 rounded-xl bg-linear-to-br from-emerald-950/45 to-gold/5 border border-white/5 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <HardDrive className="w-4 h-4 text-gold" />
              <span>Storage Usage</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-gold"
                style={{ width: `${Math.min(100, parseFloat(storageUsed) * 15 || 5)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">{storageUsed} / 100 files</p>
          </div>
        ) : (
          <div className="flex justify-center text-gold">
            <HardDrive className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.aside>
  );
}
