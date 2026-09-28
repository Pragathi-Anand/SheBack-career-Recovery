const Roadmap = require('../models/Roadmap');
const Profile = require('../models/Profile');
const { memoryRoadmaps } = require('./analysisController');
const { memoryProfiles } = require('./profileController');

const buildDefaultRoadmap = (userId, targetRole) => ({
  _id: 'rm_default_' + userId,
  user: userId,
  targetRole: targetRole || 'Career Gap Recovery & Re-entry',
  currentPhaseIndex: 0,
  overallProgress: 25,
  phases: [
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
  ],
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
});

const getRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;

    try {
      const roadmap = await Roadmap.findOne({ user: userId });
      if (roadmap) {
        return res.json({ success: true, roadmap });
      }
    } catch (dbErr) {
      // DB check failed
    }

    if (memoryRoadmaps.has(String(userId))) {
      return res.json({ success: true, roadmap: memoryRoadmaps.get(String(userId)) });
    }

    // Default roadmap generator if none yet
    let profile = null;
    try {
      profile = await Profile.findOne({ user: userId });
    } catch (e) {
      profile = memoryProfiles.get(String(userId));
    }

    const targetRole = profile ? profile.desiredCareer : 'Career Gap Recovery & Re-entry';
    const defaultRoadmap = buildDefaultRoadmap(userId, targetRole);
    memoryRoadmaps.set(String(userId), defaultRoadmap);

    return res.json({ success: true, roadmap: defaultRoadmap });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phaseIndex, milestoneIndex, completed } = req.body;

    try {
      const dbRoadmap = await Roadmap.findOne({ user: userId });
      if (dbRoadmap) {
        if (dbRoadmap.phases[phaseIndex] && dbRoadmap.phases[phaseIndex].milestones[milestoneIndex]) {
          dbRoadmap.phases[phaseIndex].milestones[milestoneIndex].completed = completed;
          
          // recalculate overall progress
          let total = 0;
          let done = 0;
          dbRoadmap.phases.forEach((p) => {
            p.milestones.forEach((m) => {
              total++;
              if (m.completed) done++;
            });
          });
          dbRoadmap.overallProgress = Math.round((done / Math.max(total, 1)) * 100);
          await dbRoadmap.save();
          return res.json({ success: true, roadmap: dbRoadmap });
        }
      }
    } catch (e) {
      // Memory fallback
    }

    let roadmap = memoryRoadmaps.get(String(userId));
    if (!roadmap) {
      let profile = memoryProfiles.get(String(userId));
      const targetRole = profile ? profile.desiredCareer : 'Career Gap Recovery & Re-entry';
      roadmap = buildDefaultRoadmap(userId, targetRole);
      memoryRoadmaps.set(String(userId), roadmap);
    }

    if (roadmap && roadmap.phases[phaseIndex] && roadmap.phases[phaseIndex].milestones[milestoneIndex]) {
      roadmap.phases[phaseIndex].milestones[milestoneIndex].completed = completed;
      let total = 0;
      let done = 0;
      roadmap.phases.forEach((p) => {
        p.milestones.forEach((m) => {
          total++;
          if (m.completed) done++;
        });
      });
      roadmap.overallProgress = Math.round((done / Math.max(total, 1)) * 100);
      memoryRoadmaps.set(String(userId), roadmap);
      return res.json({ success: true, roadmap });
    }

    res.status(404).json({ success: false, message: 'Milestone not found.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRoadmap, updateMilestone };
