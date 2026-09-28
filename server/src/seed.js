require('dotenv').config();
const mongoose = require('mongoose');
const Opportunity = require('./models/Opportunity');
const { sampleOpportunities } = require('./controllers/opportunityController');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sheback';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB...');

    await Opportunity.deleteMany({});
    console.log('[Seed] Cleared existing opportunities...');

    const created = await Opportunity.insertMany(
      sampleOpportunities.map((item) => {
        const copy = { ...item };
        delete copy._id;
        return copy;
      })
    );

    console.log(`[Seed] Successfully seeded ${created.length} opportunities (courses, internships, jobs)!`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
