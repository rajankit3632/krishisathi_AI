import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Sliders,
  Play,
  Copy,
  Download,
  RotateCcw,
  Languages,
  CheckCircle,
  AlertTriangle,
  FileText,
  HelpCircle,
  Bookmark,
  Compass,
  Cpu
} from 'lucide-react';
import { Dataset, AIResponse, HistoryItem, PromptTemplate } from '../types';
import EmptyState from './EmptyState';
import AILoading from './AILoading';

interface AIStudioProps {
  datasets: Dataset[];
  history: HistoryItem[];
  customPrompts: PromptTemplate[];
  onAddHistory: (item: HistoryItem) => void;
  setActiveTab: (tab: string) => void;
}

const BHASHA_LANGUAGES = [
  "English",
  "Hindi (हिन्दी)",
  "Bengali (বাংলা)",
  "Tamil (தமிழ்)",
  "Telugu (తెలుగు)",
  "Kannada (ಕನ್ನಡ)",
  "Marathi (मराठी)",
  "Gujarati (ગુજરાતી)",
  "Malayalam (മലയാളം)",
  "Punjabi (ਪੰਜਾਬಿ)",
  "Odia (ଓଡ଼ିଆ)",
  "Urdu (اردو)"
];

const DEFAULT_TEMPLATES: PromptTemplate[] = [
  { id: 't-1', name: "Generate Summary", category: "Summary", systemPrompt: "Summarize dataset metrics.", userPrompt: "Provide a detailed executive summary of the dataset characteristics, row metrics, columns, missing elements, and highlight any baseline observations.", creativity: 0.3 },
  { id: 't-2', name: "Find Trends", category: "Trends", systemPrompt: "Correlate variables.", userPrompt: "Analyze the dataset for trends, correlations between columns, or chronological growth patterns. Identify specific figures to support.", creativity: 0.4 },
  { id: 't-3', name: "Find Anomalies", category: "Anomalies", systemPrompt: "Identify outliers.", userPrompt: "Audit the dataset for extreme out-of-range values, spikes, abnormal rows, or missing counts. Describe why they qualify as statistical anomalies.", creativity: 0.3 },
  { id: 't-4', name: "Compare Categories", category: "Comparison", systemPrompt: "Compare categories.", userPrompt: "Compare categorical columns and determine their relative value counts or averages. Highlight which classes outperform or underperform.", creativity: 0.4 },
  { id: 't-5', name: "Risk Analysis", category: "Risk", systemPrompt: "Audit structural risks.", userPrompt: "Assess public policy risks, high variance values, or column gaps that emerge from these uploaded figures.", creativity: 0.3 },
  { id: 't-6', name: "Recommendations", category: "Recommendations", systemPrompt: "Formulate actionable advice.", userPrompt: "Formulate concrete, data-driven recommendations and strategic advice for public administrators, planners, or researchers based solely on this data.", creativity: 0.5 },
  { id: 't-7', name: "Question Answering", category: "Q&A", systemPrompt: "Answer exact queries.", userPrompt: "Answer the following exact question: [Insert your question here]. If the dataset does not contain sufficient columns or rows, reply with 'Not enough data.'", creativity: 0.4 },
  { id: 't-8', name: "Explain Dataset", category: "Explanation", systemPrompt: "Layman explainable policy.", userPrompt: "Explain this dataset to an ordinary citizen, translating mathematical terms, indices, or codes into simple, layman-understandable insights.", creativity: 0.4 },
  { id: 't-9', name: "Translate Results", category: "Translation", systemPrompt: "Translate insights.", userPrompt: "Review previous observations and translate them fully, using localized analogies to maximize community understanding.", creativity: 0.2 },
  { id: 't-10', name: "Executive Report", category: "Executive", systemPrompt: "Structure comprehensive report.", userPrompt: "Compile a structured executive policy paper detailing primary findings, limitations, warnings, and programmatic action guides.", creativity: 0.4 }
];

export default function AIStudio({
  datasets,
  history,
  customPrompts,
  onAddHistory,
  setActiveTab
}: AIStudioProps) {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('t-1');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [temperature, setTemperature] = useState<number>(0.4);
  const [promptEditor, setPromptEditor] = useState<string>('');

  // AI execution states
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState(false);

  // Combine default templates and custom user templates
  const allTemplates = [...DEFAULT_TEMPLATES, ...customPrompts];

  // Set initial default dataset and prompt template on mount
  useEffect(() => {
    if (datasets.length > 0 && !selectedDatasetId) {
      setSelectedDatasetId(datasets[0].id);
    }
  }, [datasets]);

  useEffect(() => {
    const activeTpl = allTemplates.find(t => t.id === selectedTemplateId);
    if (activeTpl) {
      setPromptEditor(activeTpl.userPrompt);
      setTemperature(activeTpl.creativity);
    }
  }, [selectedTemplateId, customPrompts]);

  const handleRunAnalysis = async () => {
    if (!selectedDatasetId || !promptEditor.trim()) return;

    try {
      setAnalyzing(true);
      setErrorText('');
      setAiResponse(null);

      const templateName = allTemplates.find(t => t.id === selectedTemplateId)?.name || "Custom Prompt";

      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetId: selectedDatasetId,
          promptText: promptEditor,
          promptName: templateName,
          language: selectedLanguage,
          temperature,
          model: selectedModel
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gemma server calculation failed.");
      }

      const historyItem: HistoryItem = await res.json();
      setAiResponse(historyItem.response);
      onAddHistory(historyItem);
    } catch (err: any) {
      console.error("AI execution error:", err);
      setErrorText(err.message || "An unexpected error occurred in Gemma.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyText = () => {
    if (!aiResponse) return;
    const fullText = `SUMMARY:\n${aiResponse.summary}\n\nKEY INSIGHTS:\n${aiResponse.insights.join('\n')}\n\nREASONING:\n${aiResponse.reasoning}\n\nEVIDENCE:\n${aiResponse.evidence}\n\nCONFIDENCE SCORE: ${aiResponse.confidenceScore}%\n\nLIMITATIONS:\n${aiResponse.limitations}\n\nRECOMMENDED ACTIONS:\n${aiResponse.recommendedActions.join('\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!aiResponse) return;
    const activeDatasetName = datasets.find(d => d.id === selectedDatasetId)?.name || 'dataset';
    const markdownContent = `data:text/markdown;charset=utf-8,# Gemma AI Analysis Report: ${activeDatasetName}\n\n`
      + `## Executive Summary\n${aiResponse.summary}\n\n`
      + `## Key Factual Insights\n${aiResponse.insights.map(i => `* ${i}`).join('\n')}\n\n`
      + `## Analytical Reasoning\n${aiResponse.reasoning}\n\n`
      + `## Evidence & Data Fields\n${aiResponse.evidence}\n\n`
      + `## Confidence Rating\n**${aiResponse.confidenceScore}%** based on completeness\n\n`
      + `## Data Limitations\n${aiResponse.limitations}\n\n`
      + `## Programmatic Policy Guidelines\n${aiResponse.recommendedActions.map(a => `1. ${a}`).join('\n')}`;

    const encodedUri = encodeURI(markdownContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeDatasetName}_gemma_insight.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
          <Brain className="w-5 h-5 text-indigo-400" /> Gemma
        </h2>
        <p className="text-xs text-slate-400">
          Contrast public policy files with pre-built prompt profiles or custom commands. Get explainable results compiled in regional Indian languages.
        </p>
      </div>

      {datasets.length === 0 ? (
        <div className="py-12">
          <EmptyState
            type="datasets"
            title="Ingest data files first"
            description="The AI Analysis Studio requires public data files to trigger Gemma analysis."
            action={{
              label: "Go to Inbound Portal",
              onClick: () => setActiveTab('upload')
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Input Parameters Panel */}
          <div className="lg:col-span-5 p-5 glass-panel space-y-5 shadow-sm">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" /> Parameters Panel
            </h3>

            {/* Selected Dataset */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Select Target Dataset</label>
              <select
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="w-full px-3.5 py-2.5 glass-input text-xs text-white focus:outline-none cursor-pointer"
              >
                {datasets.map(d => (
                  <option key={d.id} value={d.id} className="bg-slate-950 text-white">{d.name} ({d.rowCount} records)</option>
                ))}
              </select>
            </div>

            {/* Model Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1 font-semibold">
                  <Cpu className="w-3.5 h-3.5" /> Intelligence Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="gemini-3.5-flash" className="bg-slate-950 text-white">Gemma 3.5 Flash (Fast)</option>
                  <option value="gemini-3.1-pro-preview" className="bg-slate-950 text-white">Gemma 3.1 Pro (Complex)</option>
                </select>
              </div>

              {/* Bhasha Language Translation */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1 font-semibold">
                  <Languages className="w-3.5 h-3.5" /> Output Bhasha
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input text-xs text-white focus:outline-none cursor-pointer"
                >
                  {BHASHA_LANGUAGES.map((lang, li) => (
                    <option key={li} value={lang} className="bg-slate-950 text-white">{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prebuilt Templates Carousel */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Prompt Profiles</label>
              <div className="flex gap-2 overflow-x-auto pb-1.5 max-w-full">
                {allTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] whitespace-nowrap border shrink-0 transition cursor-pointer ${
                      selectedTemplateId === tpl.id
                        ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400 font-bold shadow-inner'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Prompt Editor */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Analytical prompt editor</label>
              <textarea
                value={promptEditor}
                onChange={(e) => setPromptEditor(e.target.value)}
                rows={5}
                className="w-full p-3.5 glass-input text-xs text-white placeholder-slate-500 focus:outline-none resize-none font-sans leading-relaxed"
                placeholder="Query Gemma AI concerning public dataset relationships..."
              />
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span className="uppercase font-semibold">Model Temperature / Creativity</span>
                <span className="font-bold text-indigo-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-white/5 border border-white/10 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Execute Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing || !promptEditor.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 glass-btn-primary text-xs font-semibold shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-white" />
              <span>Initiate Audit Analysis</span>
            </button>
          </div>

          {/* RIGHT COLUMN: AI Explanation Results Stage */}
          <div className="lg:col-span-7">
            {analyzing ? (
              <AILoading />
            ) : errorText ? (
              <div className="p-5 glass-panel border-rose-500/20 bg-rose-500/5 text-xs text-rose-300 flex items-start gap-3 shadow-md">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <h4 className="font-bold mb-1">Gemma Ingestion Failure</h4>
                  <p className="leading-relaxed mb-3">{errorText}</p>
                  <button onClick={handleRunAnalysis} className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] hover:bg-rose-500/20 transition cursor-pointer font-semibold text-rose-300">
                    Retry Audit
                  </button>
                </div>
              </div>
            ) : aiResponse ? (
              <div className="space-y-6 animate-fade-in">
                {/* Visualizer header metrics */}
                <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5 font-display">
                      <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> Gemma Analytical Audit Output
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Generated completely from uploaded public evidence.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyText}
                      className="p-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition cursor-pointer shadow-sm"
                      title="Copy full text results"
                    >
                      {copied ? <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> : <Copy className="w-4.5 h-4.5" />}
                    </button>
                    <button
                      onClick={handleDownloadReport}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white rounded-xl transition cursor-pointer shadow-sm"
                      title="Download markdown report"
                    >
                      <Download className="w-4 h-4" /> <span className="hidden md:inline font-semibold text-[11px]">Download MD</span>
                    </button>
                  </div>
                </div>

                {/* Score and summary Card */}
                <div className="p-6 glass-panel space-y-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                      <Bookmark className="w-3.5 h-3.5 text-emerald-400" /> Executive Outline
                    </span>

                    {/* Confidence score badge */}
                    <div className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono flex items-center gap-1.5 ${getConfidenceColor(aiResponse.confidenceScore)}`}>
                      <span>Confidence Score:</span>
                      <b className="font-semibold text-[11px]">{aiResponse.confidenceScore}%</b>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {aiResponse.summary}
                  </p>
                </div>

                {/* Insights bullets */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-semibold">Key Factual Insights</span>
                  <div className="space-y-2">
                    {aiResponse.insights.map((ins, ii) => (
                      <div key={ii} className="p-4 glass-card flex items-start gap-3 shadow-sm">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {ins}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accordion list: Reasoning, Gaps, Recommendations */}
                <div className="space-y-3.5">
                  {/* Reasoning block */}
                  <div className="p-5 glass-panel border-white/5 space-y-2 shadow-sm">
                    <h4 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-indigo-400" /> Analytical Reasoning Process
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {aiResponse.reasoning}
                    </p>
                  </div>

                  {/* Evidence utilised */}
                  {aiResponse.evidence && (
                    <div className="p-5 glass-panel border-white/5 space-y-2 shadow-sm">
                      <h4 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-400" /> Evidence Utilised
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-mono">
                        {aiResponse.evidence}
                      </p>
                    </div>
                  )}

                  {/* Programmatic Policy Recommendations */}
                  <div className="p-5 glass-panel border-white/5 space-y-3 shadow-sm">
                    <h4 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-400" /> Strategic Policy Guidance
                    </h4>
                    <div className="space-y-2 font-sans text-xs text-slate-300">
                      {aiResponse.recommendedActions.map((rec, ri) => (
                        <div key={ri} className="flex gap-2.5">
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
                        {aiResponse.limitations}
                      </p>
                    </div>
                  </div>

                  {/* Next Exploratory Questions */}
                  {aiResponse.exploreQuestions && aiResponse.exploreQuestions.length > 0 && (
                    <div className="p-5 glass-panel border-white/5 space-y-2.5 shadow-sm">
                      <h4 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-400" /> Analytical Questions to Explore Next
                      </h4>
                      <div className="space-y-1.5 text-xs text-slate-400 font-sans">
                        {aiResponse.exploreQuestions.map((q, qi) => (
                          <div key={qi} className="flex gap-2">
                            <span>•</span>
                            <p>{q}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 glass-panel min-h-87.5 flex flex-col items-center justify-center shadow-md">
                <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse mb-3" />
                <h4 className="text-sm font-semibold text-white mb-1 font-display">Playground Idle</h4>
                <p className="text-xs text-slate-400 font-mono">Select a prompt template in the left panel and click "Initiate Audit" to query Gemma AI.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
