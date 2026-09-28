const express = require('express');
const { getAnalysis, generateOrGetAnalysis } = require('../controllers/analysisController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getAnalysis);
router.post('/', authMiddleware, generateOrGetAnalysis);

module.exports = router;
