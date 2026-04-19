const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');
const { uploadResume } = require('../middleware/upload.middleware');

router.get('/', auth, profileController.getMyProfile);
router.post('/', auth, profileController.createOrUpdateProfile);
router.put('/', auth, profileController.createOrUpdateProfile);
router.post('/resume', auth, uploadResume.single('resume'), profileController.uploadResume);
router.get('/:userId', profileController.getPublicProfile);

module.exports = router;
