const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');
const { uploadResume, uploadAvatar } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');

router.get('/', auth, profileController.getMyProfile);
router.post('/', auth, validate('profileUpdate'), profileController.createOrUpdateProfile);
router.put('/', auth, validate('profileUpdate'), profileController.createOrUpdateProfile);
router.post('/resume', auth, uploadResume.single('resume'), profileController.uploadResume);
router.post('/avatar', auth, uploadAvatar.single('avatar'), profileController.uploadAvatar);
router.get('/:userId', profileController.getPublicProfile);

module.exports = router;
