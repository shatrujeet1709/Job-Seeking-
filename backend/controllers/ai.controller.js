const Profile = require('../models/Profile');
const { getAIRecommendations } = require('../services/aiMatch.service');
const Job = require('../models/Job');

exports.getAIRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Complete your profile first' });
    if (!profile.skills?.length) return res.status(400).json({ message: 'Add skills to get recommendations' });

    const matches = await getAIRecommendations(profile);

    // Populate job details (we just fetch them manually here to keep service clean)
    const populatedMatches = [];
    for(const m of matches) {
       const job = await Job.findById(m.job);
       if(job) {
           populatedMatches.push({ ...m, job });
       }
    }

    res.json({ matches: populatedMatches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI service error', error: err.message });
  }
};

exports.analyzeProfile = async (req, res) => {
  // Mock implementation for profile analysis
  res.json({ tips: ['Add more skills', 'Upload a recent resume', 'Write a detailed summary'] }); 
};
