const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { getAIRecommendations, analyzeProfile } = require('../controllers/ai.controller');

router.get('/recommend', auth, role('seeker'), getAIRecommendations);
router.post('/analyze-profile', auth, role('seeker'), analyzeProfile);

module.exports = router;
