const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    type: {
      type: String,
      enum: ['course', 'internship', 'job'],
      required: true,
    },
    description: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    workType: { type: String, enum: ['Remote', 'Hybrid', 'On-site', 'Part-time', 'Full-time'], default: 'Remote' },
    requiredSkills: [{ type: String }],
    url: { type: String, default: '#' },
    targetRoles: [{ type: String }],
    experienceLevel: { type: String, default: 'Intermediate' },
    duration: { type: String, default: 'Self-paced' },
    stipendOrSalary: { type: String, default: 'N/A' },
    rating: { type: Number, default: 4.8 },
    isReturnship: { type: Boolean, default: false },
    providerLogo: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
