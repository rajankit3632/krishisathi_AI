import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileCode,
  FileText,
  AlertCircle,
  Database,
  CheckCircle,
  BarChart,
  Brain,
  HelpCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Dataset } from '../types';

interface UploadPageProps {
  onUploadSuccess: (newDataset: Dataset) => void;
  setActiveTab: (tab: string) => void;
}

export default function UploadPage({ onUploadSuccess, setActiveTab }: UploadPageProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'reading' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [parsedDataset, setParsedDataset] = useState<Dataset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'csv' && fileType !== 'json' && fileType !== 'xlsx') {
      setUploadState('error');
      setErrorMessage("Unsupported file extension. Please upload a structured .csv, .xlsx, or .json file.");
      return;
    }

    setUploadState('reading');
    const reader = new FileReader();

    if (fileType === 'xlsx') {
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          // Extract base64 representation
          const base64Content = result.split(',')[1];
          uploadToServer(file.name, 'xlsx', base64Content, formatBytes(file.size));
        } catch (err: any) {
          setUploadState('error');
          setErrorMessage("Failed to read Excel workbook: " + err.message);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // CSV or JSON text reader
      reader.onload = async (e) => {
        try {
          const textContent = e.target?.result as string;
          uploadToServer(file.name, fileType as 'csv' | 'json', textContent, formatBytes(file.size));
        } catch (err: any) {
          setUploadState('error');
          setErrorMessage("Failed to read raw text content: " + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const uploadToServer = async (name: string, type: 'csv' | 'xlsx' | 'json', content: string, size: string) => {
    try {
      setUploadState('uploading');
      const response = await fetch("/api/datasets/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, content, size })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Dataset processing failure on server.");
      }

      const newDataset = await response.json();
      setParsedDataset(newDataset);
      setUploadState('success');
      onUploadSuccess(newDataset);
    } catch (err: any) {
      setUploadState('error');
      setErrorMessage(err.message || "An unexpected error occurred during database ingress.");
    }
  };

  const handleRetry = () => {
    setUploadState('idle');
    setParsedDataset(null);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-transparent">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
          <Upload className="w-5 h-5 text-indigo-400" /> Public Data Ingestion Portal
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Upload Indian public sector files to generate descriptive profiles and automatically detect statistical structures.
        </p>
      </div>

      {uploadState !== 'success' ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer group flex flex-col items-center justify-center p-12 min-h-75 rounded-2xl border-2 border-dashed transition-all duration-300 shadow-md ${
              isDragOver
                ? 'border-indigo-400 bg-indigo-500/5 shadow-lg shadow-indigo-500/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.xlsx,.json"
              className="hidden"
            />

            {uploadState === 'idle' && (
              <>
                <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-inner mb-4 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition duration-300">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight mb-1">
                  Drag & Drop files here, or click to browse
                </h3>
                <p className="text-xs text-slate-400 mb-6 font-mono">
                  Supported formats: CSV, XLSX, JSON (Max 50MB)
                </p>

                <div className="flex gap-4 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-indigo-400" /> CSV Sheets</span>
                  <span className="flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" /> Excel Books</span>
                  <span className="flex items-center gap-1"><FileCode className="w-3.5 h-3.5 text-indigo-400" /> JSON Records</span>
                </div>
              </>
            )}

            {(uploadState === 'reading' || uploadState === 'uploading') && (
              <div className="flex flex-col items-center">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
                <h3 className="text-sm font-bold text-white mb-1">
                  {uploadState === 'reading' ? 'Reading filesystem...' : 'Processing structures & metrics...'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Running automated schema profiling engine...
                </p>
              </div>
            )}
          </div>

          {/* Error Message Box */}
          {uploadState === 'error' && (
            <div className="p-4.5 glass-panel border-rose-500/20 bg-rose-500/5 text-xs text-rose-300 flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold leading-relaxed">{errorMessage}</p>
                <button
                  onClick={handleRetry}
                  className="px-3.5 py-2 glass-btn-primary hover:bg-rose-500/20 text-rose-200 border-rose-500/20 font-semibold text-[10px] cursor-pointer"
                >
                  Retry Upload
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Success Ingress Dashboard Details */
        parsedDataset && (
          <div className="space-y-6">
            <div className="p-6 glass-panel border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-white mb-0.5">
                    Dataset Successfully Ingested!
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">
                    File: <span className="text-emerald-300 font-semibold">{parsedDataset.name}</span> • {parsedDataset.size}
                  </p>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('datasets')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer transition duration-300 shadow-sm"
                >
                  Open in Library
                </button>
                <button
                  onClick={() => setActiveTab('ai-studio')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold glass-btn-primary shadow-md shadow-indigo-500/10 cursor-pointer transition duration-300"
                >
                  <Brain className="w-3.5 h-3.5" /> Analyze with Gemma
                </button>
              </div>
            </div>

            {/* Statistics Meta Row Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 glass-panel shadow-sm">
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Records Ingested</span>
                <p className="text-lg font-bold text-white mt-1">{parsedDataset.rowCount}</p>
              </div>
              <div className="p-4 glass-panel shadow-sm">
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Detected Headers</span>
                <p className="text-lg font-bold text-white mt-1">{parsedDataset.colCount}</p>
              </div>
              <div className="p-4 glass-panel shadow-sm">
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Duplicate Rows</span>
                <p className={`text-lg font-bold mt-1 ${parsedDataset.duplicateCount > 0 ? 'text-amber-400' : 'text-white'}`}>
                  {parsedDataset.duplicateCount}
                </p>
              </div>
              <div className="p-4 glass-panel shadow-sm">
                <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Total Missing Elements</span>
                <p className={`text-lg font-bold mt-1 ${parsedDataset.missingCount > 0 ? 'text-rose-400' : 'text-white'}`}>
                  {parsedDataset.missingCount}
                </p>
              </div>
            </div>

            {/* Column Schema Auto-Detection Details */}
            <div className="p-6 glass-panel shadow-md">
              <h3 className="text-sm font-bold text-white tracking-wider uppercase font-mono mb-4 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" /> Detected Schema & Column Profiling
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/5 text-slate-400 font-mono font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Column Name</th>
                      <th className="p-3">Detected Type</th>
                      <th className="p-3">Null Values</th>
                      <th className="p-3">Unique Items</th>
                      <th className="p-3">Column-wise Aggregates Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {parsedDataset.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-white/10 transition-colors">
                        <td className="p-3 font-bold text-white">{col.name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                            col.type === 'numeric' ? 'bg-emerald-500/10 text-emerald-300' :
                            col.type === 'categorical' ? 'bg-indigo-500/10 text-indigo-300' :
                            col.type === 'date' ? 'bg-amber-500/10 text-amber-300' : 'bg-white/10 text-slate-300'
                          }`}>
                            {col.type}
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          {col.missingCount > 0 ? (
                            <span className="text-rose-400 font-bold">{col.missingCount}</span>
                          ) : '0'}
                        </td>
                        <td className="p-3 font-mono">{col.uniqueCount}</td>
                        <td className="p-3 text-slate-400 font-sans">
                          {col.type === 'numeric' && col.stats && (
                            <div className="flex gap-4 font-mono text-[10px]">
                              <span>Avg: <b className="text-white">{col.stats.avg}</b></span>
                              <span>Min: <b className="text-white">{col.stats.min}</b></span>
                              <span>Max: <b className="text-white">{col.stats.max}</b></span>
                            </div>
                          )}
                          {col.type === 'categorical' && col.stats && col.stats.frequencies && (
                            <span className="text-[10px] truncate max-w-70 block" title={Object.keys(col.stats.frequencies).join(', ')}>
                              Classes: {Object.keys(col.stats.frequencies).slice(0, 4).join(', ')}...
                            </span>
                          )}
                          {col.type === 'text' && (
                            <span className="text-[10px] text-slate-500">Free text lines</span>
                          )}
                          {col.type === 'date' && (
                            <span className="text-[10px] text-slate-500">Date records</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Process complete footer actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button
                onClick={handleRetry}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer transition duration-300 shadow-sm"
              >
                Upload Another Dataset
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
