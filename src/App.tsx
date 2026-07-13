import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import UploadPage from './components/UploadPage';
import DatasetLibrary from './components/DatasetLibrary';
import AIStudio from './components/AIStudio';
import PromptBuilder from './components/PromptBuilder';
import VisualizationStudio from './components/VisualizationStudio';
import ReportGenerator from './components/ReportGenerator';
import HistoryTab from './components/HistoryTab';
import SettingsTab from './components/SettingsTab';
import ProfileTab from './components/ProfileTab';

import { Dataset, HistoryItem, Report, PromptTemplate, AppSettings, UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [customPrompts, setCustomPrompts] = useState<PromptTemplate[]>([]);
  
  // Align settings state with AppSettings interface in types.ts
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    language: 'English',
    gemmaEndpoint: '/api/ai/analyze',
    model: 'gemini-3.5-flash',
    exportPreference: 'markdown',
    notifications: true,
    privacyMode: false
  });

  // State for user profile
  const [profile, setProfile] = useState<UserProfile>({
    name: "Dr. Rajeshwar Sharma",
    email: "rajeshwar.sharma@nic.in",
    organization: "NIC / NITI Aayog",
    role: "Senior Policy Analyst",
    avatarSeed: "rajesh",
    storageUsed: "2.4 MB"
  });

  const [loadingInitial, setLoadingInitial] = useState(true);

  // Fetch all initial data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoadingInitial(true);

        // Fetch datasets
        const dsRes = await fetch("/api/datasets");
        if (dsRes.ok) {
          const dsData = await dsRes.json();
          setDatasets(dsData);
        }

        // Fetch history
        const histRes = await fetch("/api/history");
        if (histRes.ok) {
          const histData = await histRes.json();
          setHistory(histData);
        }

        // Fetch reports
        const repRes = await fetch("/api/reports");
        if (repRes.ok) {
          const repData = await repRes.json();
          setReports(repData);
        }

        // Fetch prompts
        const prRes = await fetch("/api/prompts");
        if (prRes.ok) {
          const prData = await prRes.json();
          setCustomPrompts(prData);
        }

        // Fetch settings
        const setRes = await fetch("/api/settings");
        if (setRes.ok) {
          const setData = await setRes.json();
          if (setData && setData.theme) {
            setSettings(setData);
          }
        }

      } catch (err) {
        console.error("Error loading workspace bootstrap data:", err);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchAllData();
  }, []);

  // Sync profile storage size to actual datasets count
  useEffect(() => {
    setProfile(prev => ({
      ...prev,
      storageUsed: `${datasets.length} files`
    }));
  }, [datasets]);

  // Handler functions for propagating state
  const handleUploadSuccess = (newDataset: Dataset) => {
    setDatasets((prev) => [newDataset, ...prev]);
  };

  const handleDeleteDataset = async (id: string) => {
    try {
      const res = await fetch(`/api/datasets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDatasets((prev) => prev.filter((d) => d.id !== id));
        setHistory((prev) => prev.filter((h) => h.datasetId !== id));
        setReports((prev) => prev.filter((r) => r.datasetId !== id));
      }
    } catch (err) {
      console.error("Error deleting dataset:", err);
    }
  };

  const handleRenameDataset = async (id: string, newName: string) => {
    try {
      const res = await fetch(`/api/datasets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        setDatasets((prev) =>
          prev.map((d) => (d.id === id ? { ...d, name: newName } : d))
        );
        setHistory((prev) =>
          prev.map((h) => (h.datasetId === id ? { ...h, datasetName: newName } : h))
        );
        setReports((prev) =>
          prev.map((r) => (r.datasetId === id ? { ...r, datasetName: newName } : r))
        );
      }
    } catch (err) {
      console.error("Error renaming dataset:", err);
    }
  };

  const handleAddPrompt = async (newPrompt: PromptTemplate) => {
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrompt)
      });
      if (res.ok) {
        const savedPrompt = await res.json();
        setCustomPrompts((prev) => [savedPrompt, ...prev]);
      }
    } catch (err) {
      console.error("Error adding prompt:", err);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomPrompts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting prompt template:", err);
    }
  };

  const handleAddReport = (newReport: Report) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleDeleteReport = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  const handleAddHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory((prev) => prev.filter((h) => h.id !== id));
      }
    } catch (err) {
      console.error("Error deleting history item:", err);
    }
  };

  const handleUpdateSettings = async (updatedSettings: AppSettings) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        setSettings(updatedSettings);
      }
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  const handlePurgeDatasets = () => {
    setDatasets([]);
    setHistory([]);
    setReports([]);
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdateSettings({
      ...settings,
      theme: nextTheme
    });
  };

  // Render correct central tab panel
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardHome
            datasets={datasets}
            history={history}
            reports={reports}
            setActiveTab={setActiveTab}
          />
        );
      case 'upload':
        return (
          <UploadPage
            onUploadSuccess={handleUploadSuccess}
            setActiveTab={setActiveTab}
          />
        );
      case 'datasets':
        return (
          <DatasetLibrary
            datasets={datasets}
            onDeleteDataset={handleDeleteDataset}
            onRenameDataset={handleRenameDataset}
            setActiveTab={setActiveTab}
          />
        );
      case 'ai-studio':
        return (
          <AIStudio
            datasets={datasets}
            history={history}
            customPrompts={customPrompts}
            onAddHistory={handleAddHistory}
            setActiveTab={setActiveTab}
          />
        );
      case 'prompts':
        return (
          <PromptBuilder
            customPrompts={customPrompts}
            onAddPrompt={handleAddPrompt}
            onDeletePrompt={handleDeletePrompt}
            setActiveTab={setActiveTab}
          />
        );
      case 'visualizations': // Aligned to Sidebar.tsx tab name
        return (
          <VisualizationStudio
            datasets={datasets}
            setActiveTab={setActiveTab}
          />
        );
      case 'reports':
        return (
          <ReportGenerator
            datasets={datasets}
            history={history}
            reports={reports}
            onAddReport={handleAddReport}
            onDeleteReport={handleDeleteReport}
            setActiveTab={setActiveTab}
          />
        );
      case 'history':
        return (
          <HistoryTab
            history={history}
            onDeleteHistory={handleDeleteHistory}
            setActiveTab={setActiveTab}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onPurgeDatasets={handlePurgeDatasets}
          />
        );
      case 'profile':
        return <ProfileTab />;
      default:
        return (
          <DashboardHome
            datasets={datasets}
            history={history}
            reports={reports}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  if (loadingInitial) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#060D07] text-white">
        <div className="w-10 h-10 border-t-2 border-gold rounded-full animate-spin mb-4" />
        <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-gold">
          Bootstrapping KrishiSathi ...
        </h3>
        <p className="text-[10px] text-emerald-400/80 font-mono mt-1">
          Establishing agritech intelligence session and loading dataset catalogs...
        </p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#060D07] text-gray-100 font-sans overflow-hidden relative">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-800/15 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-gold/5 blur-[80px]"></div>
      </div>

      {/* Global upper navbar - passed all required NavbarProps */}
      <div className="relative z-10">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
          datasets={datasets}
          reports={reports}
          history={history}
          prompts={customPrompts}
          theme={settings.theme}
          toggleTheme={toggleTheme}
        />
      </div>

      {/* Main split dashboard stage layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left persistent Sidebar - passed storageUsed prop instead of datasetsCount */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          storageUsed={profile.storageUsed}
        />

        {/* Central main viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative z-10">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
