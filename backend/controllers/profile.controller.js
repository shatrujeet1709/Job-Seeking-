const Profile = require('../models/Profile');

exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email avatar');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    // req.body is already validated and stripped by Joi middleware (only whitelisted fields)
    const fields = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { ...fields, user: req.user.id, updatedAt: Date.now() },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.uploadResume = async (req, res, next) => {
  try {
    const url = req.file?.path;
    if (!url) return res.status(400).json({ message: 'No file uploaded' });
    
    const profile = await Profile.findOneAndUpdate(
        { user: req.user.id }, 
        { resumeUrl: url },
        { returnDocument: 'after', upsert: true }
    );
    
    res.json({ resumeUrl: url, profile });
  } catch (err) {
    next(err);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    const url = req.file?.path;
    if (!url) return res.status(400).json({ message: 'No file uploaded' });

    // Update user avatar
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, { avatar: url });

    res.json({ avatarUrl: url });
  } catch (err) {
    next(err);
  }
};

exports.getPublicProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId })
      .populate('user', 'name avatar role'); // Removed email from public profile
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    next(err);
  }
};
