const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const recruiterController = require('../controllers/recruiter.controller');

router.use(auth);
router.use(role('recruiter'));

router.get('/jobs', recruiterController.getRecruiterJobs);
router.get('/jobs/:id/applicants', recruiterController.getApplicants);
router.put('/applications/:id', recruiterController.updateApplicationStatus);
router.get('/analytics', recruiterController.getAnalytics);

module.exports = router;
