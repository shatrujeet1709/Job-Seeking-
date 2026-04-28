const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth.middleware');
const role       = require('../middleware/role.middleware');
const controller = require('../controllers/freelance.controller');
const { uploadAvatar } = require('../config/cloudinary');
const { validate } = require('../middleware/validate.middleware');

router.get   ('/',              controller.getAllGigs);
router.get   ('/my-gigs',       auth, role('freelancer'), controller.getMyGigs);
router.get   ('/my-orders',     auth, controller.getMyOrders);
router.get   ('/orders',        auth, controller.getMyOrders);  // Legacy alias
router.get   ('/:id',          controller.getGigById);
router.post  ('/',              auth, role('freelancer'), uploadAvatar.array('images', 5), controller.createGig);
router.put   ('/:id',          auth, role('freelancer'), controller.updateGig);
router.delete('/:id',          auth, role('freelancer'), controller.deleteGig);
router.post  ('/:id/order',    auth, validate('createOrder'), controller.createOrder);
router.post  ('/:id/verify',   auth, controller.verifyPayment);
router.post  ('/:id/complete', auth, controller.markComplete);

module.exports = router;
