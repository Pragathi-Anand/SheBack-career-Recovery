const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'sheback_persistent_store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultData = {
  users: [],
  profiles: [],
  careerAnalyses: [],
  roadmaps: [],
  opportunities: [],
};

const loadStore = () => {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[PersistentStore] Error reading store file:', err.message);
  }
  return { ...defaultData };
};

const saveStore = (data) => {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[PersistentStore] Error saving store file:', err.message);
  }
};

const state = loadStore();

module.exports = {
  getUsers: () => state.users,
  getProfiles: () => state.profiles,
  getCareerAnalyses: () => state.careerAnalyses,
  getRoadmaps: () => state.roadmaps,
  getOpportunities: () => state.opportunities,
  saveState: () => saveStore(state),
  state,
};
