import React from 'react';
import { User, Building2, MapPin, Mail, Award, BookOpen, ShieldCheck } from 'lucide-react';

export default function ProfileTab() {
  const profile = {
    name: "Dr. Rajeshwar Sharma",
    role: "Senior Policy Analyst & Data Auditor",
    department: "Department of Administrative Reforms & Public Grievances",
    organization: "National Informatics Centre (NIC) / NITI Aayog",
    location: "New Delhi, India",
    email: "rajeshwar.sharma@nic.in",
    clearanceLevel: "L3 Administrative Audit Clearance",
    bio: "Focused on translating district-level multi-sectoral metrics into clear policy models. Conducting regional agricultural yield reviews, drinking water reach profiles, and healthcare facility allocations."
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
          <User className="w-5 h-5 text-indigo-400" /> Administrative Profile
        </h2>
        <p className="text-xs text-slate-400">
          Review credentials, organization nodes, and clearances associated with this intelligence workspace.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="p-6 glass-panel space-y-6 relative overflow-hidden shadow-md">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Profile header visual badge */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-linear-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-indigo-500/10 shrink-0">
              RS
            </div>

            <div className="text-center md:text-left space-y-1">
              <h3 className="text-md font-bold text-white tracking-tight font-display">
                {profile.name}
              </h3>
              <p className="text-xs text-indigo-400 font-mono font-semibold">
                {profile.role}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-[10px] text-slate-400 font-mono pt-1">
                <span className="flex items-center gap-1 font-semibold"><Building2 className="w-3.5 h-3.5" /> {profile.organization}</span>
                <span className="flex items-center gap-1 font-semibold"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
              </div>
            </div>
          </div>

          {/* Details list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-5">
            <div className="space-y-1.5 p-4 glass-card shadow-sm">
              <span className="text-[9px] text-slate-400 font-mono uppercase font-semibold">Department Node</span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{profile.department}</p>
            </div>

            <div className="space-y-1.5 p-4 glass-card shadow-sm">
              <span className="text-[9px] text-slate-400 font-mono uppercase font-semibold">Government Email Node</span>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">{profile.email}</p>
            </div>

            <div className="space-y-1.5 p-4 glass-card shadow-sm md:col-span-2">
              <span className="text-[9px] text-slate-400 font-mono uppercase font-semibold">Authorized Clearances</span>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-0.5">
                <ShieldCheck className="w-4 h-4" /> <span>{profile.clearanceLevel}</span>
              </div>
            </div>

            <div className="space-y-1.5 p-4 glass-card shadow-sm md:col-span-2">
              <span className="text-[9px] text-slate-400 font-mono uppercase font-semibold">Planners Directive Agenda</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
