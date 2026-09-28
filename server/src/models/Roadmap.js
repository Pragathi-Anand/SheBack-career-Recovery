const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  type: { type: String, enum: ['skill', 'course', 'project', 'networking', 'application'], default: 'skill' },
  estimatedHours: { type: Number, default: 10 },
  resourceLink: { type: String, default: '#' },
});

const phaseSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String },
  milestones: [milestoneSchema],
});

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    targetRole: { type: String, required: true },
    currentPhaseIndex: { type: Number, default: 0 },
    overallProgress: { type: Number, default: 0 },
    phases: [phaseSchema],
    recommendedMentors: [
      {
        name: String,
        role: String,
        company: String,
        bio: String,
        avatar: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
