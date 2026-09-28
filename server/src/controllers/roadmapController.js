const mongoose = require('mongoose');
const Roadmap = require('../models/Roadmap');
const Profile = require('../models/Profile');
const { getRoadmaps, getProfiles, saveState } = require('../services/storeService');

const buildDefaultRoadmap = (userId, targetRole) => {
  const defaultPhases = [
    {
      phaseNumber: 1,
      title: 'Phase 1: Self-Assessment & Skill Audit',
      duration: 'Weeks 1-3',
      description: 'Identify transferable skills from pre-break experience and address initial knowledge gaps.',
      milestones: [
        { _id: 'm1', title: 'Complete SheBack Onboarding & AI Skill Assessment', completed: true, type: 'skill', resourceLink: '/onboarding' },
        { _id: 'm2', title: 'Audit top 3 transferable strengths & target role requirements', completed: true, type: 'skill', resourceLink: '/analysis' },
        { _id: 'm3', title: 'Update LinkedIn bio to reflect career break as intentional growth', completed: false, type: 'networking', resourceLink: '/profile' }
      ]
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: Focused Re-Skilling & Hands-On Projects',
      duration: 'Weeks 4-8',
      description: 'Complete top recommended courses and build 2 modern portfolio projects.',
      milestones: [
        { _id: 'm4', title: 'Enroll in recommended domain refresher course', completed: false, type: 'course', resourceLink: '/opportunities' },
        { _id: 'm5', title: 'Complete hands-on capstone project showcasing modern tools', completed: false, type: 'project', resourceLink: '#' },
        { _id: 'm6', title: 'Obtain modern industry certificate (e.g. Meta / Google / SheBack)', completed: false, type: 'course', resourceLink: '/opportunities' }
      ]
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: Network Reactivation & Returnship Applications',
      duration: 'Weeks 9-12',
      description: 'Connect with mentors and apply to flexible returnships and jobs.',
      milestones: [
        { _id: 'm7', title: 'Attend 2 SheBack returnee peer networking sessions', completed: false, type: 'networking', resourceLink: '#' },
        { _id: 'm8', title: 'Apply to 3 high-match returnship programs', completed: false, type: 'application', resourceLink: '/opportunities' },
        { _id: 'm9', title: 'Complete mock technical & behavioral returnee interview', completed: false, type: 'networking', resourceLink: '#' }
      ]
    }
  ];

  return {
    _id: 'rm_default_' + userId,
    userId,
    user: userId,
    targetRole: targetRole || 'Career Gap Recovery & Re-entry',
    currentPhaseIndex: 0,
    progress: 25,
    overallProgress: 25,
    weeks: defaultPhases,
    phases: defaultPhases,
    recommendedMentors: [
      {
        name: 'Sarah Lin',
        role: 'Engineering Manager & Former Returnee',
        company: 'Stripe',
        bio: 'Returned to tech after 4-year break raising twin daughters. Passionate about mentoring women in STEM.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Priya Sharma',
        role: 'Director of Product',
        company: 'Adobe',
        bio: 'Re-entered workforce through returnship program. Champion for return-to-work flexibility.',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      }
    ]
  };
};

const getRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Try Primary MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        const roadmap = await Roadmap.findOne({ $or: [{ userId }, { user: userId }] });
        if (roadmap) {
          return res.json({ success: true, roadmap });
        }
      } catch (dbErr) {
        console.warn('[GetRoadmap] MongoDB query error:', dbErr.message);
      }
    }

    // 2. Check Persistent Local Store
    const roadmaps = getRoadmaps();
    const stored = roadmaps.find((r) => String(r.userId || r.user) === String(userId));
    if (stored) {
      return res.json({ success: true, roadmap: stored });
    }

    // 3. Fallback: Build default roadmap based on user's target career
    const profiles = getProfiles();
    const userProfile = profiles.find((p) => String(p.userId || p.user) === String(userId));
    const target = userProfile?.desiredCareer || 'Career Re-entry';
    const fallbackRoadmap = buildDefaultRoadmap(userId, target);

    roadmaps.push(fallbackRoadmap);
    saveState();

    return res.json({ success: true, roadmap: fallbackRoadmap });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phaseIndex, milestoneIndex, completed } = req.body;

    // 1. Try Primary MongoDB
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const roadmap = await Roadmap.findOne({ $or: [{ userId }, { user: userId }] });
        if (roadmap) {
          const phases = roadmap.phases || roadmap.weeks || [];
          if (phases[phaseIndex]?.milestones?.[milestoneIndex]) {
            phases[phaseIndex].milestones[milestoneIndex].completed = completed;

            let total = 0;
            let done = 0;
            phases.forEach((p) => {
              (p.milestones || []).forEach((m) => {
                total++;
                if (m.completed) done++;
              });
            });

            const newProgress = total > 0 ? Math.round((done / total) * 100) : 0;
            roadmap.progress = newProgress;
            roadmap.overallProgress = newProgress;
            roadmap.phases = phases;
            roadmap.weeks = phases;
            await roadmap.save();

            return res.json({ success: true, message: 'Milestone updated', roadmap });
          }
        }
      } catch (dbErr) {
        console.warn('[UpdateMilestone] MongoDB update error, checking store:', dbErr.message);
      }
    }

    // 2. Persistent Local Store
    const roadmaps = getRoadmaps();
    let roadmap = roadmaps.find((r) => String(r.userId || r.user) === String(userId));
    if (!roadmap) {
      roadmap = buildDefaultRoadmap(userId, 'Target Career');
      roadmaps.push(roadmap);
    }

    const phases = roadmap.phases || roadmap.weeks || [];
    if (phases[phaseIndex]?.milestones?.[milestoneIndex]) {
      phases[phaseIndex].milestones[milestoneIndex].completed = completed;

      let total = 0;
      let done = 0;
      phases.forEach((p) => {
        (p.milestones || []).forEach((m) => {
          total++;
          if (m.completed) done++;
        });
      });

      const newProgress = total > 0 ? Math.round((done / total) * 100) : 0;
      roadmap.progress = newProgress;
      roadmap.overallProgress = newProgress;
      saveState();

      return res.json({ success: true, message: 'Milestone updated', roadmap });
    }

    return res.status(400).json({ success: false, message: 'Invalid phase or milestone index' });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

module.exports = {
  getRoadmap,
  updateMilestone,
};
