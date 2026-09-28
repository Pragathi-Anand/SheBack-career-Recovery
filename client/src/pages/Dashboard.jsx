import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  LayoutDashboard,
  BrainCircuit,
  Briefcase,
  Compass,
  User,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [roadmapProgress, setRoadmapProgress] = useState(25);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [rmRes, oppRes] = await Promise.all([
          axios.get('/api/roadmap').catch(() => ({ data: {} })),
          axios.get('/api/opportunities?type=all').catch(() => ({ data: {} })),
        ]);

        if (rmRes.data?.roadmap) {
          setRoadmapProgress(rmRes.data.roadmap.overallProgress || 25);
        }
        if (oppRes.data?.opportunities) {
          setOpportunities(oppRes.data.opportunities.slice(0, 3));
        }
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err.message);
      }
    };

    loadDashboardData();
  }, []);

  const analysis = profile?.careerAnalysis;
  const transferableSkills = analysis?.transferableSkills || [
    { skill: 'Project Leadership', relevance: 'Proven ability to coordinate multi-stage objectives.' },
    { skill: 'Problem Solving', relevance: 'Analytical approach to complex tasks.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* WELCOME HERO */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to SheBack Gap Recovery
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Hello, <span className="gradient-text">{profile?.name || user?.name || 'Welcome'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Targeting: <span className="text-teal-300 font-semibold">{profile?.desiredCareer || 'Career Gap Re-entry'}</span> • {profile?.yearsOfExperience || 3} Years Experience • {profile?.breakDuration || 'Break Hiatus'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/analysis"
              className="px-6 py-3 rounded-full font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/30 hover:opacity-95 transition flex items-center gap-1.5"
            >
              <BrainCircuit className="w-4 h-4" /> View AI Analysis
            </Link>
            <Link
              to="/profile"
              className="px-4 py-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* METRICS & DASHBOARD STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Roadmap Readiness</span>
            <Compass className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white gradient-text">{roadmapProgress}%</div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full" style={{ width: `${roadmapProgress}%` }} />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Transferable Skills</span>
            <Award className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{transferableSkills.length} Verified</div>
          <p className="text-[11px] text-slate-400">Mapped from prior experience</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Target Matches</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">12+ Roles</div>
          <p className="text-[11px] text-slate-400">Returnships & remote jobs</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Recovery Phase</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-300">Phase 1</div>
          <p className="text-[11px] text-slate-400">Skill refresh & portfolio</p>
        </div>
      </div>

      {/* QUICK CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Transferable Skills & Strengths */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" /> Key Transferable Skills
              </h3>
              <Link to="/analysis" className="text-xs text-indigo-300 font-semibold hover:underline flex items-center gap-1">
                Full AI Audit <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {transferableSkills.map((sk, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <span className="text-xs font-bold text-white block">{sk.skill}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{sk.relevance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Roadmap Shortcut Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-teal-500/30 bg-slate-900/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-400" /> Active 12-Week Gap Recovery Plan
              </h3>
              <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
                {roadmapProgress}% Completed
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Phase 1 focus: Rebuild technical competencies and configure portfolio projects.
            </p>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-full transition shadow-md"
            >
              Continue Milestones <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Top Curated Returnships */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" /> Curated Returnships
            </h3>
            <Link to="/opportunities" className="text-xs text-purple-300 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div key={opp._id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded">
                  {opp.type}
                </span>
                <h4 className="text-xs font-bold text-white mt-1">{opp.title}</h4>
                <p className="text-[11px] text-slate-400">{opp.company} • {opp.workType}</p>
                <div className="pt-2 text-right">
                  <Link to="/opportunities" className="text-[11px] font-semibold text-indigo-400 hover:underline inline-flex items-center gap-1">
                    Details <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
