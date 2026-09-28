import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
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
  Sparkles,
  Save,
  CheckCircle2,
  Loader2,
  BrainCircuit,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { profile, updateProfileData, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    }
  }, [profile, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await axios.put('/api/profile', formData);
      if (res.data.success) {
        updateProfileData(res.data.profile);
        setSuccessMsg('Profile updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleReRunAnalysis = async () => {
    setLoading(true);
    try {
      await axios.post('/api/analysis');
      navigate('/analysis');
    } catch (err) {
      setErrorMsg('Error generating new analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5 text-purple-400" /> Account Settings & Gap Profile
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            {profile?.name || user?.name || 'Your Profile'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your background history, career hiatus details, and target preferences.
          </p>
        </div>

        <button
          onClick={handleReRunAnalysis}
          disabled={loading}
          className="px-5 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-md flex items-center gap-1.5 shrink-0 transition"
        >
          <BrainCircuit className="w-4 h-4 text-teal-300" /> Re-Analyze with Gemini AI
        </button>
      </div>

      {/* EDIT FORM CARD */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
        {successMsg && (
          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Previous Role Title</label>
              <input
                type="text"
                name="previousRole"
                value={formData.previousRole}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Education</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Previous Industry</label>
              <input
                type="text"
                name="previousIndustry"
                value={formData.previousIndustry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Career Break Duration & Details</label>
              <input
                type="text"
                name="breakDuration"
                value={formData.breakDuration}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Previous Skills (comma-separated)</label>
            <input
              type="text"
              name="previousSkills"
              value={formData.previousSkills}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Interests & Growth Areas</label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Work Type</label>
              <select
                name="preferredWorkType"
                value={formData.preferredWorkType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Flexible">Flexible Hours</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Desired Career Target</label>
              <input
                type="text"
                name="desiredCareer"
                value={formData.desiredCareer}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 shadow-md hover:opacity-95 flex items-center gap-2 transition"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;
