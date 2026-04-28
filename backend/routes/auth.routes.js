const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

// Public routes
router.post('/register', validate('register'), authController.register);
router.post('/login', validate('login'), authController.login);
router.post('/forgot-password', validate('forgotPassword'), authController.forgotPassword);
router.post('/reset-password', validate('resetPassword'), authController.resetPassword);
router.post('/verify-email', validate('verifyEmail'), authController.verifyEmail);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authMiddleware, authController.getMe);
router.put('/change-password', authMiddleware, validate('changePassword'), authController.changePassword);
router.post('/resend-email-verification', authMiddleware, authController.resendEmailVerification);

module.exports = router;
