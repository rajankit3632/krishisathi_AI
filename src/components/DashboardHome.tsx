import React, { useState } from 'react';
import {
  Database,
  Layers,
  Sparkles,
  FileText,
  Languages,
  ArrowRight,
  Upload,
  Brain,
  LineChart,
  PlusCircle,
  Clock,
  Play,
  CheckCircle,
  Info,
  Phone,
  Mail,
  MapPin,
  Send,
  X,
  Award,
  ChevronRight,
  User,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dataset, Report, HistoryItem } from '../types';
import EmptyState from './EmptyState';

// Image assets generated previously
const AGRI_HERO_BG = "/assets/agri_hero_bg_1783871484858.jpg";
const INTRO_FARMER_IMG = "/assets/intro_farmer_1783871502924.jpg";
const SMART_GREENHOUSE_IMG = "/assets/smart_greenhouse_1783871519314.jpg";

interface DashboardHomeProps {
  datasets: Dataset[];
  reports: Report[];
  history: HistoryItem[];
  setActiveTab: (tab: string) => void;
}

interface CropProfile {
  name: string;
  emoji: string;
  soilPh: string;
  water: string;
  temp: string;
  growthTime: string;
  aiTip: string;
}

export default function DashboardHome({
  datasets,
  reports,
  history,
  setActiveTab
}: DashboardHomeProps) {
  const [selectedCrop, setSelectedCrop] = useState<CropProfile | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Compute dynamic stats
  const datasetCount = datasets.length;
  const rowsCount = datasets.reduce((acc, curr) => acc + curr.rowCount, 0);
  const analysesCount = history.length;
  const reportsCount = reports.length;
  const languagesCount = 12;

  const kpis = [
    { label: "Datasets Ingested", value: datasetCount, icon: Database, color: "text-gold", bg: "bg-emerald-950/40" },
    { label: "Records Parsed", value: rowsCount > 0 ? rowsCount.toLocaleString() : "26,700", icon: Layers, color: "text-emerald-400", bg: "bg-emerald-950/40" },
    { label: "Gemma AI Studies", value: analysesCount, icon: Sparkles, color: "text-gold", bg: "bg-emerald-950/40" },
    { label: "Reports Compiled", value: reportsCount, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-950/40" },
    { label: "Bhasha Dialects", value: languagesCount, icon: Languages, color: "text-gold", bg: "bg-emerald-950/40" }
  ];

  const cropCategories: CropProfile[] = [
    { name: "Apple", emoji: "🍎", soilPh: "6.0 - 6.8", water: "Moderate (Even moist)", temp: "15°C - 24°C", growthTime: "3 - 4 years", aiTip: "Prune in late winter to maximize sunlight penetration into the center canopy and boost yield quality." },
    { name: "Blueberry", emoji: "🫐", soilPh: "4.5 - 5.5 (Acidic)", water: "High", temp: "18°C - 26°C", growthTime: "2 - 3 years", aiTip: "Use pine needles or organic sulfur mulch to maintain low soil acidity and protect surface-level roots." },
    { name: "Strawberry", emoji: "🍓", soilPh: "5.5 - 6.5", water: "Frequent (Drip-irrigation)", temp: "15°C - 25°C", growthTime: "12 - 14 weeks", aiTip: "Apply straw bedding underneath fruits to keep them off damp soil, reducing crown rot significantly." },
    { name: "Eggplant", emoji: "🍆", soilPh: "5.5 - 6.8", water: "Consistent deep watering", temp: "21°C - 30°C", growthTime: "70 - 85 days", aiTip: "Provide heavy bamboo stakes early. Eggplants thrive with morning sun and high-potassium organic compost." },
    { name: "Cabbage", emoji: "🥬", soilPh: "6.5 - 7.5", water: "Moderate (Avoid dry spells)", temp: "10°C - 20°C", growthTime: "80 - 100 days", aiTip: "Intercrop with rosemary, mint, or thyme to naturally repel cabbage moths and stabilize soil nitrogen." },
    { name: "Carrot", emoji: "🥕", soilPh: "6.0 - 6.8", water: "Moderate even moisture", temp: "15°C - 21°C", growthTime: "70 - 80 days", aiTip: "Ensure deep tilled sand loam soil. Avoid high nitrogen fertilizers to prevent root splitting or hairy growth." }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({ name: '', phone: '', email: '', message: '' });
    }, 4000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterSuccess(false);
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#060D07] text-slate-100 relative space-y-0 scroll-smooth">
      
      {/* 1. HERO HEADER BANNER SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-16 py-20 overflow-hidden border-b border-emerald-950/30">
        {/* Background Image with sophisticated overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url('${AGRI_HERO_BG}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#060D07] via-[#060D07]/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#060D07] via-transparent to-transparent z-10" />
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-gold/30 text-[10px] text-gold font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold" /> Original & Natural
          </div>
          
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              Agriculture Matter
            </h1>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gold leading-tight">
              Good production
            </h1>
          </div>
          
          <p className="text-xs md:text-sm text-emerald-100/75 leading-relaxed font-sans max-w-xl">
            Empower smallholders, policy administrators, and agricultural scientists. Clean, analyze, and translate crop data instantly using lightweight Gemma AI models with direct dashboard visualizations.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('upload')}
              className="px-6 py-3.5 glass-btn-primary text-xs font-bold tracking-wider uppercase cursor-pointer"
            >
              Discover More
            </button>
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center gap-3 px-6 py-3.5 text-xs text-white hover:text-gold font-bold tracking-wider uppercase bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <Play className="w-3 h-3 fill-gold" />
              </div>
              <span>Watch Video</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC KPI LEDGER (The original metrics features) */}
      <section className="px-8 md:px-16 -mt-10 relative z-30">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="p-5 glass-card hover:bg-emerald-900/10 hover:border-gold/30 transition-all duration-500 flex flex-col justify-between shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] text-emerald-400 font-mono tracking-wider uppercase font-semibold">{kpi.label}</span>
                  <div className={`p-2 rounded-xl ${kpi.bg}`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight font-display">{kpi.value}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTRODUCTION SECTION */}
      <section className="px-8 md:px-16 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Sunlit Farmer Picture */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-2xl overflow-hidden border border-gold/15 shadow-2xl relative">
            <img 
              src={INTRO_FARMER_IMG} 
              alt="Farmer in Field" 
              className="w-full h-112.5 object-cover hover:scale-105 transition duration-700"
            />
            {/* Project complete badge */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-emerald-950/90 border border-gold/20 backdrop-blur-md flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-lg bg-gold/15 flex items-center justify-center text-gold border border-gold/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">
                  {rowsCount > 0 ? rowsCount.toLocaleString() : "26,700"}
                </h4>
                <p className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider font-semibold">
                  Successfully Records Parsed
                </p>
              </div>
            </div>
          </div>
          {/* Accent gold bar */}
          <div className="absolute top-1/4 -left-3 w-1.5 h-24 bg-gold rounded-full hidden md:block" />
        </div>

        {/* Right Side: Introduction copy */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold block">
            Our Introduction
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
            Pure Agriculture and <br/>Organic Form
          </h2>
          <p className="text-gold italic font-serif text-sm">
            "We're Leader in Agriculture Market"
          </p>
          <p className="text-xs text-emerald-100/70 leading-relaxed font-sans">
            KrishiSathi AI delivers robust regional agricultural data analysis by parsing public land records, yield tables, and market pricing sheets. By running lightweight localized AI engines, we extract clean insight audits to help farmers and governments coordinate storage and planting schedules without compromising localized data security.
          </p>
          
          {/* Bullet checkpoints */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-0.5 rounded-full bg-gold/10 text-gold mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Interactive data dashboards with instant visualization</h4>
                <p className="text-[10px] text-emerald-400/80">Convert raw CSV columns to area, bar, and pie charts instantly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-0.5 rounded-full bg-gold/10 text-gold mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Lightweight Gemma model running localized inference</h4>
                <p className="text-[10px] text-emerald-400/80">Analyze agricultural metrics securely server-side without exposure.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-0.5 rounded-full bg-gold/10 text-gold mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Full data security and clean regional translation logs</h4>
                <p className="text-[10px] text-emerald-400/80">Support for multi-dialect prompts with state-level administrative security.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR FOODS AND VEGETABLES (Interactive Crop Statistics) */}
      <section className="px-8 md:px-16 py-20 bg-emerald-950/15 border-y border-emerald-950/20 relative">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold block">
            Popular Foods and Vegetables
          </span>
          <h2 className="text-3xl font-serif font-bold text-white">
            Quality Fruits & Vegetables
          </h2>
          <p className="text-xs text-emerald-100/70">
            Click any premium crop below to view localized soil profiles, moisture levels, and recommended agritech extension advice from KrishiSathi AI.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {cropCategories.map((crop, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCrop(crop)}
              className="p-6 rounded-2xl glass-card border border-white/5 hover:border-gold/30 hover:bg-emerald-950/30 text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer group"
            >
              <span className="text-4xl group-hover:scale-110 transition duration-300">{crop.emoji}</span>
              <span className="text-xs font-semibold text-white group-hover:text-gold transition">{crop.name}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-gold/10 text-gold font-mono uppercase tracking-wider">
                Profile
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. BANNER: AGRICULTURE MATTERS TO THE FUTURE OF BANGLADESH */}
      <section className="relative py-28 px-8 md:px-16 text-center overflow-hidden border-b border-emerald-950/20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${AGRI_HERO_BG}')` }}
        />
        <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-[2px]" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
            Agriculture Matters to the <br/>Future of Bangladesh
          </h2>
          <p className="text-xs text-emerald-200/85 max-w-xl mx-auto leading-relaxed">
            From Sylhet tea terraces to the Delta basins, our soil records direct the nation's crop stability. Watch our overview on integrating dynamic telemetry with state analysis.
          </p>
          <div className="flex justify-center pt-2">
            <button 
              onClick={() => setShowVideoModal(true)}
              className="w-16 h-16 rounded-full bg-gold text-emerald-950 flex items-center justify-center shadow-lg shadow-gold/20 hover:scale-110 transition-all duration-300 cursor-pointer"
              title="Play Video Guide"
            >
              <Play className="w-6 h-6 fill-emerald-950 ml-1" />
            </button>
          </div>
          <p className="text-[10px] text-gold font-serif uppercase tracking-widest block italic">
            Watch The Video
          </p>
        </div>
      </section>

      {/* 6. EXPLORE OUR PROJECTS (The actual database records) */}
      <section className="px-8 md:px-16 py-24 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold block">
              Recently Completed Work
            </span>
            <h2 className="text-3xl font-serif font-bold text-white">
              Explore Our Projects
            </h2>
          </div>
          {datasetCount > 0 && (
            <button
              onClick={() => setActiveTab('datasets')}
              className="text-xs font-semibold text-gold hover:text-white flex items-center gap-1 transition cursor-pointer"
            >
              <span>View Crop Ledgers</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {datasetCount === 0 ? (
          <div className="p-8 rounded-2xl border border-white/5 bg-emerald-950/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[10px] px-2.5 py-1 rounded bg-gold/10 text-gold font-mono uppercase tracking-wider font-semibold">
                No Datasets Uploaded
              </span>
              <h3 className="text-xl font-bold text-white font-display">
                Ingest Your First Crop Yield File
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlock the full power of KrishiSathi AI. Upload your regional soil registries, grain prices, or monsoon rainfall records to auto-populate this projects layout.
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-5 py-2.5 glass-btn-primary text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer"
              >
                <span>Upload Now</span>
                <Upload className="w-4 h-4" />
              </button>
            </div>
            
            {/* Template Projects */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-emerald-950/20 space-y-2">
                <div className="w-10 h-10 rounded bg-gold/10 text-gold flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Dhaka Soil Registry</h4>
                <p className="text-[9px] text-slate-500 font-mono">Template • 520 records</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-emerald-950/20 space-y-2">
                <div className="w-10 h-10 rounded bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <LineChart className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Kharif Yield Report</h4>
                <p className="text-[9px] text-slate-500 font-mono">Template • 1,200 records</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {datasets.slice(0, 4).map((d, index) => (
              <div
                key={d.id}
                onClick={() => setActiveTab('datasets')}
                className="rounded-2xl border border-white/5 bg-emerald-950/20 overflow-hidden hover:border-gold/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-md group"
              >
                <div className="h-44 bg-slate-900 relative">
                  {/* Alternating images */}
                  <img 
                    src={index % 2 === 0 ? SMART_GREENHOUSE_IMG : INTRO_FARMER_IMG} 
                    alt={d.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[9px] px-2.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 font-mono uppercase tracking-wider">
                    {d.type}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-gold transition font-display">{d.name}</h4>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                    <span>{d.rowCount} Records</span>
                    <span>{d.colCount} headers</span>
                  </div>
                  <div className="border-t border-white/5 pt-2.5 flex justify-between items-center text-[9px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(d.uploadDate).toLocaleDateString()}</span>
                    <span className="text-gold">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="px-8 md:px-16 py-20 bg-emerald-950/10 border-t border-emerald-950/20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold block">
            Our Testimonials
          </span>
          <h2 className="text-3xl font-serif font-bold text-white">
            What They're Talking About
          </h2>
          
          <div className="p-8 rounded-2xl glass-card border border-white/5 relative shadow-xl max-w-xl mx-auto">
            <span className="text-6xl text-gold font-serif absolute -top-4 left-6 opacity-35">“</span>
            <p className="text-xs md:text-sm text-emerald-100/90 italic leading-relaxed font-sans pt-4 relative z-10">
              "KrishiSathi AI revolutionized how our regional department processes harvest surveys. The localized Gemma AI translates complex soil chemistry metrics into regional dialect policy briefs instantly, protecting our farmers' production curves."
            </p>
            
            <div className="flex items-center justify-center gap-3.5 mt-6">
              <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold text-xs">
                TG
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Tymon Gibson</h4>
                <p className="text-[10px] text-emerald-400 font-mono">Director of Agritech Co-op</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GET IN TOUCH NOW (Contact Form) */}
      <section className="px-8 md:px-16 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-emerald-950/20">
        
        {/* Left Side: Details */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold block">
            Contact Now
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Get In Touch Now
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Have questions about localized crop deployment, soil health telemetry integration, or hosting enterprise Gemma models? Contact our district agritech specialists immediately.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold border border-gold/25 flex items-center justify-center shrink-0">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Phone</h4>
                <p className="text-xs font-semibold text-white mt-0.5">+880123456789</p>
                <p className="text-xs font-semibold text-white">+880987654321</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold border border-gold/25 flex items-center justify-center shrink-0">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Email</h4>
                <p className="text-xs font-semibold text-white mt-0.5">help@krishisathi.ai</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold border border-gold/25 flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Address</h4>
                <p className="text-xs font-semibold text-white mt-0.5">Road No. 8, Motijheel, Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 rounded-2xl border border-white/5 bg-emerald-950/15 shadow-xl relative">
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase font-mono font-bold">Your Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Monojit Nandy" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none" 
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase font-mono font-bold">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+880..." 
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none" 
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-400 uppercase font-mono font-bold">Your Email</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none" 
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-400 uppercase font-mono font-bold">Your Message</label>
              <textarea 
                rows={4} 
                placeholder="Describe your dataset analysis requirement or question here..." 
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full px-3.5 py-2.5 text-xs glass-input text-white focus:outline-none resize-none" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-hover text-emerald-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition shadow-lg"
            >
              Send Message
            </button>
          </form>

          {/* Success toast notification inside the form panel */}
          <AnimatePresence>
            {contactSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-x-8 bottom-8 p-4 bg-emerald-900 border border-gold/40 text-gold text-xs rounded-xl flex items-center gap-3 shadow-xl backdrop-blur-md"
              >
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="font-bold">Message Submitted Successfully!</h4>
                  <p className="text-[10px] text-white/90">Our agritech administrators will respond to your email shortly.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 9. MARKETING HERO LEAD BOARD BANNER */}
      <section className="px-8 md:px-16 py-12 bg-gradient-to-r from-emerald-950 to-[#0F2013] border-t border-emerald-950/20 text-center flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-left space-y-1">
          <h3 className="text-xl font-serif font-semibold text-white">We are Leader in Agriculture Market</h3>
          <p className="text-[11px] text-emerald-300">Integrate dynamic telemetry with regional language translations with KrishiSathi AI today.</p>
        </div>
        <button 
          onClick={() => setActiveTab('ai-studio')}
          className="px-6 py-3 rounded-xl bg-gold text-emerald-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-hover transition cursor-pointer"
        >
          Discover More
        </button>
      </section>

      {/* 10. FOOTER SECTION */}
      <footer className="px-8 md:px-16 py-16 bg-[#030704] border-t border-emerald-950/30 text-xs text-slate-400">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold border border-gold/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-white">KrishiSathi AI</h2>
            </div>
            <p className="text-[11px] text-emerald-100/60 leading-relaxed">
              Premium localized agriculture analytics ledger powered by micro Gemma AI. Accelerating national crop intelligence with secure dataset storage and dynamic charting.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-4">Useful Links</h4>
            <ul className="space-y-2.5 text-[11px] text-slate-400">
              <li><button onClick={() => setActiveTab('upload')} className="hover:text-gold transition text-left">Upload Soil & Yield Files</button></li>
              <li><button onClick={() => setActiveTab('ai-studio')} className="hover:text-gold transition text-left">Gemma AI Query Studio</button></li>
              <li><button onClick={() => setActiveTab('visualizations')} className="hover:text-gold transition text-left">Interactive Recharts Studio</button></li>
              <li><button onClick={() => setActiveTab('reports')} className="hover:text-gold transition text-left">PDF policy report generation</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-4">Our Dialects</h4>
            <ul className="space-y-2 text-[11px]">
              <li><span className="text-emerald-400">Bangla (বাংলা)</span> - Primary Support</li>
              <li>Hindi (हिन्दी)</li>
              <li>Tamil (தமிழ்)</li>
              <li>Telugu (తెలుగు)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Newsletter</h4>
            <p className="text-[11px] text-emerald-100/60">Subscribe to get monthly soil reports and crop guidelines.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter Email Address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-xs glass-input focus:outline-none"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-gold text-emerald-950 font-bold text-xs rounded-xl hover:bg-gold-hover transition cursor-pointer"
              >
                Go
              </button>
            </form>
            
            {newsletterSuccess && (
              <p className="text-[10px] text-gold font-mono animate-fade-in">✓ Subscribed successfully!</p>
            )}
          </div>
        </div>

        <div className="border-t border-emerald-950/20 mt-12 pt-6 flex flex-col md:flex-row justify-between text-[10px] text-slate-500 font-mono">
          <p>© 2026 KrishiSathi AI, All Rights Reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>Terms & Conditions</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>

      {/* CROP DETAIL AI INTELLIGENCE POPUP DIALOG (MODAL) */}
      <AnimatePresence>
        {selectedCrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg glass-card p-6 border-gold/40 relative bg-[#0B1A10] space-y-4 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedCrop(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <span className="text-5xl">{selectedCrop.emoji}</span>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">{selectedCrop.name} Intelligence Profile</h3>
                  <p className="text-[10px] text-gold font-mono tracking-wider uppercase font-semibold">Localized AI Growth Guidelines</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-white/5">
                  <h4 className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider">Ideal Soil pH</h4>
                  <p className="text-sm font-bold text-white mt-1">{selectedCrop.soilPh}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-white/5">
                  <h4 className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider">Water Level</h4>
                  <p className="text-sm font-bold text-white mt-1">{selectedCrop.water}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-white/5">
                  <h4 className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider">Temperature Envelope</h4>
                  <p className="text-sm font-bold text-white mt-1">{selectedCrop.temp}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-white/5">
                  <h4 className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider">Average Growth Time</h4>
                  <p className="text-sm font-bold text-white mt-1">{selectedCrop.growthTime}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gold/10 border border-gold/20 flex gap-3 text-xs leading-relaxed text-emerald-100">
                <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gold mb-1">Gemma AI Smart Extension Recommendation</h4>
                  <p>{selectedCrop.aiTip}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setSelectedCrop(null)}
                  className="px-5 py-2 rounded-xl bg-white/5 text-xs text-white hover:bg-white/10"
                >
                  Close Profile
                </button>
                <button 
                  onClick={() => {
                    setSelectedCrop(null);
                    setActiveTab('ai-studio');
                  }}
                  className="px-5 py-2 rounded-xl bg-gold text-emerald-950 font-bold text-xs"
                >
                  Consult Gemma
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TUTORIAL VIDEO POPUP DIALOG (MODAL) */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl glass-card p-6 border-gold/40 relative bg-[#0B1A10] space-y-4 shadow-2xl"
            >
              <button 
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xl font-serif font-bold text-white">How KrishiSathi AI Empowers Agriculture</h3>
                <p className="text-[10px] text-gold font-mono tracking-wider uppercase">Interactive Demonstration Guide</p>
              </div>

              {/* Simulated Interactive Video Screen with rich visuals */}
              <div className="aspect-video w-full rounded-xl bg-emerald-950/40 relative overflow-hidden flex flex-col justify-between p-6 border border-white/10">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-65"
                  style={{ backgroundImage: `url('${AGRI_HERO_BG}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent z-10" />

                {/* Video Info Overlay */}
                <div className="relative z-20 flex justify-between items-start">
                  <span className="text-[9px] px-2 py-1 rounded bg-gold text-emerald-950 font-mono font-bold uppercase">Streaming live</span>
                  <span className="text-[10px] text-slate-300 font-mono">Ch. 01 • KrishiSathi AI Intro</span>
                </div>

                <div className="relative z-20 flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gold text-emerald-950 flex items-center justify-center animate-ping absolute opacity-20" />
                  <div className="w-12 h-12 rounded-full bg-gold text-emerald-950 flex items-center justify-center shadow-lg relative z-10">
                    <Heart className="w-5 h-5 fill-emerald-950" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-4 font-display">Soil Metrics & Microclimate Forecast</h4>
                  <p className="text-[10px] text-emerald-300 mt-1 max-w-sm">Learn to map regional soil nitrogen ratios & nitrogen recommendations.</p>
                </div>

                <div className="relative z-20 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>02:45 / 08:30</span>
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-emerald-100/80 leading-relaxed font-sans">
                This presentation highlights how the KrishiSathi model extracts local crop disease trends, integrates soil database queries, and compiles safe, non-hallucinatory agronomy summaries in major regional Indian and Bangladeshi languages.
              </p>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-gold text-emerald-950 font-bold text-xs"
                >
                  Got It, Thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
