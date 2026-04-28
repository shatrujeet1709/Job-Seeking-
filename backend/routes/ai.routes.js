const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { getAIRecommendations, analyzeProfile, getMatchScore } = require('../controllers/ai.controller');

router.get('/recommend', auth, role('seeker'), getAIRecommendations);
router.post('/analyze-profile', auth, role('seeker'), analyzeProfile);
router.get('/match-score/:jobId', auth, role('seeker'), getMatchScore);

module.exports = router;
