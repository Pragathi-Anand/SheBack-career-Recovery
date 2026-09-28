const mongoose = require('mongoose');

const careerAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    transferableSkills: [
      {
        skill: String,
        relevance: String,
        category: String,
      },
    ],
    strengths: [
      {
        type: String,
      },
    ],
    skillGaps: [
      {
        skill: String,
        priority: String,
        recommendedAction: String,
      },
    ],
    careerPaths: [
      {
        roleTitle: String,
        matchPercentage: Number,
        rationale: String,
        expectedSalaryRange: String,
        growthPotential: String,
      },
    ],
    learningAreas: [
      {
        title: String,
        platform: String,
        duration: String,
        focusArea: String,
        difficulty: String,
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    rawAnalysis: {
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

// Virtual aliases for frontend compatibility if needed
careerAnalysisSchema.virtual('existingStrengths')
  .get(function () { return this.strengths; })
  .set(function (val) { this.strengths = val; });

careerAnalysisSchema.virtual('recommendedCareerPaths')
  .get(function () { return this.careerPaths; })
  .set(function (val) { this.careerPaths = val; });

careerAnalysisSchema.virtual('recommendedCourses')
  .get(function () { return this.learningAreas; })
  .set(function (val) { this.learningAreas = val; });

module.exports = mongoose.model('CareerAnalysis', careerAnalysisSchema);
