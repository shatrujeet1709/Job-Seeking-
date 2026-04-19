const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

// Public routes
router.get('/', jobsController.getAllJobs);
router.get('/:id', jobsController.getJobById);

// Protected Seeker Routes
router.post('/:id/apply', auth, role('seeker'), jobsController.applyToJob);
router.get('/user/applied', auth, role('seeker'), jobsController.getAppliedJobs);

// Protected Recruiter Routes
router.post('/', auth, role('recruiter'), jobsController.postJob);
router.put('/:id', auth, role('recruiter'), jobsController.updateJob);
router.delete('/:id', auth, role('recruiter'), jobsController.deleteJob);

module.exports = router;
