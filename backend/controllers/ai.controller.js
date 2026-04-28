const Profile = require('../models/Profile');
const { getAIRecommendations } = require('../services/aiMatch.service');
const Job = require('../models/Job');
const Anthropic = require('@anthropic-ai/sdk');

exports.getAIRecommendations = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Complete your profile first' });
    if (!profile.skills?.length) return res.status(400).json({ message: 'Add skills to get recommendations' });

    const matches = await getAIRecommendations(profile);

    // Batch-populate job details (fix N+1 query)
    const jobIds = matches.map(m => m.job).filter(Boolean);
    const jobs = await Job.find({ _id: { $in: jobIds } }).lean();
    const jobMap = {};
    jobs.forEach(j => { jobMap[j._id.toString()] = j; });

    const populatedMatches = matches
      .map(m => ({
        ...m,
        job: jobMap[m.job?.toString()] || null
      }))
      .filter(m => m.job); // Remove matches where job no longer exists

    res.json({ matches: populatedMatches });
  } catch (err) {
    console.error('AI recommendation error:', err.message);
    next(err);
  }
};

exports.analyzeProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name');
    if (!profile) return res.status(404).json({ message: 'Complete your profile first' });

    // If no API key, return basic tips
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key') {
      const tips = [];
      if (!profile.skills?.length) tips.push('Add your technical skills to help AI match you with relevant jobs');
      if (!profile.summary) tips.push('Write a professional summary highlighting your career goals and expertise');
      if (!profile.resumeUrl) tips.push('Upload your resume (PDF) so recruiters can review your full background');
      if (!profile.experience?.length) tips.push('Add your work experience to improve your AI match scores');
      if (!profile.education?.length) tips.push('Add your educational background');
      if (!profile.headline) tips.push('Add a professional headline (e.g., "Full Stack Developer | 3 YOE")');
      if (!profile.location) tips.push('Set your location to get geographically relevant job matches');
      if (!profile.preferredRoles?.length) tips.push('Specify your preferred job roles for better AI targeting');
      if (!profile.linkedin) tips.push('Add your LinkedIn profile URL');
      if (!profile.github) tips.push('Link your GitHub profile to showcase your projects');
      if (tips.length === 0) tips.push('Your profile looks great! Keep it updated for the best matches.');

      const completeness = calculateCompleteness(profile);
      return res.json({ tips, completeness });
    }

    // Real AI analysis
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const prompt = `Analyze this job seeker's profile and provide 5-8 actionable tips to improve it for better job matching:

Name: ${profile.user?.name || 'N/A'}
Headline: ${profile.headline || 'Not set'}
Summary: ${profile.summary || 'Not set'}
Skills: ${profile.skills?.join(', ') || 'None'}
Experience: ${profile.experience?.map(e => `${e.title} at ${e.company}`).join('; ') || 'None'}
Education: ${profile.education?.map(e => `${e.degree} from ${e.institute}`).join('; ') || 'None'}
Certifications: ${profile.certifications?.map(c => c.name).join(', ') || 'None'}
Resume uploaded: ${profile.resumeUrl ? 'Yes' : 'No'}
Location: ${profile.location || 'Not set'}
Preferred Roles: ${profile.preferredRoles?.join(', ') || 'Not set'}

Return a JSON object with:
{ "tips": ["tip1", "tip2", ...], "completeness": <number 0-100>, "strengths": ["strength1", ...], "weaknesses": ["weakness1", ...] }

Return ONLY valid JSON, no other text.`;

    const message = await client.messages.create({
      model: process.env.AI_MODEL || 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    try {
      const raw = message.content[0].text;
      const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0];
      const result = JSON.parse(jsonStr);
      res.json(result);
    } catch (e) {
      const completeness = calculateCompleteness(profile);
      res.json({ tips: ['AI analysis unavailable, please try again later'], completeness });
    }
  } catch (err) {
    next(err);
  }
};

exports.getMatchScore = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name');
    if (!profile) return res.status(404).json({ message: 'Complete your profile first' });

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Calculate basic match score based on skill overlap
    const userSkills = (profile.skills || []).map(s => s.toLowerCase());
    const jobSkills = (job.skills || []).map(s => s.toLowerCase());

    const matchingSkills = userSkills.filter(s => jobSkills.some(js => js.includes(s) || s.includes(js)));
    const missingSkills = jobSkills.filter(s => !userSkills.some(us => us.includes(s) || s.includes(us)));

    const skillScore = jobSkills.length > 0 ? (matchingSkills.length / jobSkills.length) * 100 : 50;

    // Location match bonus
    let locationBonus = 0;
    if (profile.location && job.location) {
      if (job.location.toLowerCase().includes(profile.location.toLowerCase()) ||
          job.jobType === 'remote') {
        locationBonus = 10;
      }
    }

    const score = Math.min(100, Math.round(skillScore + locationBonus));

    res.json({
      score,
      matchingSkills,
      missingSkills,
      jobTitle: job.title,
      reason: `Based on ${matchingSkills.length}/${jobSkills.length} skill matches${locationBonus > 0 ? ' and location compatibility' : ''}.`
    });
  } catch (err) {
    next(err);
  }
};

function calculateCompleteness(profile) {
  const fields = [
    !!profile.headline,
    !!profile.summary,
    profile.skills?.length > 0,
    profile.education?.length > 0,
    profile.experience?.length > 0,
    !!profile.resumeUrl,
    !!profile.location,
    profile.preferredRoles?.length > 0,
    !!profile.linkedin || !!profile.github,
    !!profile.expectedSalary,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}
