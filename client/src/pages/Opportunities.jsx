import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  Laptop,
  MapPin,
  Star,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  X,
} from 'lucide-react';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, course, internship, job
  const [search, setSearch] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState('all');
  const [selectedOpp, setSelectedOpp] = useState(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/opportunities', {
        params: {
          type: activeTab,
          search: search,
          workType: workTypeFilter,
        },
      });
      if (res.data.success) {
        setOpportunities(res.data.opportunities);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [activeTab, workTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER & SEARCH BAR */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Curated Opportunities for Returners
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Courses, Returnships & Remote Careers
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Explore returnships with built-in mentorship, skill refresh courses, and employers committed to career gap flexibility.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, skill (e.g. React, Python), or company..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-teal-500 hover:opacity-95 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition"
          >
            Search Opportunities
          </button>
        </form>

        {/* FILTER TABS & WORK TYPE DROPDOWN */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Opportunities' },
              { id: 'course', label: 'Courses & Certifications', icon: GraduationCap },
              { id: 'internship', label: 'Returnships / Fellowships', icon: Briefcase },
              { id: 'job', label: 'Full-Time & Remote Jobs', icon: Laptop },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Work Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Work Setup:</span>
            <select
              value={workTypeFilter}
              onChange={(e) => setWorkTypeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Work Types</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

        </div>
      </div>

      {/* OPPORTUNITIES LIST / GRID */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading opportunities...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 max-w-lg mx-auto">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Opportunities Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search or adjusting filters.</p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSearch('');
              setWorkTypeFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp._id}
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      opp.type === 'course'
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        : opp.type === 'internship'
                        ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                        : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    {opp.type === 'internship' ? 'Returnship' : opp.type}
                  </span>

                  {opp.isReturnship && (
                    <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      Gap Friendly
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                  {opp.title}
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-1">{opp.company}</p>

                {/* Location & Work Type */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5 text-slate-500" /> {opp.workType}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {opp.location}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mt-3 line-clamp-3">
                  {opp.description}
                </p>

                {/* Required Skills Tags */}
                {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {opp.requiredSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-teal-300">{opp.stipendOrSalary || opp.duration}</span>

                <button
                  onClick={() => setSelectedOpp(opp)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-indigo-300 font-semibold border border-slate-800 transition flex items-center gap-1"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DETAILED VIEW */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-xl w-full relative animate-fadeIn space-y-5">
            <button
              onClick={() => setSelectedOpp(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                {selectedOpp.type}
              </span>
              <h2 className="text-xl font-bold text-white">{selectedOpp.title}</h2>
              <p className="text-xs text-indigo-300 font-semibold">{selectedOpp.company}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Work Type</span>
                <span className="text-white font-medium">{selectedOpp.workType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="text-white font-medium">{selectedOpp.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Duration / Hours</span>
                <span className="text-white font-medium">{selectedOpp.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Compensation / Fee</span>
                <span className="text-teal-300 font-semibold">{selectedOpp.stipendOrSalary}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white mb-1">Full Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedOpp.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedOpp.requiredSkills?.map((sk, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Rated {selectedOpp.rating || 4.8} / 5.0
              </span>
              <a
                href={selectedOpp.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-teal-500 hover:opacity-95 shadow-md flex items-center gap-1.5"
              >
                Apply / Enroll Now <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Opportunities;
