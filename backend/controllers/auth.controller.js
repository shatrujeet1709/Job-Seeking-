const User    = require('../models/User');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const logger  = require('../utils/logger');

// ─── Token Generation ───
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper: set refresh token as httpOnly cookie
function setRefreshCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
  });
}

// Helper: build user response payload
function userPayload(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
}

// ─── Register ───
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ name, email, password: hashed, role });

    // Generate email verification token
    const emailToken = crypto.randomBytes(32).toString('hex');
    user.emailVerifyToken = await bcrypt.hash(emailToken, 10);
    user.emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // TODO: Send verification email with link containing emailToken
    logger.info(`[EMAIL-VERIFY] Token for ${email}: ${emailToken} (send via email in production)`);

    // Issue tokens directly
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({ token: accessToken, user: userPayload(user) });
  } catch (err) {
    next(err);
  }
};

// ─── Login ───
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // Issue tokens directly
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    res.json({ token: accessToken, user: userPayload(user) });
  } catch (err) {
    next(err);
  }
};

// ─── Refresh Token ───
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token provided' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid token type' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Check tokenVersion
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    // Issue new tokens (rotation)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    res.json({ token: accessToken });
  } catch (err) {
    next(err);
  }
};

// ─── Logout ───
exports.logout = async (req, res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ message: 'Logged out successfully' });
};

// ─── Get Me ───
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -resetToken -resetExpiry -emailVerifyToken -emailVerifyExpiry -tokenVersion');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ─── Change Password (invalidates all tokens) ───
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 12);
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate all existing tokens
    await user.save();

    // Issue new tokens with updated tokenVersion
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    res.json({ message: 'Password changed successfully', token: accessToken });
  } catch (err) {
    next(err);
  }
};

// ─── Forgot Password ───
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = await bcrypt.hash(resetToken, 10);
    user.resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // TODO: Send email with reset link containing resetToken
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    logger.info(`[PASSWORD-RESET] Reset link for ${email}: ${resetUrl}`);

    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

// ─── Reset Password ───
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetToken || !user.resetExpiry) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    // Check expiry
    if (new Date() > user.resetExpiry) {
      user.resetToken = null;
      user.resetExpiry = null;
      await user.save();
      return res.status(400).json({ message: 'Reset link has expired. Please request a new one.' });
    }

    // Verify token
    const isValid = await bcrypt.compare(token, user.resetToken);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    // Update password and invalidate all tokens
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = null;
    user.resetExpiry = null;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
};

// ─── Verify Email ───
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, token } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.emailVerifyToken || !user.emailVerifyExpiry) {
      return res.status(400).json({ message: 'Invalid verification link' });
    }

    if (user.isVerified) {
      return res.json({ message: 'Email is already verified' });
    }

    if (new Date() > user.emailVerifyExpiry) {
      return res.status(400).json({ message: 'Verification link has expired. Please request a new one.' });
    }

    const isValid = await bcrypt.compare(token, user.emailVerifyToken);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.emailVerifyToken = null;
    user.emailVerifyExpiry = null;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (err) {
    next(err);
  }
};

// ─── Resend Email Verification ───
exports.resendEmailVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) {
      return res.json({ message: 'Email is already verified' });
    }

    const emailToken = crypto.randomBytes(32).toString('hex');
    user.emailVerifyToken = await bcrypt.hash(emailToken, 10);
    user.emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    logger.info(`[EMAIL-VERIFY] New token for ${user.email}: ${emailToken}`);

    res.json({ message: 'Verification email sent' });
  } catch (err) {
    next(err);
  }
};
