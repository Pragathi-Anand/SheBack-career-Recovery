const express = require('express');
const { getRoadmap, updateMilestone } = require('../controllers/roadmapController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getRoadmap);
router.put('/milestone', authMiddleware, updateMilestone);

module.exports = router;
