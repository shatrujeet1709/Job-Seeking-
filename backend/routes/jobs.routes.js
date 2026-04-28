const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { validateObjectId } = require('../middleware/validateId.middleware');

// Public routes
router.get('/', jobsController.getAllJobs);

// Protected Seeker Routes — MUST be before /:id to avoid route shadowing
router.get('/user/applied', auth, role('seeker'), jobsController.getAppliedJobs);

// Parameterized routes
router.get('/:id', validateObjectId('id'), jobsController.getJobById);
router.post('/:id/apply', auth, role('seeker'), validateObjectId('id'), validate('applyToJob'), jobsController.applyToJob);

// Withdraw application
router.delete('/applications/:applicationId/withdraw', auth, role('seeker'), validateObjectId('applicationId'), jobsController.withdrawApplication);

// Protected Recruiter Routes
router.post('/', auth, role('recruiter'), validate('postJob'), jobsController.postJob);
router.put('/:id', auth, role('recruiter'), validateObjectId('id'), validate('postJob'), jobsController.updateJob);
router.delete('/:id', auth, role('recruiter'), validateObjectId('id'), jobsController.deleteJob);

module.exports = router;
