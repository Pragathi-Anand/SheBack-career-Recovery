const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
      alias: 'company',
    },
    type: {
      type: String,
      enum: ['course', 'internship', 'job'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    requiredSkills: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      default: 'Remote',
    },
    workType: {
      type: String,
      default: 'Remote',
    },
    experience: {
      type: String,
      default: 'Intermediate',
      alias: 'experienceLevel',
    },
    URL: {
      type: String,
      default: '#',
      alias: 'url',
    },
    targetRoles: [
      {
        type: String,
      },
    ],
    duration: {
      type: String,
      default: 'Self-paced',
    },
    stipendOrSalary: {
      type: String,
      default: 'Competitive',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    isReturnship: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

opportunitySchema.pre('validate', function (next) {
  if ((!this.skills || this.skills.length === 0) && this.requiredSkills?.length) {
    this.skills = this.requiredSkills;
  }
  if ((!this.requiredSkills || this.requiredSkills.length === 0) && this.skills?.length) {
    this.requiredSkills = this.skills;
  }
  next();
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
