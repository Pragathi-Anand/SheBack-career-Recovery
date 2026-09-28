import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Target,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Compass,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const stats = [
    { label: 'Women Helped Back to Work', value: '12,400+' },
    { label: 'Average Gap Duration', value: '2.4 Years' },
    { label: 'Returnship Success Rate', value: '88%' },
    { label: 'Partner Employers', value: '350+' },
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: 'Gemini AI Career Analysis',
      description: 'Translates past accomplishments and life gap experience into transferable modern competencies.',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: Compass,
      title: 'Personalized Gap Roadmaps',
      description: 'Step-by-step 12-week action plan tailored to your target role, bridge courses, and speed.',
      color: 'from-indigo-500 to-teal-500',
    },
    {
      icon: Briefcase,
      title: 'Curated Returnships & Remote Jobs',
      description: 'Direct access to employers actively seeking returning professionals with flexible schedules.',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      icon: Target,
      title: 'Targeted Skill Bridge Courses',
      description: 'Fast-track short certifications in React, Data, AI, and Product Management.',
      color: 'from-rose-500 to-purple-600',
    },
  ];

  const testimonials = [
    {
      name: 'Ananya Roy',
      role: 'Senior Product Manager @ Meta',
      break: '3 Year Parenting Break',
      quote: 'SheBack re-framed my parenting break as a masterclass in risk management and negotiation. The AI roadmap got me job-ready in 8 weeks.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Full Stack Engineer @ Stripe',
      break: '2 Year Caregiving Hiatus',
      quote: 'The returnship search filtered out non-flexible employers. I found a paid fellowship that converted to full-time remote engineering!',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-teal-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-md shadow-inner">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Empowering Your Career Gap Recovery Journey</span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          Your Career Break is a <span className="gradient-text">Pause</span>, Not an Ending.
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          SheBack uses Gemini AI to convert your previous work history and break experience into transferable strengths, personalized roadmaps, and paid returnship opportunities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 text-white shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Go to Your Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 text-white shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Analyze Your Career Gap <Sparkles className="w-5 h-5 text-teal-300" />
              </Link>
              <Link
                to="/opportunities"
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2"
              >
                Explore Returnships
              </Link>
            </>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-5 rounded-2xl border border-slate-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS / FEATURES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/40 border-y border-slate-800/60 rounded-3xl mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Designed to Bridge the Gap with <span className="gradient-text-teal">Precision</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            No generic advice. SheBack combines AI intelligence with curated returnee employers to build your confidence and job readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl hover:border-indigo-500/40 transition group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Real Returnee Stories</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Women Who Reclaimed Their Careers</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 relative">
              <div className="flex items-center gap-4 mb-6">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/50" />
                <div>
                  <h4 className="text-base font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{t.role}</p>
                  <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {t.break}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-16">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to Take Your Next Step?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join thousands of women turning career breaks into competitive advantages. It takes under 3 minutes to start your onboarding profile.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 transition-transform"
          >
            Start Your Gap Recovery Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Landing;
