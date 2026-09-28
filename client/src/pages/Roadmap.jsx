import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Users,
  Award,
  Sparkles,
  Loader2,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

const Roadmap = () => {
  const { profile } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const fetchRoadmap = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/roadmap');
      if (res.data.success && res.data.roadmap) {
        setRoadmap(res.data.roadmap);
      } else {
        setError('Roadmap data is currently unavailable.');
      }
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      setError(err.response?.data?.message || 'Unable to load personalized roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const toggleMilestone = async (phaseIndex, milestoneIndex, currentCompleted) => {
    setUpdating(true);
    try {
      const res = await axios.put('/api/roadmap/milestone', {
        phaseIndex,
        milestoneIndex,
        completed: !currentCompleted,
      });
      if (res.data.success) {
        setRoadmap(res.data.roadmap);
      }
    } catch (err) {
      console.error('Error updating milestone:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
        <p className="text-xs text-slate-400">Loading your personalized roadmap...</p>
      </div>
    );
  }

  const phases = roadmap?.phases || [];
  const progress = roadmap?.overallProgress || 0;

  if (!roadmap || phases.length === 0) {
    return (
      <div className="min-h-[75vh] bg-slate-950 flex flex-col items-center justify-center px-4 max-w-md mx-auto text-center">
        <Compass className="w-12 h-12 text-teal-400 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white mb-2">No Roadmap Generated Yet</h3>
        <p className="text-xs text-slate-400 mb-6">
          {error || 'Complete your Career Gap Audit to automatically generate your personalized 12-week recovery roadmap.'}
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/analysis"
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition"
          >
            Run Career Analysis
          </Link>
          <button
            onClick={fetchRoadmap}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* HEADER & PROGRESS GAUGE */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> 12-Week AI Recovery Plan
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Personalized Career Gap Roadmap
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Targeting Role: <span className="text-indigo-300 font-semibold">{roadmap?.targetRole || profile?.desiredCareer || 'Career Re-entry'}</span>. Complete milestones to build momentum.
          </p>
        </div>

        {/* Overall Progress Gauge */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-6 shrink-0">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="8" fill="transparent" />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - progress / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-base font-extrabold text-white">{progress}%</span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Overall Readiness</h4>
            <p className="text-xs text-slate-400">Track weekly progress</p>
            <span className="inline-block mt-2 text-[10px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md">
              {progress >= 75 ? 'Ready to Apply' : progress >= 40 ? 'In Progress' : 'Getting Started'}
            </span>
          </div>
        </div>
      </div>

      {/* ROADMAP TIMELINE PHASES */}
      <div className="space-y-8">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" /> Milestone Phases
        </h2>

        <div className="space-y-6">
          {phases.map((phase, phaseIdx) => (
            <div key={phase._id || phaseIdx} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              
              {/* Phase Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center font-extrabold text-white text-sm shadow-md">
                    P{phase.phaseNumber || phaseIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                    <p className="text-xs text-slate-400">{phase.description}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30 self-start sm:self-center">
                  <Clock className="w-3.5 h-3.5 inline mr-1" /> {phase.duration}
                </span>
              </div>

              {/* Milestones Checkbox List */}
              <div className="space-y-3">
                {phase.milestones?.map((m, mIdx) => (
                  <div
                    key={m._id || mIdx}
                    onClick={() => toggleMilestone(phaseIdx, mIdx, m.completed)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                      m.completed
                        ? 'bg-slate-900/40 border-teal-500/30 text-slate-300'
                        : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/40 text-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-teal-400 shrink-0">
                        {m.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-teal-500/20 text-teal-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${m.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {m.title}
                        </h4>
                        {m.description && <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {m.type || 'task'}
                      </span>
                      {m.resourceLink && m.resourceLink !== '#' && (
                        <Link
                          to={m.resourceLink}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] flex items-center gap-1"
                        >
                          Resource <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDED RETURNEE MENTORS */}
      {roadmap?.recommendedMentors && roadmap.recommendedMentors.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" /> Returnee Mentor Connections
            </h2>
            <span className="text-xs text-slate-400">1-on-1 Guidance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.recommendedMentors.map((mentor, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl border border-slate-800 flex items-start gap-4">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-teal-500/40 shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">{mentor.name}</h4>
                  <p className="text-xs text-indigo-300 font-semibold">{mentor.role} @ {mentor.company}</p>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">{mentor.bio}</p>
                  
                  <button
                    onClick={() => alert(`Connection request sent to ${mentor.name}! They will reach out via email.`)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 transition"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Request Mentorship Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Roadmap;
