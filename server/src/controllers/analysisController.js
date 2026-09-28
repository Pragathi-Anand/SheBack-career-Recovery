const Profile = require('../models/Profile');
const Roadmap = require('../models/Roadmap');
const { generateCareerAnalysis } = require('../services/geminiService');
const { memoryProfiles } = require('./profileController');

const memoryRoadmaps = new Map();

const getAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    let profile = null;

    try {
      profile = await Profile.findOne({ user: userId });
    } catch (dbErr) {
      profile = memoryProfiles.get(String(userId));
    }

    if (!profile) {
      profile = memoryProfiles.get(String(userId));
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please complete the onboarding form first.',
      });
    }

    // Return cached analysis if present
    if (profile.careerAnalysis) {
      return res.json({
        success: true,
        analysis: profile.careerAnalysis,
        cached: true,
      });
    }

    // Generate if not cached
    return generateOrGetAnalysis(req, res);
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error retrieving career analysis.' });
  }
};

const generateOrGetAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const force = req.query.force === 'true' || req.body?.force === true;
    let profile = null;

    try {
      profile = await Profile.findOne({ user: userId });
    } catch (dbErr) {
      profile = memoryProfiles.get(String(userId));
    }

    if (!profile) {
      // Fallback check memory
      profile = memoryProfiles.get(String(userId));
    }

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Profile not found. Please complete the onboarding form first.',
      });
    }

    // If already generated and not forced, return cached analysis
    if (!force && profile.careerAnalysis) {
      return res.json({
        success: true,
        message: 'Returning cached career analysis',
        analysis: profile.careerAnalysis,
        cached: true,
      });
    }

    // Call Gemini AI service
    const analysis = await generateCareerAnalysis(profile);

    // Save analysis to profile
    try {
      if (profile._id && typeof profile.save === 'function') {
        profile.careerAnalysis = analysis;
        await profile.save();
      } else {
        profile.careerAnalysis = analysis;
        memoryProfiles.set(String(userId), profile);
      }

      // Auto generate / update Roadmap model for user based on AI personalized roadmap
      if (analysis.personalizedRoadmap && Array.isArray(analysis.personalizedRoadmap)) {
        const roadmapData = {
          user: userId,
          targetRole: profile.desiredCareer || 'Target Role',
          currentPhaseIndex: 0,
          overallProgress: 15, // initial headstart upon analysis
          phases: analysis.personalizedRoadmap.map((p) => ({
            phaseNumber: p.phaseNumber || 1,
            title: p.title,
            duration: p.duration,
            description: p.description,
            milestones: (p.milestones || []).map((m) => ({
              title: m.title,
              description: `Focus area for ${p.title}`,
              completed: false,
              type: m.type || 'skill',
              resourceLink: m.link || '/opportunities',
            })),
          })),
        };

        try {
          await Roadmap.findOneAndUpdate(
            { user: userId },
            { $set: roadmapData },
            { new: true, upsert: true }
          );
        } catch (dbRoadmapErr) {
          memoryRoadmaps.set(String(userId), {
            _id: 'rm_' + userId,
            ...roadmapData,
            updatedAt: new Date(),
          });
        }
      }
    } catch (saveErr) {
      console.warn('Saving analysis warning:', saveErr.message);
    }

    return res.json({
      success: true,
      message: 'Career analysis successfully generated with Gemini AI!',
      analysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during career analysis.' });
  }
};

module.exports = { getAnalysis, generateOrGetAnalysis, memoryRoadmaps };
