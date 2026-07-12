import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Trash2,
  Edit2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  ArrowUpDown,
  FileSpreadsheet,
  Grid3X3,
  X,
  Check
} from 'lucide-react';
import EmptyState from './EmptyState';
import { Dataset, ColumnStat } from '../types';

interface DatasetLibraryProps {
  datasets: Dataset[];
  onDeleteDataset: (id: string) => void;
  onRenameDataset: (id: string, newName: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function DatasetLibrary({
  datasets,
  onDeleteDataset,
  onRenameDataset,
  setActiveTab
}: DatasetLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);
  const [loadingDataset, setLoadingDataset] = useState(false);

  // Rename editing state
  const [editingDatasetId, setEditingDatasetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Spreadsheet view states
  const [rowSearch, setRowSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedColumnStats, setSelectedColumnStats] = useState<ColumnStat | null>(null);

  const rowsPerPage = 15;

  // Set first dataset if available
  useEffect(() => {
    if (datasets.length > 0 && !selectedDatasetId) {
      setSelectedDatasetId(datasets[0].id);
    }
  }, [datasets]);

  // Fetch full dataset details including rows
  useEffect(() => {
    if (!selectedDatasetId) {
      setActiveDataset(null);
      return;
    }

    const fetchDatasetRows = async () => {
      try {
        setLoadingDataset(true);
        const res = await fetch(`/api/datasets/${selectedDatasetId}`);
        if (res.ok) {
          const fullData = await res.json();
          setActiveDataset(fullData);
          setCurrentPage(1);
          setSortField(null);
          setSelectedColumnStats(null);
        }
      } catch (err) {
        console.error("Error loading full dataset rows:", err);
      } finally {
        setLoadingDataset(false);
      }
    };

    fetchDatasetRows();
  }, [selectedDatasetId]);

  // Rename action trigger
  const handleStartRename = (d: Dataset) => {
    setEditingDatasetId(d.id);
    setRenameValue(d.name);
  };

  const handleSaveRename = (id: string) => {
    if (renameValue.trim()) {
      onRenameDataset(id, renameValue.trim());
    }
    setEditingDatasetId(null);
  };

  // Filter dataset cards
  const filteredDatasets = datasets.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting & Filtering of row data
  const getProcessedRows = () => {
    if (!activeDataset || !activeDataset.data) return [];

    let result = [...activeDataset.data];

    // Table rows search filter
    if (rowSearch.trim()) {
      const query = rowSearch.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(query)
        )
      );
    }

    // Sort trigger
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
        if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  };

  const processedRows = getProcessedRows();
  const totalPages = Math.ceil(processedRows.length / rowsPerPage) || 1;
  const paginatedRows = processedRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
          <Database className="w-5 h-5 text-indigo-400" /> Public Dataset Library
        </h2>
        <p className="text-xs text-slate-400">
          Search and sort your catalog. Click any file to open the interactive spreadsheet and examine statistical trends.
        </p>
      </div>

      {datasets.length === 0 ? (
        <div className="py-12">
          <EmptyState
            type="datasets"
            title="Your Library is Empty"
            description="You have not uploaded any datasets yet. Ingest your first public sector CSV, Excel, or JSON file to unlock visual and AI operations."
            action={{
              label: "Go to Uploader",
              onClick: () => setActiveTab('upload')
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Dataset Selection list */}
          <div className="lg:col-span-4 p-5 glass-panel space-y-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 glass-input text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-2.5 max-h-125 overflow-y-auto">
              {filteredDatasets.map((d) => {
                const isSelected = selectedDatasetId === d.id;
                const isEditing = editingDatasetId === d.id;

                return (
                  <div
                    key={d.id}
                    className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500/30 bg-indigo-500/10 shadow-inner'
                        : 'border-white/5 bg-white/2 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div
                        className="flex items-start gap-3 flex-1 cursor-pointer min-w-0"
                        onClick={() => setSelectedDatasetId(d.id)}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-slate-400'}`}>
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                className="w-full bg-slate-900 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                              />
                              <button onClick={() => handleSaveRename(d.id)} className="p-1 hover:text-emerald-400 text-slate-400 cursor-pointer">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setEditingDatasetId(null)} className="p-1 hover:text-rose-400 text-slate-400 cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <h4 className="text-xs font-semibold text-white truncate font-display" title={d.name}>
                              {d.name}
                            </h4>
                          )}
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                            {d.rowCount} rows • {d.colCount} cols • {d.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartRename(d)}
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 cursor-pointer"
                          title="Rename dataset"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteDataset(d.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-500/10 cursor-pointer"
                          title="Delete dataset"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 mt-2 border-t border-white/5 pt-2">
                      <span className="uppercase text-emerald-400 font-semibold">{d.type}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> {new Date(d.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Spreadsheet Spreadsheet view */}
          <div className="lg:col-span-8 space-y-4">
            {loadingDataset ? (
              <div className="p-12 text-center glass-panel rounded-2xl flex flex-col items-center justify-center min-h-87.5 shadow-md">
                <div className="w-8 h-8 rounded-full border-t-2 border-indigo-400 animate-spin mb-4" />
                <p className="text-xs text-slate-400 font-mono">Reading records ledger...</p>
              </div>
            ) : activeDataset ? (
              <div className="p-5 glass-panel flex flex-col min-h-120 shadow-md">
                {/* Spreadsheet filter toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2 font-display">
                      <Grid3X3 className="w-4 h-4 text-emerald-400" /> Interactive Spreadsheet
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Displaying {processedRows.length} matched rows out of {activeDataset.rowCount} total
                    </p>
                  </div>

                  <div className="relative w-full md:w-60 shrink-0">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter columns / rows..."
                      value={rowSearch}
                      onChange={(e) => {
                        setRowSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-8 pr-3 py-1.5 glass-input text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Column Stats Display box if selected */}
                {selectedColumnStats && (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mb-4 relative flex justify-between gap-4 items-start animate-fade-in shadow-sm backdrop-blur-md">
                    <div className="space-y-1.5 flex-1 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">Header: {selectedColumnStats.name}</span>
                        <span className="px-1.5 py-0.5 text-[8px] font-mono rounded bg-emerald-500/10 text-emerald-400 uppercase font-semibold">
                          {selectedColumnStats.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-[10px] text-slate-400 pt-1 font-mono">
                        <div>
                          Missing rate:{' '}
                          <span className={selectedColumnStats.missingCount > 0 ? 'text-rose-400 font-bold' : 'text-white'}>
                            {((selectedColumnStats.missingCount / activeDataset.rowCount) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          Unique elements:{' '}
                          <span className="text-white font-semibold">{selectedColumnStats.uniqueCount}</span>
                        </div>

                        {selectedColumnStats.type === 'numeric' && selectedColumnStats.stats && (
                          <>
                            <div>
                              Average: <span className="text-white font-semibold">{selectedColumnStats.stats.avg}</span>
                            </div>
                            <div>
                              Range: <span className="text-white font-semibold">[{selectedColumnStats.stats.min}, {selectedColumnStats.stats.max}]</span>
                            </div>
                          </>
                        )}
                      </div>

                      {selectedColumnStats.type === 'categorical' && selectedColumnStats.stats && selectedColumnStats.stats.frequencies && (
                        <div className="pt-2">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold">Value Frequencies:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(selectedColumnStats.stats.frequencies).map(([cat, freq], ci) => (
                              <span key={ci} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-slate-300 border border-white/5">
                                {cat}: {freq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedColumnStats(null)}
                      className="p-1 hover:text-white text-slate-400 rounded hover:bg-white/5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Main Table view */}
                <div className="flex-1 overflow-x-auto border border-white/10 rounded-xl bg-black/20 backdrop-blur-md">
                  <table className="w-full text-left text-xs text-slate-300 border-collapse table-auto">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        {activeDataset.columns.map((col, idx) => (
                          <th
                            key={idx}
                            className="p-3 font-semibold text-white tracking-wide border-r border-white/5 select-none"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate" title={col.name}>{col.name}</span>
                              <div className="flex gap-1 items-center shrink-0">
                                <button
                                  onClick={() => handleSort(col.name)}
                                  className="p-0.5 hover:bg-white/10 text-slate-400 hover:text-white rounded transition cursor-pointer"
                                  title="Sort rows"
                                >
                                  <ArrowUpDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setSelectedColumnStats(col)}
                                  className={`p-0.5 hover:bg-emerald-500/20 rounded transition cursor-pointer ${selectedColumnStats?.name === col.name ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-300'}`}
                                  title="Inspect statistics"
                                >
                                  <Info className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            {/* Visual missing rate indicator under header */}
                            <div className="w-full h-1 bg-white/5 mt-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-rose-500 rounded-full"
                                style={{ width: `${(col.missingCount / activeDataset.rowCount) * 100}%` }}
                                title={`${col.missingCount} missing values`}
                              />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {paginatedRows.length === 0 ? (
                        <tr>
                          <td colSpan={activeDataset.columns.length} className="text-center py-12 text-slate-500 font-sans">
                            No rows matched your filter query.
                          </td>
                        </tr>
                      ) : (
                        paginatedRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                            {activeDataset.columns.map((col, cIdx) => {
                              const cellValue = row[col.name];
                              return (
                                                <td
                                                  key={cIdx}
                                                  className={`p-3 border-r border-white/5 truncate max-w-50 font-sans ${
                                                    cellValue === null || cellValue === undefined ? 'text-rose-400/80 italic font-light' : 'text-slate-300'
                                                  }`}
                                                  title={cellValue !== null && cellValue !== undefined ? String(cellValue) : 'Missing (Null)'}
                                                >
                                  {cellValue === null || cellValue === undefined ? 'null' : String(cellValue)}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer bar */}
                <div className="flex items-center justify-between mt-4 text-[11px] font-mono text-slate-400">
                  <span>
                    Rows {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, processedRows.length)} of {processedRows.length}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="p-1.5 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-2">{currentPage} of {totalPages}</span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="p-1.5 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 glass-panel rounded-2xl min-h-[350px] flex items-center justify-center shadow-md">
                <p className="text-xs text-slate-400 font-mono">Select a dataset from the list to preview records.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
