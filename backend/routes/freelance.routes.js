const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth.middleware');
const role       = require('../middleware/role.middleware');
const controller = require('../controllers/freelance.controller');
const { uploadAvatar } = require('../config/cloudinary');

router.get   ('/',              controller.getAllGigs);
router.get   ('/:id',          controller.getGigById);
router.post  ('/',              auth, role('freelancer'), uploadAvatar.array('images', 5), controller.createGig);
router.put   ('/:id',          auth, role('freelancer'), controller.updateGig);
router.delete('/:id',          auth, role('freelancer'), controller.deleteGig);
router.post  ('/:id/order',    auth, controller.createOrder);   // Razorpay order
router.post  ('/:id/complete', auth, controller.markComplete);  // Release escrow

module.exports = router;
