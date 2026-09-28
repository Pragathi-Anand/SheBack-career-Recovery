const express = require('express');
const { getOpportunities, createOpportunity } = require('../controllers/opportunityController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', getOpportunities);
router.post('/', authMiddleware, createOpportunity);

module.exports = router;
