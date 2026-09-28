const Profile = require('../models/Profile');
const User = require('../models/User');
const { DEMO_USER_ID, setMemoryUserOnboarded } = require('./authController');
const { generateDynamicFallback } = require('../services/geminiService');

const memoryProfiles = new Map();

// Seed Demo Profile
const demoProfileData = {
  _id: 'prof_' + DEMO_USER_ID,
  user: DEMO_USER_ID,
  name: 'Priya Sharma',
  previousRole: 'Associate Project Manager',
  education: 'B.A. Business Administration',
  yearsOfExperience: 4,
  previousIndustry: 'Corporate Services & Marketing',
  breakDuration: '3 years (Family Caregiving)',
  previousSkills: ['Project Planning', 'Agile/Scrum', 'Communication', 'Jira', 'Budgeting'],
  interests: ['Product Strategy', 'Tech Returnships', 'User Experience'],
  preferredWorkType: 'Hybrid',
  preferredLocation: 'Remote / Major City',
  desiredCareer: 'Product Manager',
};
demoProfileData.careerAnalysis = generateDynamicFallback(demoProfileData);
memoryProfiles.set(String(DEMO_USER_ID), demoProfileData);

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let foundProfile = null;

    try {
      foundProfile = await Profile.findOne({ user: userId });
    } catch (dbErr) {
      // DB failed, search memory
    }

    if (!foundProfile && memoryProfiles.has(String(userId))) {
      foundProfile = memoryProfiles.get(String(userId));
    }

    if (foundProfile) {
      return res.json({
        success: true,
        profile: foundProfile,
        user: {
          id: req.user.id,
          name: foundProfile.name || req.user.name,
          email: req.user.email,
          onboarded: true,
        },
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Profile not found. Please complete onboarding.',
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        onboarded: false,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      previousRole,
      education,
      yearsOfExperience,
      previousIndustry,
      breakDuration,
      previousSkills,
      interests,
      preferredWorkType,
      preferredLocation,
      desiredCareer,
    } = req.body;

    const formattedPreviousSkills = Array.isArray(previousSkills)
      ? previousSkills
      : typeof previousSkills === 'string'
      ? previousSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const formattedInterests = Array.isArray(interests)
      ? interests
      : typeof interests === 'string'
      ? interests.split(',').map((i) => i.trim()).filter(Boolean)
      : [];

    const profileFields = {
      user: userId,
      name: name || req.user.name,
      previousRole,
      education,
      yearsOfExperience: Number(yearsOfExperience) || 0,
      previousIndustry,
      breakDuration,
      previousSkills: formattedPreviousSkills,
      interests: formattedInterests,
      preferredWorkType: preferredWorkType || 'Remote',
      preferredLocation: preferredLocation || 'Flexible',
      desiredCareer,
    };

    let updatedProfile = null;

    try {
      updatedProfile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: profileFields },
        { new: true, upsert: true, runValidators: true }
      );
      await User.findByIdAndUpdate(userId, { onboarded: true });
      setMemoryUserOnboarded(userId, true);
    } catch (dbErr) {
      // Memory fallback
      setMemoryUserOnboarded(userId, true);
      memoryProfiles.set(String(userId), {
        _id: 'prof_' + userId,
        ...profileFields,
        updatedAt: new Date(),
      });
      updatedProfile = memoryProfiles.get(String(userId));
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
      user: {
        id: req.user.id,
        name: updatedProfile.name || req.user.name,
        email: req.user.email,
        onboarded: true,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

module.exports = { getProfile, updateProfile, memoryProfiles };
