const Profile = require('../models/Profile');

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email avatar');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const fields = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { ...fields, user: req.user.id, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    const url = req.file?.path;
    if (!url) return res.status(400).json({ message: 'No file uploaded' });
    
    const profile = await Profile.findOneAndUpdate(
        { user: req.user.id }, 
        { resumeUrl: url },
        { new: true, upsert: true }
    );
    
    res.json({ resumeUrl: url, profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId })
      .populate('user', 'name email avatar role');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
