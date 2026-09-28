const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  type: { type: String, default: 'skill' },
  estimatedHours: { type: Number, default: 10 },
  resourceLink: { type: String, default: '#' },
});

const phaseSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, default: '' },
  milestones: [milestoneSchema],
});

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      alias: 'user',
    },
    targetRole: {
      type: String,
      default: 'Target Career',
    },
    progress: {
      type: Number,
      default: 0,
      alias: 'overallProgress',
    },
    weeks: [phaseSchema],
    phases: [phaseSchema],
    currentPhaseIndex: {
      type: Number,
      default: 0,
    },
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

roadmapSchema.pre('validate', function (next) {
  if ((!this.weeks || this.weeks.length === 0) && this.phases?.length) this.weeks = this.phases;
  if ((!this.phases || this.phases.length === 0) && this.weeks?.length) this.phases = this.weeks;
  if (this.progress !== undefined && this.overallProgress === undefined) this.overallProgress = this.progress;
  if (this.overallProgress !== undefined && this.progress === undefined) this.progress = this.overallProgress;
  next();
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
