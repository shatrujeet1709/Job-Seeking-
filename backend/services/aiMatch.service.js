const Anthropic = require('@anthropic-ai/sdk');
const Job       = require('../models/Job');
const AIMatch   = require('../models/AIMatch');
const logger    = require('../utils/logger');

function buildPrompt(profile, jobs) {
  const profileSummary = `
USER PROFILE:
- Name: ${profile.user?.name}
- Skills: ${profile.skills?.join(', ')}
- Education: ${profile.education?.map(e => `${e.degree} from ${e.institute} (${e.year})`).join('; ')}
- Experience: ${profile.experience?.map(e => `${e.title} at ${e.company}`).join('; ')}
- Certifications: ${profile.certifications?.map(c => c.name).join(', ')}
- Preferred Roles: ${profile.preferredRoles?.join(', ')}
- Job Type Preference: ${profile.jobType}
- Location: ${profile.location}
`;

  const jobsList = jobs.map((j, i) =>
    `JOB ${i + 1} [ID: ${j._id}]:
     Title: ${j.title} | Company: ${j.company} | Location: ${j.location}
     Required Skills: ${j.skills?.join(', ')}
     Salary: ${j.salary?.min || 'N/A'} - ${j.salary?.max || 'N/A'}
     Description (first 300 chars): ${j.description?.slice(0, 300)}...`
  ).join('\n\n');

  return `${profileSummary}

AVAILABLE JOBS:
${jobsList}

TASK:
Analyze the user profile above and rank the top 8 most suitable jobs from the list.
Return ONLY a valid JSON array. No explanation outside the JSON.

Format:
[
  {
    "jobId": "<exact MongoDB _id from the job>",
    "matchScore": <number 0-100>,
    "reason": "<2-3 sentence explanation of why this job fits the user>",
    "missingSkills": ["<skill1>", "<skill2>"],
    "salaryFit": "<good fit / overqualified / underqualified>"
  }
]`;
}

exports.getAIRecommendations = async (profile) => {
  // Check cache first
  const cached = await AIMatch.findOne({
    user: profile.user._id,
    expiresAt: { $gt: new Date() }
  }).populate('matches.job');
  
  if (cached) return cached.matches;

  // Fetch latest 60 active jobs
  const jobs = await Job.find({ isActive: true }).sort({ fetchedAt: -1 }).limit(60);
  
  if (jobs.length === 0) return [];

  // If no auth key is set or is placeholder, return mock data
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key') {
      logger.info('Using mock AI data because ANTHROPIC_API_KEY is not set');
      const mockMatches = jobs.slice(0, Math.min(8, jobs.length)).map((j, i) => ({
          job: j._id,
          score: 95 - (i * 5),
          reason: `This is a simulated matched reason for ${j.title}. Setup Anthropic API key for real AI matching.`,
          missingSkills: ['TypeScript', 'GraphQL'].slice(0, i % 3)
      }));
      return mockMatches;
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = buildPrompt(profile, jobs);

  const message = await client.messages.create({
    model:      process.env.AI_MODEL || 'claude-3-5-sonnet-20240620',
    max_tokens: 2000,
    messages:   [{ role: 'user', content: prompt }]
  });

  // Parse AI response
  let matches = [];
  try {
    const raw = message.content[0].text;
    const jsonStr = raw.match(/\[[\s\S]*\]/)?.[0];
    const parsed  = JSON.parse(jsonStr);

    matches = parsed.map(item => ({
      job:          item.jobId,
      score:        item.matchScore,
      reason:       item.reason,
      missingSkills: item.missingSkills,
    }));
  } catch (e) {
    logger.error(`AI parse error: ${e.message}`);
    throw new Error('Failed to parse AI response');
  }

  // Cache results for 1 hour
  const expiry = new Date(Date.now() + 60 * 60 * 1000);
  await AIMatch.findOneAndUpdate(
    { user: profile.user._id },
    { user: profile.user._id, matches, generatedAt: new Date(), expiresAt: expiry },
    { upsert: true, returnDocument: 'after' }
  );

  return matches;
};
