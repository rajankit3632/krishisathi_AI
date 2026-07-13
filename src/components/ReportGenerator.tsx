import React, { useState } from 'react';
import {
  FileText,
  Bookmark,
  Plus,
  Trash2,
  Download,
  Printer,
  CheckCircle,
  Sparkles,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { Dataset, Report, HistoryItem } from '../types';
import EmptyState from './EmptyState';

interface ReportGeneratorProps {
  datasets: Dataset[];
  history: HistoryItem[];
  reports: Report[];
  onAddReport: (newReport: Report) => void;
  onDeleteReport: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function ReportGenerator({
  datasets,
  history,
  reports,
  onAddReport,
  onDeleteReport,
  setActiveTab
}: ReportGeneratorProps) {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // Editable report states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [overview, setOverview] = useState('');
  const [insights, setInsights] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [limitations, setLimitations] = useState('');
  const [appendix, setAppendix] = useState('');

  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  // Get matching history for selected dataset
  const datasetHistory = history.filter(h => h.datasetId === selectedDatasetId);

  // Compile draft based on historical AI response
  const handleCompileDraft = () => {
    const dataset = datasets.find(d => d.id === selectedDatasetId);
    const histItem = history.find(h => h.id === selectedHistoryId);

    if (!dataset) return;

    setTitle(`Policy Report: Ingress Audit for ${dataset.name}`);

    // Generate descriptive dataset metrics
    const metricsStr = `Dataset Ingestion Date: ${new Date(dataset.uploadDate).toLocaleDateString()}
Total Records Count: ${dataset.rowCount.toLocaleString()} lines
Total Column Headers: ${dataset.colCount}
Dataset Format Type: ${dataset.type.toUpperCase()}
Duplicate Records Identified: ${dataset.duplicateCount}
Total Empty Cells: ${dataset.missingCount}
Ingressed size: ${dataset.size}`;

    setOverview(metricsStr);
    setAppendix(`Report generated via Gemma-powered explainable intelligence models at KrishiSathi AI . Bounded strictly to file "${dataset.name}".`);

    if (histItem && histItem.response) {
      setSummary(histItem.response.summary || '');
      setInsights(histItem.response.insights.map(i => `• ${i}`).join('\n') || '');
      setRecommendations(histItem.response.recommendedActions.map((a, idx) => `${idx + 1}. ${a}`).join('\n') || '');
      setLimitations(histItem.response.limitations || '');
    } else {
      setSummary(`Descriptive statistical profile compiled for ${dataset.name}.`);
      setInsights('Select a prior AI analysis run in the parameters panel to populate factual intelligence findings.');
      setRecommendations('Verify column averages and distributions inside the Visualization Studio to formulate guidelines.');
      setLimitations(dataset.missingCount > 0 ? `Out of ${dataset.rowCount} rows, ${dataset.missingCount} empty cells were identified.` : 'Zero null records identified across primary structures.');
    }
    setActiveReportId(null);
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataset = datasets.find(d => d.id === selectedDatasetId);
    if (!dataset || !title.trim()) return;

    try {
      const payload = {
        datasetId: selectedDatasetId,
        datasetName: dataset.name,
        title: title.trim(),
        summary: summary.trim(),
        overview: overview.trim(),
        insightsMarkdown: insights.trim(),
        recommendationsMarkdown: recommendations.trim(),
        limitationsMarkdown: limitations.trim(),
        appendixMarkdown: appendix.trim()
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedRep = await res.json();
        onAddReport(savedRep);
        setSuccess(true);
        setTitle('');
        setSummary('');
        setOverview('');
        setInsights('');
        setRecommendations('');
        setLimitations('');
        setAppendix('');
        setSelectedHistoryId('');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save report:", err);
    }
  };

  const handleViewReport = (rep: Report) => {
    setActiveReportId(rep.id);
    setSelectedDatasetId(rep.datasetId);
    setTitle(rep.title);
    setSummary(rep.summary);
    setOverview(rep.overview);
    setInsights(rep.insightsMarkdown);
    setRecommendations(rep.recommendationsMarkdown);
    setLimitations(rep.limitationsMarkdown);
    setAppendix(rep.appendixMarkdown);
  };

  const handleDownloadMD = () => {
    if (!title) return;
    const md = `# ${title}\n\n`
      + `## 1. Executive Summary\n${summary}\n\n`
      + `## 2. Dataset Overview\n${overview}\n\n`
      + `## 3. Key Factual Insights\n${insights}\n\n`
      + `## 4. Strategic Recommendations\n${recommendations}\n\n`
      + `## 5. Limitations & Gaps\n${limitations}\n\n`
      + `## 6. Appendix\n${appendix}`;

    const encodedUri = encodeURI(`data:text/markdown;charset=utf-8,${md}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
          <FileText className="w-5 h-5 text-indigo-400" /> Compiled Reports Portal
        </h2>
        <p className="text-xs text-slate-400">
          Synthesize structured reports by stitching together file metadata summaries with prior AI studies. Download as Markdown or print as a clean PDF.
        </p>
      </div>

      {datasets.length === 0 ? (
        <div className="py-12">
          <EmptyState
            type="datasets"
            title="Reports cannot be generated"
            description="Reports cannot be generated until public data spreadsheets are loaded."
            action={{
              label: "Open Uploader",
              onClick: () => setActiveTab('upload')
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Report Config and Saved list */}
          <div className="lg:col-span-4 space-y-5">
            {/* Parameters Panel */}
            <div className="p-5 glass-panel space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-indigo-400" /> Parameter Binder
              </h3>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Dataset Source</label>
                <select
                  value={selectedDatasetId}
                  onChange={(e) => {
                    setSelectedDatasetId(e.target.value);
                    setSelectedHistoryId('');
                  }}
                  className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-slate-950 text-white">Select Dataset...</option>
                  {datasets.map(d => (
                    <option key={d.id} value={d.id} className="bg-slate-950 text-white">{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Link prior AI Run</label>
                <select
                  value={selectedHistoryId}
                  disabled={!selectedDatasetId}
                  onChange={(e) => setSelectedHistoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none disabled:opacity-30 cursor-pointer"
                >
                  <option value="" className="bg-slate-950 text-white">No linked run (Descriptive only)...</option>
                  {datasetHistory.map(h => (
                    <option key={h.id} value={h.id} className="bg-slate-950 text-white">{h.promptName || 'Query'}: {h.promptText.substring(0, 30)}...</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleCompileDraft}
                disabled={!selectedDatasetId}
                className="w-full py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-indigo-300" /> Assemble Editable Draft
              </button>
            </div>

            {/* Saved list */}
            <div className="p-5 glass-panel flex flex-col min-h-62.5 shadow-sm">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono mb-4 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" /> Compiled Catalog
              </h3>

              {reports.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500">
                  <p className="text-xs font-mono">No compiled papers saved.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-75 overflow-y-auto pr-1">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className={`p-3.5 rounded-xl border transition-all duration-300 flex justify-between items-center ${
                        activeReportId === rep.id
                          ? 'border-indigo-500/40 bg-indigo-500/10 shadow-inner'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => handleViewReport(rep)}>
                        <h4 className="text-xs font-bold text-white truncate">{rep.title}</h4>
                        <p className="text-[9px] text-slate-400 truncate mt-0.5">Dataset: {rep.datasetName}</p>
                      </div>

                      <button
                        onClick={() => onDeleteReport(rep.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-500/10 shrink-0 ml-2 transition cursor-pointer"
                        title="Delete Report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Editable report structure */}
          <div className="lg:col-span-8">
            {selectedDatasetId || activeReportId ? (
              <form onSubmit={handleSaveReport} className="p-6 glass-panel space-y-5 shadow-md">
                {/* Header controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Policy Brief: Agricultural Yield Discrepancies"
                      className="w-full bg-transparent border-none text-md font-bold text-white focus:outline-none placeholder-slate-500 truncate font-display"
                    />
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Compiled Report Draft • Save locally inside sandbox catalog
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {title && (
                      <>
                        <button
                          type="button"
                          onClick={handleDownloadMD}
                          className="p-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition cursor-pointer shadow-sm"
                          title="Download Markdown Paper"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handlePrintPDF}
                          className="p-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition cursor-pointer shadow-sm"
                          title="Print clean PDF layout"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-2.5 glass-btn-primary text-xs font-semibold shadow-md shadow-indigo-500/10 cursor-pointer"
                    >
                      Save Report
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4 max-h-150 overflow-y-auto pr-1">
                  {/* Executive Summary */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">1. Executive Summary</label>
                    <textarea
                      rows={3}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full p-3.5 glass-input text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Dataset Overview */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">2. Dataset Overview</label>
                    <textarea
                      rows={3}
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      className="w-full p-3.5 glass-input text-xs text-white font-mono placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Insights Bullet list */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">3. Key Factual Insights</label>
                    <textarea
                      rows={4}
                      value={insights}
                      onChange={(e) => setInsights(e.target.value)}
                      className="w-full p-3.5 glass-input text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">4. Strategic Recommendations</label>
                    <textarea
                      rows={4}
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                      className="w-full p-3.5 glass-input text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Limitations */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">5. Data Limitations & Warnings</label>
                    <textarea
                      rows={2}
                      value={limitations}
                      onChange={(e) => setLimitations(e.target.value)}
                      className="w-full p-3.5 glass-input text-xs text-rose-300 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Appendix */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">6. Appendix</label>
                    <textarea
                      rows={2}
                      value={appendix}
                      onChange={(e) => setAppendix(e.target.value)}
                      className="w-full p-3.5 glass-input text-xs text-slate-400 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {success && (
                  <div className="p-3.5 glass-panel border-emerald-500/20 bg-emerald-500/5 rounded-xl text-[11px] text-emerald-400 flex items-center gap-2 animate-fade-in shadow-sm">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Report saved successfully inside catalog repository!</span>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center p-12 glass-panel min-h-110 flex flex-col items-center justify-center shadow-md">
                <p className="text-xs text-slate-400 font-mono">Assemble parameters on the left panel or click a catalog entry to open a paper.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
