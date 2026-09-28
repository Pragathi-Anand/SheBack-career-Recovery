const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const User = require('../models/User');
const { DEMO_USER_ID, setMemoryUserOnboarded } = require('./authController');
const { generateDynamicFallback } = require('../services/geminiService');
const { getProfiles, saveState } = require('../services/storeService');

// Seed Demo Profile if not already in store
const initDemoProfile = () => {
  const profiles = getProfiles();
  const demoExists = profiles.find((p) => String(p.userId || p.user) === String(DEMO_USER_ID));
  if (!demoExists) {
    const demo = {
      _id: 'prof_' + DEMO_USER_ID,
      userId: DEMO_USER_ID,
      user: DEMO_USER_ID,
      name: 'Priya Sharma',
      previousRole: 'Associate Project Manager',
      education: 'B.A. Business Administration',
      experience: 4,
      yearsOfExperience: 4,
      industry: 'Corporate Services & Marketing',
      previousIndustry: 'Corporate Services & Marketing',
      careerBreak: '3 years (Family Caregiving)',
      breakDuration: '3 years (Family Caregiving)',
      skills: ['Project Planning', 'Agile/Scrum', 'Communication', 'Jira', 'Budgeting'],
      previousSkills: ['Project Planning', 'Agile/Scrum', 'Communication', 'Jira', 'Budgeting'],
      interests: ['Product Strategy', 'Tech Returnships', 'User Experience'],
      workType: 'Hybrid',
      preferredWorkType: 'Hybrid',
      location: 'Remote / Major City',
      preferredLocation: 'Remote / Major City',
      desiredCareer: 'Product Manager',
    };
    demo.careerAnalysis = generateDynamicFallback(demo);
    profiles.push(demo);
    saveState();
  }
};
initDemoProfile();

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let foundProfile = null;

    // 1. Try Primary MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        foundProfile = await Profile.findOne({
          $or: [{ userId: userId }, { user: userId }],
        });
      } catch (dbErr) {
        console.warn('[GetProfile] MongoDB lookup error:', dbErr.message);
      }
    }

    // 2. Check Persistent Local Store
    if (!foundProfile) {
      const profiles = getProfiles();
      foundProfile = profiles.find((p) => String(p.userId || p.user) === String(userId));
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
      experience,
      previousIndustry,
      industry,
      breakDuration,
      careerBreak,
      previousSkills,
      skills,
      interests,
      preferredWorkType,
      workType,
      preferredLocation,
      location,
      desiredCareer,
    } = req.body;

    const rawSkills = skills || previousSkills || [];
    const formattedSkills = Array.isArray(rawSkills)
      ? rawSkills
      : typeof rawSkills === 'string'
      ? rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const rawInterests = interests || [];
    const formattedInterests = Array.isArray(rawInterests)
      ? rawInterests
      : typeof rawInterests === 'string'
      ? rawInterests.split(',').map((i) => i.trim()).filter(Boolean)
      : [];

    const expValue = experience !== undefined ? experience : (yearsOfExperience !== undefined ? yearsOfExperience : 0);
    const indValue = industry || previousIndustry || '';
    const breakValue = careerBreak || breakDuration || '';
    const workTypeValue = workType || preferredWorkType || 'Remote';
    const locValue = location || preferredLocation || 'Flexible';

    const profileFields = {
      userId,
      user: userId,
      name: name || req.user.name || '',
      previousRole: previousRole || '',
      education: education || '',
      experience: expValue,
      yearsOfExperience: expValue,
      industry: indValue,
      previousIndustry: indValue,
      careerBreak: breakValue,
      breakDuration: breakValue,
      skills: formattedSkills,
      previousSkills: formattedSkills,
      interests: formattedInterests,
      workType: workTypeValue,
      preferredWorkType: workTypeValue,
      location: locValue,
      preferredLocation: locValue,
      desiredCareer: desiredCareer || '',
    };

    let updatedProfile = null;

    // 1. Try Primary MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        const query = mongoose.Types.ObjectId.isValid(userId)
          ? { $or: [{ userId }, { user: userId }] }
          : { userId };

        updatedProfile = await Profile.findOneAndUpdate(
          query,
          { $set: profileFields },
          { new: true, upsert: true, runValidators: false }
        );

        if (mongoose.Types.ObjectId.isValid(userId)) {
          await User.findByIdAndUpdate(userId, { onboarded: true });
        }
      } catch (dbErr) {
        console.warn('[UpdateProfile] MongoDB save error, falling back:', dbErr.message);
      }
    }

    // 2. Always persist into local disk store as well for maximum resilience
    setMemoryUserOnboarded(userId, true);
    const profiles = getProfiles();
    const existingIndex = profiles.findIndex((p) => String(p.userId || p.user) === String(userId));
    const storeProfileRecord = {
      _id: updatedProfile?._id ? String(updatedProfile._id) : ('prof_' + userId),
      ...profileFields,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...storeProfileRecord };
    } else {
      profiles.push(storeProfileRecord);
    }
    saveState();

    const returnedProfile = updatedProfile || storeProfileRecord;

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: returnedProfile,
      user: {
        id: req.user.id,
        name: returnedProfile.name || req.user.name,
        email: req.user.email,
        onboarded: true,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
