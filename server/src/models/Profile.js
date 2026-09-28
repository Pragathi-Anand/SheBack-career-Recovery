const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      alias: 'user',
    },
    name: {
      type: String,
      default: '',
    },
    previousRole: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    experience: {
      type: mongoose.Schema.Types.Mixed,
      default: 0,
      alias: 'yearsOfExperience',
    },
    industry: {
      type: String,
      default: '',
      alias: 'previousIndustry',
    },
    careerBreak: {
      type: String,
      default: '',
      alias: 'breakDuration',
    },
    skills: [
      {
        type: String,
      },
    ],
    interests: [
      {
        type: String,
      },
    ],
    workType: {
      type: String,
      default: 'Remote',
      alias: 'preferredWorkType',
    },
    location: {
      type: String,
      default: 'Flexible',
      alias: 'preferredLocation',
    },
    desiredCareer: {
      type: String,
      default: '',
    },
    careerAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual alias for previousSkills
profileSchema.virtual('previousSkills')
  .get(function () { return this.skills; })
  .set(function (val) { this.skills = val; });

module.exports = mongoose.model('Profile', profileSchema);
