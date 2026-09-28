import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-teal-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">She<span className="gradient-text">Back</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering women returning to tech, business, and education after a career break with AI-driven skill mapping, personalized roadmaps, and returnships.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/analysis" className="hover:text-white transition">Career Gap Analysis</Link></li>
            <li><Link to="/opportunities" className="hover:text-white transition">Returnships & Remote Jobs</Link></li>
            <li><Link to="/roadmap" className="hover:text-white transition">Personalized Roadmap</Link></li>
            <li><Link to="/onboarding" className="hover:text-white transition">Skills Audit</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white flex items-center gap-1 transition">Returnee Success Stories <ArrowUpRight className="w-3 h-3" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1 transition">Resume Gap Templates <ArrowUpRight className="w-3 h-3" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1 transition">Peer Mentorship Network <ArrowUpRight className="w-3 h-3" /></a></li>
            <li><a href="#" className="hover:text-white flex items-center gap-1 transition">Partner Employers <ArrowUpRight className="w-3 h-3" /></a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Empowered by Gemini AI</h4>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Confidential & Inclusive
            </div>
            <p className="text-[11px] text-slate-400">
              SheBack respects your privacy. Your career gap is recognized as a period of life experience & growth.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 SheBack Platform. Built with React, Node.js & Gemini AI.</p>
        <p className="flex items-center gap-1">
          Designed for women returning to tech & leadership <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
