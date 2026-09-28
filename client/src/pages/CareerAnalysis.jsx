import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Sparkles,
  BrainCircuit,
  Award,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Briefcase,
  GraduationCap,
  ArrowRight,
  RefreshCw,
  Loader2,
  ExternalLink,
  Target,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const CareerAnalysis = () => {
  const { profile, updateProfileData } = useAuth();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(profile?.careerAnalysis || null);
  const [loading, setLoading] = useState(!profile?.careerAnalysis);
  const [error, setError] = useState('');

  const fetchAnalysis = async (force = false) => {
    setLoading(true);
    setError('');
    try {
      const res = force
        ? await axios.post('/api/analysis?force=true')
        : await axios.get('/api/analysis');

      if (res.data.success && res.data.analysis) {
        setAnalysis(res.data.analysis);
        if (profile) {
          updateProfileData({ ...profile, careerAnalysis: res.data.analysis });
        }
      }
    } catch (err) {
      if (!force && err.response?.status === 404) {
        try {
          const postRes = await axios.post('/api/analysis');
          if (postRes.data.success && postRes.data.analysis) {
            setAnalysis(postRes.data.analysis);
            if (profile) {
              updateProfileData({ ...profile, careerAnalysis: postRes.data.analysis });
            }
            return;
          }
        } catch (postErr) {
          setError(postErr.response?.data?.message || 'Failed to generate career analysis.');
          return;
        }
      }
      setError(err.response?.data?.message || 'Failed to fetch career analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile?.careerAnalysis) {
      fetchAnalysis();
    } else {
      setAnalysis(profile.careerAnalysis);
      setLoading(false);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-slate-950 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 animate-pulse">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Career Gap Profile</h2>
        <p className="text-xs text-slate-400 text-center max-w-md mb-6">
          Gemini AI is generating your transferable skills audit, career match scores, and 12-week roadmap...
        </p>
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-[75vh] bg-slate-950 flex flex-col items-center justify-center px-4 max-w-md mx-auto text-center">
        <AlertTriangle className="w-12 h-12 text-rose-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Analysis Available Yet</h3>
        <p className="text-xs text-slate-400 mb-6">{error || 'Please complete your onboarding profile first.'}</p>
        <Link
          to="/onboarding"
          className="px-6 py-3 rounded-full text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition"
        >
          Go to Onboarding Form
        </Link>
      </div>
    );
  }

  // Chart Data for Career Path Matches
  const careerMatchData = (analysis.recommendedCareerPaths || []).map((cp) => ({
    name: cp.roleTitle,
    match: cp.matchPercentage || 85,
  }));

  const COLORS = ['#6366f1', '#10b981', '#a855f7', '#f43f5e'];

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini AI
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Career Gap Audit & Strategy Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tailored analysis for <span className="text-indigo-300 font-semibold">{profile?.name || 'Candidate'}</span> aiming for{' '}
            <span className="text-teal-300 font-semibold">{profile?.desiredCareer || 'Target Career'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAnalysis(true)}
            className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-run AI Analysis
          </button>
          <Link
            to="/roadmap"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:opacity-95 transition flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" /> View Interactive Roadmap
          </Link>
        </div>
      </div>

      {/* TOP SUMMARY ROW: TRANSFERABLE SKILLS & EXISTING STRENGTHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Transferable Skills */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" /> Transferable Skills Audit
            </h3>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              {(analysis.transferableSkills || []).length} Highlighted
            </span>
          </div>

          <div className="space-y-3">
            {(analysis.transferableSkills || []).map((sk, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{sk.skill}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {sk.category || 'Competency'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{sk.relevance}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Existing Strengths */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" /> Core Strengths & Experience
            </h3>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
              Verified Assets
            </span>
          </div>

          <div className="space-y-3">
            {(analysis.existingStrengths || []).map((str, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{str}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SKILL GAPS & CAREER MATCH CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Skill Gaps */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="border-b border-slate-800/80 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Identified Skill Gaps & Action Items
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Targeted updates needed to bridge modern industry standards.
            </p>
          </div>

          <div className="space-y-3">
            {(analysis.skillGaps || []).map((gap, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{gap.skill}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        gap.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {gap.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{gap.recommendedAction}</p>
                </div>

                <Link
                  to="/opportunities"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium shrink-0 text-center transition"
                >
                  Find Refresher Course
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Career Path Visual Match Chart */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" /> Role Match Ratings
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Match calculation based on background & gap recovery potential.</p>
            
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={careerMatchData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} />
                  <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={10} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Bar dataKey="match" radius={[0, 8, 8, 0]}>
                    {careerMatchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
            <span className="text-xs text-teal-400 font-semibold">
              Highest Match: {careerMatchData[0]?.name || profile?.desiredCareer} ({careerMatchData[0]?.match || 92}%)
            </span>
          </div>
        </div>
      </div>

      {/* 5. RECOMMENDED CAREER PATHS DETAILED CARDS */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" /> Recommended Career Pathways
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(analysis.recommendedCareerPaths || []).map((cp, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-white">{cp.roleTitle}</h4>
                  <span className="text-xs font-extrabold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/30">
                    {cp.matchPercentage}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{cp.rationale}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1">
                <div className="text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Salary Range:</span>
                  <span className="text-indigo-300 font-semibold">{cp.expectedSalaryRange}</span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Growth Outlook:</span>
                  <span className="text-teal-400 font-semibold">{cp.growthPotential}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. RECOMMENDED COURSES, INTERNSHIPS & JOBS TABS / GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recommended Courses */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <GraduationCap className="w-5 h-5 text-indigo-400" /> Bridge Courses
          </h4>

          <div className="space-y-3">
            {(analysis.recommendedCourses || []).map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.title}</span>
                  <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">{c.duration}</span>
                </div>
                <p className="text-[11px] text-slate-400">{c.focusArea}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                  <span>Platform: {c.platform}</span>
                  <Link to="/opportunities" className="text-teal-400 font-medium hover:underline flex items-center gap-0.5">
                    View Course <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Returnships */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Briefcase className="w-5 h-5 text-teal-400" /> Recommended Returnships
          </h4>

          <div className="space-y-3">
            {(analysis.recommendedInternships || []).map((intern, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{intern.title}</span>
                  <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded">{intern.stipend}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">{intern.company} • {intern.workType}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{intern.description}</p>
                <div className="pt-1 text-right">
                  <Link to="/opportunities" className="text-indigo-400 text-[10px] font-medium hover:underline inline-flex items-center gap-0.5">
                    Apply Now <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Briefcase className="w-5 h-5 text-purple-400" /> Direct Job Matches
          </h4>

          <div className="space-y-3">
            {(analysis.recommendedJobs || []).map((job, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{job.title}</span>
                  <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">{job.salary}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">{job.company} • {job.workType}</p>
                <p className="text-[11px] text-slate-400">{job.reason}</p>
                <div className="pt-1 text-right">
                  <Link to="/opportunities" className="text-teal-400 text-[10px] font-medium hover:underline inline-flex items-center gap-0.5">
                    View Posting <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ROADMAP ACTION CARD */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 text-center bg-gradient-to-r from-indigo-950/60 to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left space-y-1">
          <h3 className="text-xl font-extrabold text-white">Your Step-by-Step Recovery Roadmap is Ready</h3>
          <p className="text-xs text-slate-400">
            Track weekly milestones, complete bridge projects, and connect with mentors.
          </p>
        </div>
        <Link
          to="/roadmap"
          className="px-8 py-3.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 shadow-lg shadow-indigo-600/30 hover:scale-105 transition shrink-0"
        >
          Open 12-Week Roadmap
        </Link>
      </div>

    </div>
  );
};

export default CareerAnalysis;
