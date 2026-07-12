import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  LineChart as LineIcon,
  BarChart3,
  PieChart as PieIcon,
  AreaChart as AreaIcon,
  Table,
  Sliders,
  Sparkles,
  Download,
  Printer,
  ChevronDown,
  Info
} from 'lucide-react';
import { Dataset } from '../types';
import EmptyState from './EmptyState';

interface VisualizationStudioProps {
  datasets: Dataset[];
  setActiveTab: (tab: string) => void;
}

export default function VisualizationStudio({ datasets, setActiveTab }: VisualizationStudioProps) {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(false);

  // Chart configuration states
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'area' | 'table'>('bar');
  const [xAxisKey, setXAxisKey] = useState<string>('');
  const [yAxisKey, setYAxisKey] = useState<string>('');
  const [aggregation, setAggregation] = useState<'none' | 'sum' | 'avg' | 'count' | 'min' | 'max'>('avg');
  const [chartTheme, setChartTheme] = useState<'teal' | 'indigo' | 'amber' | 'rose'>('teal');
  const [rowLimit, setRowLimit] = useState<number>(30);

  // Set initial selected dataset
  useEffect(() => {
    if (datasets.length > 0 && !selectedDatasetId) {
      setSelectedDatasetId(datasets[0].id);
    }
  }, [datasets]);

  // Load selected dataset full rows
  useEffect(() => {
    if (!selectedDatasetId) {
      setActiveDataset(null);
      return;
    }

    const loadDataset = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/datasets/${selectedDatasetId}`);
        if (res.ok) {
          const d = await res.json();
          setActiveDataset(d);

          // Auto-select suggested axis
          const catCol = d.columns.find((c: any) => c.type === 'categorical' || c.type === 'text');
          const numCol = d.columns.find((c: any) => c.type === 'numeric');

          setXAxisKey(catCol ? catCol.name : d.columns[0]?.name || '');
          setYAxisKey(numCol ? numCol.name : d.columns[0]?.name || '');
        }
      } catch (err) {
        console.error("Error fetching rows for visualizer:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDataset();
  }, [selectedDatasetId]);

  // Calculate Aggregation on client-side
  const getChartData = () => {
    if (!activeDataset || !activeDataset.data || !xAxisKey) return [];

    let rawRows = [...activeDataset.data];

    // Restrict row count to avoid cluttering charts
    if (aggregation === 'none') {
      return rawRows.slice(0, rowLimit).map(r => ({
        name: String(r[xAxisKey] || 'N/A'),
        value: Number(r[yAxisKey]) || 0
      }));
    }

    // Grouping by X Axis
    const groups: Record<string, any[]> = {};
    rawRows.forEach((row) => {
      const groupVal = row[xAxisKey] === null || row[xAxisKey] === undefined ? 'Null' : String(row[xAxisKey]);
      if (!groups[groupVal]) groups[groupVal] = [];
      groups[groupVal].push(row);
    });

    return Object.entries(groups).map(([groupKey, groupRows]) => {
      const numericValues = groupRows
        .map(r => r[yAxisKey])
        .filter(v => v !== null && v !== undefined && typeof v === 'number');

      let computedValue = 0;

      if (aggregation === 'count') {
        computedValue = groupRows.length;
      } else if (numericValues.length > 0) {
        if (aggregation === 'sum') {
          computedValue = numericValues.reduce((a, b) => a + b, 0);
        } else if (aggregation === 'avg') {
          computedValue = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
        } else if (aggregation === 'min') {
          computedValue = Math.min(...numericValues);
        } else if (aggregation === 'max') {
          computedValue = Math.max(...numericValues);
        }
      }

      return {
        name: groupKey,
        value: parseFloat(computedValue.toFixed(2))
      };
    }).slice(0, rowLimit); // Apply visual density limit
  };

  const chartData = getChartData();

  // Export current aggregated chart data to CSV
  const handleExportCSV = () => {
    if (chartData.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8,"
      + `Grouping (${xAxisKey}),Value (${yAxisKey} - ${aggregation})\n`
      + chartData.map(d => `"${d.name}",${d.value}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeDataset?.name || 'chart'}_analytics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintHTML = () => {
    window.print();
  };

  // Theme palettes definitions
  const THEMES = {
    teal: { bar: '#0d9488', line: '#0f766e', area: 'rgba(13, 148, 136, 0.2)', stroke: '#14b8a6', gradient: ['#14b8a6', '#0d9488', '#0f766e', '#115e59'] },
    indigo: { bar: '#4f46e5', line: '#4338ca', area: 'rgba(79, 70, 229, 0.2)', stroke: '#6366f1', gradient: ['#6366f1', '#4f46e5', '#4338ca', '#3730a3'] },
    amber: { bar: '#d97706', line: '#b45309', area: 'rgba(217, 119, 6, 0.2)', stroke: '#f59e0b', gradient: ['#f59e0b', '#d97706', '#b45309', '#92400e'] },
    rose: { bar: '#e11d48', line: '#be123c', area: 'rgba(225, 29, 72, 0.2)', stroke: '#f43f5e', gradient: ['#f43f5e', '#e11d48', '#be123c', '#9f1239'] }
  };

  const palette = THEMES[chartTheme];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
          <LineIcon className="w-5 h-5 text-indigo-400" /> Visualization Studio
        </h2>
        <p className="text-xs text-slate-400">
          Design interactive Line, Bar, Pie, or Area charts from custom aggregated columns instantly.
        </p>
      </div>

      {datasets.length === 0 ? (
        <div className="py-12">
          <EmptyState
            type="datasets"
            title="Ingest public files first"
            description="The visualization playground remains idle until data spreadsheets are ingested into the studio."
            action={{
              label: "Open Uploader",
              onClick: () => setActiveTab('upload')
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Config Sidebar */}
          <div className="lg:col-span-4 p-5 glass-panel space-y-5 shadow-sm">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" /> Chart Designer
            </h3>

            {/* Dataset selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Select Dataset</label>
              <select
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none cursor-pointer"
              >
                {datasets.map(d => (
                  <option key={d.id} value={d.id} className="bg-slate-950 text-white">{d.name}</option>
                ))}
              </select>
            </div>

            {activeDataset && (
              <>
                {/* Visual template selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Chart Structure</label>
                  <div className="grid grid-cols-5 gap-1 bg-white/5 border border-white/10 p-1 rounded-xl shadow-inner">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${chartType === 'bar' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      title="Bar chart"
                    >
                      <BarChart3 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${chartType === 'line' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      title="Line chart"
                    >
                      <LineIcon className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => setChartType('area')}
                      className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${chartType === 'area' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      title="Area chart"
                    >
                      <AreaIcon className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => setChartType('pie')}
                      className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${chartType === 'pie' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      title="Pie/Ring chart"
                    >
                      <PieIcon className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => setChartType('table')}
                      className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${chartType === 'table' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      title="Summary table"
                    >
                      <Table className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* X Axis selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">X Axis (Grouping Group)</label>
                  <select
                    value={xAxisKey}
                    onChange={(e) => setXAxisKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none cursor-pointer"
                  >
                    {activeDataset.columns.map((col, ci) => (
                      <option key={ci} value={col.name} className="bg-slate-950 text-white">{col.name} ({col.type})</option>
                    ))}
                  </select>
                </div>

                {/* Y Axis selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Y Axis (Aggregation value)</label>
                  <select
                    value={yAxisKey}
                    onChange={(e) => setYAxisKey(e.target.value)}
                    disabled={aggregation === 'count'}
                    className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none disabled:opacity-30 cursor-pointer"
                  >
                    {activeDataset.columns.map((col, ci) => (
                      <option key={ci} value={col.name} className="bg-slate-950 text-white">{col.name} ({col.type})</option>
                    ))}
                  </select>
                </div>

                {/* Aggregations */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Aggregation Operator</label>
                  <select
                    value={aggregation}
                    onChange={(e) => setAggregation(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none cursor-pointer"
                  >
                    <option value="none" className="bg-slate-950 text-white">None (Raw series first rows)</option>
                    <option value="avg" className="bg-slate-950 text-white">Average (Mean value)</option>
                    <option value="sum" className="bg-slate-950 text-white">Summation Total</option>
                    <option value="count" className="bg-slate-950 text-white">Frequency Count</option>
                    <option value="min" className="bg-slate-950 text-white">Minimum Value</option>
                    <option value="max" className="bg-slate-950 text-white">Maximum Value</option>
                  </select>
                </div>

                {/* Density Row limit */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Visual Density Limit ({rowLimit} groups)</label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={rowLimit}
                    onChange={(e) => setRowLimit(Number(e.target.value))}
                    className="w-full accent-indigo-500 bg-white/5 border border-white/10 rounded-lg h-1.5 cursor-pointer"
                  />
                </div>

                {/* Themes Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Visual Theme Palette</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(THEMES).map((themeName) => (
                      <button
                        key={themeName}
                        onClick={() => setChartTheme(themeName as any)}
                        className={`py-1.5 rounded-lg text-[10px] font-mono border capitalize cursor-pointer transition ${
                          chartTheme === themeName
                            ? 'border-white/20 text-white font-bold shadow-md bg-white/10'
                            : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
                        }`}
                        style={{
                          backgroundColor: chartTheme === themeName ? THEMES[themeName as keyof typeof THEMES].bar + '20' : 'transparent'
                        }}
                      >
                        {themeName}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* MAIN VISUAL CANVAS STAGE */}
          <div className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="p-12 text-center glass-panel shadow-sm flex flex-col items-center justify-center min-h-100">
                <div className="w-8 h-8 rounded-full border-t-2 border-indigo-400 animate-spin mb-4" />
                <p className="text-xs text-slate-400 font-mono">Recalculating database structures...</p>
              </div>
            ) : activeDataset && chartData.length > 0 ? (
              <div className="p-6 glass-panel flex flex-col min-h-110 space-y-6 shadow-md">
                {/* Visualizer header metrics */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-display">
                      <Sparkles className="w-4 h-4 text-indigo-400" /> {activeDataset.name} Chart
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Grouping: <b>{xAxisKey}</b> • Y-Value: <b>{yAxisKey}</b> ({aggregation})
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white cursor-pointer transition shadow-sm"
                      title="Export Chart Values to CSV"
                    >
                      <Download className="w-3.5 h-3.5" /> <span>Export CSV</span>
                    </button>
                    <button
                      onClick={handlePrintHTML}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white cursor-pointer transition shadow-sm"
                      title="Export Print/PDF Draft"
                    >
                      <Printer className="w-3.5 h-3.5" /> <span>Export PDF</span>
                    </button>
                  </div>
                </div>

                {/* Render Recharts canvas or Table */}
                <div className="flex-1 min-h-75">
                  {chartType === 'table' ? (
                    <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/10 shadow-inner">
                      <table className="w-full text-left text-xs text-slate-300 border-collapse table-auto">
                        <thead className="bg-white/5 border-b border-white/10 text-[10px] font-mono text-slate-400 uppercase">
                          <tr>
                            <th className="p-3">Grouping Category ({xAxisKey})</th>
                            <th className="p-3 text-right">Value ({yAxisKey} - {aggregation})</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {chartData.map((d, di) => (
                            <tr key={di} className="hover:bg-white/10 transition-colors">
                              <td className="p-3 font-bold text-white">{d.name}</td>
                              <td className="p-3 text-right font-mono text-indigo-400 font-bold">{d.value.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={340}>
                      {chartType === 'line' ? (
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                          <RechartsXAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                          <RechartsYAxis stroke="#888888" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 11 }} />
                          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                          <Line type="monotone" dataKey="value" stroke={palette.stroke} activeDot={{ r: 6 }} strokeWidth={2} name={`${yAxisKey} (${aggregation})`} />
                        </LineChart>
                      ) : chartType === 'area' ? (
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                          <RechartsXAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                          <RechartsYAxis stroke="#888888" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 11 }} />
                          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                          <Area type="monotone" dataKey="value" stroke={palette.stroke} fill={palette.area} strokeWidth={2} name={`${yAxisKey} (${aggregation})`} />
                        </AreaChart>
                      ) : chartType === 'pie' ? (
                        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 11 }} />
                          <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                              nameKey="name"
                            >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={palette.gradient[index % palette.gradient.length]} />
                            ))}
                          </Pie>
                          <Legend wrapperStyle={{ fontSize: 10, maxHeight: 80, overflow: 'auto' }} />
                        </PieChart>
                      ) : (
                        /* Default BAR Chart */
                        <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                          <RechartsXAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                          <RechartsYAxis stroke="#888888" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 11 }} />
                          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                          <Bar dataKey="value" fill={palette.bar} radius={[4, 4, 0, 0]} name={`${yAxisKey} (${aggregation})`}>
                            {chartTheme === 'rose' && chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={palette.gradient[index % palette.gradient.length]} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      )}
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="p-3.5 glass-panel border-white/5 flex items-start gap-3 text-[10px] text-slate-400 shadow-sm">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-sans">
                    <b>Tip:</b> If X Axis groups contain duplicates, selection operators (e.g. Average, Sum) combine matched records automatically. Switch to <b>None</b> operator to view row sequences directly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 glass-panel min-h-100 flex flex-col items-center justify-center shadow-md">
                <p className="text-xs text-slate-500 font-mono">Configure groupings and values in the sidebar to generate canvas graphics.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
