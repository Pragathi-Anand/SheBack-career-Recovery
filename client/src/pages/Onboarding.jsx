import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Clock,
  Building2,
  Calendar,
  Wrench,
  Heart,
  Laptop,
  MapPin,
  Target,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const Onboarding = () => {
  const { profile, updateProfileData, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    previousRole: '',
    education: '',
    yearsOfExperience: '',
    previousIndustry: '',
    breakDuration: '',
    previousSkills: '',
    interests: '',
    preferredWorkType: 'Remote',
    preferredLocation: 'Flexible',
    desiredCareer: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || user?.name || '',
        previousRole: profile.previousRole || '',
        education: profile.education || '',
        yearsOfExperience: profile.yearsOfExperience || '',
        previousIndustry: profile.previousIndustry || '',
        breakDuration: profile.breakDuration || '',
        previousSkills: Array.isArray(profile.previousSkills) ? profile.previousSkills.join(', ') : profile.previousSkills || '',
        interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests || '',
        preferredWorkType: profile.preferredWorkType || 'Remote',
        preferredLocation: profile.preferredLocation || 'Flexible',
        desiredCareer: profile.desiredCareer || '',
      });
    } else if (user?.name) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, [profile, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleQuickPreset = (role) => {
    if (role === 'software') {
      setFormData({
        name: formData.name || 'Sofia Vance',
        previousRole: 'Junior Frontend Developer',
        education: 'B.S. Computer Science',
        yearsOfExperience: '3',
        previousIndustry: 'Technology & Software',
        breakDuration: '2.5 years (Parenting Break)',
        previousSkills: 'JavaScript, React, HTML/CSS, Git, REST APIs',
        interests: 'Full Stack Web Development, Cloud Architecture, Open Source',
        preferredWorkType: 'Remote',
        preferredLocation: 'Flexible',
        desiredCareer: 'Full Stack React Developer',
      });
    } else if (role === 'product') {
      setFormData({
        name: formData.name || 'Rachel Chen',
        previousRole: 'Associate Project Manager',
        education: 'B.A. Business Administration',
        yearsOfExperience: '4',
        previousIndustry: 'Corporate Services & Marketing',
        breakDuration: '3 years (Family Caregiving)',
        previousSkills: 'Project Planning, Agile/Scrum, Communication, Jira, Budgeting',
        interests: 'Product Strategy, Tech Returnships, User Experience',
        preferredWorkType: 'Hybrid',
        preferredLocation: 'Remote / Major City',
        desiredCareer: 'Product Manager',
      });
    }
  };

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.previousRole || !formData.education || !formData.yearsOfExperience) {
        setError('Please fill in all background fields.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.previousIndustry || !formData.breakDuration || !formData.previousSkills) {
        setError('Please complete industry, career break, and previous skills.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.desiredCareer) {
        setError('Please specify your desired career target.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setLoading(true);
    setError('');

    try {
      // 1. Update Profile
      const profileRes = await axios.put('/api/profile', formData);
      if (profileRes.data.success) {
        updateProfileData(profileRes.data.profile);

        // 2. Trigger Gemini AI Analysis
        setAnalyzing(true);
        await axios.post('/api/analysis');

        // 3. Navigate to Analysis Page
        navigate('/analysis');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please check all fields.');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-teal-400" /> Career Gap Audit & Profile Onboarding
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Tell Us About Your Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2">
          Your responses allow Gemini AI to map your transferable skills, pinpoint readiness gaps, and curate returnship pathways.
        </p>

        {/* Preset Quick Fill helper */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-[11px] text-slate-400">Quick Fill Sample Profile:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('software')}
            className="text-[11px] px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500 text-indigo-300 transition"
          >
            + Software Engineer Sample
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('product')}
            className="text-[11px] px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-teal-500 text-teal-300 transition"
          >
            + Product Manager Sample
          </button>
        </div>
      </div>

      {/* STEP INDICATOR BAR */}
      <div className="mb-10 max-w-xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
          
          {[
            { num: 1, label: 'Background' },
            { num: 2, label: 'Gap & Skills' },
            { num: 3, label: 'Career Target' },
          ].map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25'
                      : isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-slate-950'
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-[11px] mt-2 font-medium ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FORM CARD */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: BACKGROUND & EXPERIENCE */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" /> Step 1: Background & Prior Experience
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Maria Gonzalez"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Previous Role / Job Title</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="previousRole"
                      value={formData.previousRole}
                      onChange={handleChange}
                      placeholder="e.g. Frontend Engineer / Marketing Specialist"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Highest Education Level</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="e.g. Bachelor in Computer Science / Master in Business"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Years of Professional Experience</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      placeholder="e.g. 4"
                      min="0"
                      max="40"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GAP DETAILS & SKILLS */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-400" /> Step 2: Industry, Career Break & Skills
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Previous Industry</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="previousIndustry"
                      value={formData.previousIndustry}
                      onChange={handleChange}
                      placeholder="e.g. Technology / Finance / Healthcare"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Career Break Duration & Context</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="breakDuration"
                      value={formData.breakDuration}
                      onChange={handleChange}
                      placeholder="e.g. 2.5 Years (Parenting / Health / Education)"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Previous Skills (comma-separated)
                </label>
                <div className="relative">
                  <Wrench className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="previousSkills"
                    value={formData.previousSkills}
                    onChange={handleChange}
                    placeholder="e.g. JavaScript, React, Project Management, SQL, Team Coordination"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Interests & Growth Areas
                </label>
                <div className="relative">
                  <Heart className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="e.g. Generative AI, Cloud Systems, Product Strategy, Mentorship"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERENCES & TARGET CAREER */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" /> Step 3: Work Preferences & Desired Career
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Work Type</label>
                  <div className="relative">
                    <Laptop className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <select
                      name="preferredWorkType"
                      value={formData.preferredWorkType}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                      <option value="Flexible">Flexible Hours</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Full-time">Full-time</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                      placeholder="e.g. Remote / New York, NY / Flexible"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Desired Career / Target Role
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="desiredCareer"
                    value={formData.desiredCareer}
                    onChange={handleChange}
                    placeholder="e.g. Full-Stack Web Developer / Product Manager / Data Analyst"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || analyzing}
                className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 hover:opacity-95 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-teal-300" /> Generating Gemini AI Analysis...
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Profile...
                  </>
                ) : (
                  <>
                    Generate AI Career Analysis <Sparkles className="w-4 h-4 text-teal-300" />
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default Onboarding;
