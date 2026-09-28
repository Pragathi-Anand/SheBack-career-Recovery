const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    previousRole: { type: String, required: true },
    education: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    previousIndustry: { type: String, required: true },
    breakDuration: { type: String, required: true }, // e.g. "2 years", "6 months"
    previousSkills: [{ type: String }],
    interests: [{ type: String }],
    preferredWorkType: { type: String, enum: ['Remote', 'Hybrid', 'On-site', 'Flexible', 'Part-time', 'Full-time'], default: 'Remote' },
    preferredLocation: { type: String, default: 'Flexible' },
    desiredCareer: { type: String, required: true },
    careerAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
