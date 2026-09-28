const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const Roadmap = require('../models/Roadmap');
const CareerAnalysis = require('../models/CareerAnalysis');
const { generateCareerAnalysis } = require('../services/geminiService');
const { getProfiles, getCareerAnalyses, getRoadmaps, saveState } = require('../services/storeService');

const getAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    let profile = null;

    if (mongoose.connection.readyState === 1) {
      try {
        profile = await Profile.findOne({ $or: [{ userId }, { user: userId }] });
      } catch (dbErr) {
        console.warn('[GetAnalysis] MongoDB lookup error:', dbErr.message);
      }
    }

    if (!profile) {
      const profiles = getProfiles();
      profile = profiles.find((p) => String(p.userId || p.user) === String(userId));
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

    if (mongoose.connection.readyState === 1) {
      try {
        profile = await Profile.findOne({ $or: [{ userId }, { user: userId }] });
      } catch (dbErr) {
        console.warn('[GenerateAnalysis] MongoDB profile lookup error:', dbErr.message);
      }
    }

    if (!profile) {
      const profiles = getProfiles();
      profile = profiles.find((p) => String(p.userId || p.user) === String(userId));
    }

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Profile not found. Please complete the onboarding form first.',
      });
    }

    // Return cached if not forced
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

    // Save to CareerAnalysis Model in MongoDB
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        await CareerAnalysis.findOneAndUpdate(
          { userId },
          {
            $set: {
              userId,
              transferableSkills: analysis.transferableSkills || [],
              strengths: analysis.existingStrengths || analysis.strengths || [],
              skillGaps: analysis.skillGaps || [],
              careerPaths: analysis.recommendedCareerPaths || analysis.careerPaths || [],
              learningAreas: analysis.recommendedCourses || analysis.learningAreas || [],
              rawAnalysis: analysis,
              generatedAt: new Date(),
            },
          },
          { upsert: true, new: true }
        );
      } catch (caErr) {
        console.warn('[GenerateAnalysis] Error saving CareerAnalysis model:', caErr.message);
      }
    }

    // Save into Profile model & persistent store
    if (mongoose.connection.readyState === 1) {
      try {
        await Profile.findOneAndUpdate(
          { $or: [{ userId }, { user: userId }] },
          { $set: { careerAnalysis: analysis } }
        );
      } catch (pErr) {
        console.warn('[GenerateAnalysis] Error updating profile analysis:', pErr.message);
      }
    }

    // Always update disk persistent store
    const profiles = getProfiles();
    const pIdx = profiles.findIndex((p) => String(p.userId || p.user) === String(userId));
    if (pIdx >= 0) {
      profiles[pIdx].careerAnalysis = analysis;
    }

    const careerAnalyses = getCareerAnalyses();
    const caIdx = careerAnalyses.findIndex((ca) => String(ca.userId) === String(userId));
    const caRecord = {
      userId,
      transferableSkills: analysis.transferableSkills || [],
      strengths: analysis.existingStrengths || analysis.strengths || [],
      skillGaps: analysis.skillGaps || [],
      careerPaths: analysis.recommendedCareerPaths || analysis.careerPaths || [],
      learningAreas: analysis.recommendedCourses || analysis.learningAreas || [],
      generatedAt: new Date().toISOString(),
      rawAnalysis: analysis,
    };
    if (caIdx >= 0) {
      careerAnalyses[caIdx] = caRecord;
    } else {
      careerAnalyses.push(caRecord);
    }
    saveState();

    // Auto-generate / sync Roadmap
    if (analysis.personalizedRoadmap && Array.isArray(analysis.personalizedRoadmap)) {
      const roadmapWeeks = analysis.personalizedRoadmap.map((p) => ({
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
      }));

      const roadmapData = {
        userId,
        user: userId,
        targetRole: profile.desiredCareer || 'Target Role',
        progress: 15,
        overallProgress: 15,
        weeks: roadmapWeeks,
        phases: roadmapWeeks,
        currentPhaseIndex: 0,
      };

      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
        try {
          await Roadmap.findOneAndUpdate(
            { $or: [{ userId }, { user: userId }] },
            { $set: roadmapData },
            { new: true, upsert: true }
          );
        } catch (rmErr) {
          console.warn('[GenerateAnalysis] Error syncing Roadmap:', rmErr.message);
        }
      }

      // Persist to local disk store
      const roadmaps = getRoadmaps();
      const rmIdx = roadmaps.findIndex((r) => String(r.userId || r.user) === String(userId));
      if (rmIdx >= 0) {
        roadmaps[rmIdx] = { ...roadmaps[rmIdx], ...roadmapData, updatedAt: new Date().toISOString() };
      } else {
        roadmaps.push({ _id: 'rm_' + userId, ...roadmapData, updatedAt: new Date().toISOString() });
      }
      saveState();
    }

    return res.json({
      success: true,
      message: 'Career analysis successfully generated and persisted!',
      analysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during career analysis.' });
  }
};

module.exports = {
  getAnalysis,
  generateOrGetAnalysis,
};
