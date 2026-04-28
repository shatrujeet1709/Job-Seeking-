const axios  = require('axios');
const Job    = require('../models/Job');
const logger = require('../utils/logger');

// Fetch from Remotive (free, no key needed)
async function fetchRemotiveJobs() {
  try {
    const { data } = await axios.get('https://remotive.com/api/remote-jobs?limit=50');
    return data.jobs.map(job => ({
      source:      'remotive',
      externalId:  `remotive_${job.id}`,
      title:       job.title,
      company:     job.company_name,
      location:    job.candidate_required_location || 'Remote',
      description: job.description,
      skills:      job.tags || [],
      jobType:     'remote',
      applyUrl:    job.url,
      postedAt:    new Date(job.publication_date),
    }));
  } catch (err) {
    logger.error(`Remotive fetch error: ${err.message}`);
    return [];
  }
}

// Fetch from Adzuna (requires free API key)
async function fetchAdzunaJobs(country = 'in') {
  try {
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_API_KEY || process.env.ADZUNA_APP_ID === 'your_adzuna_app_id') {
      logger.info('Adzuna API keys not configured. Skipping Adzuna fetch.');
      return [];
    }
    
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1` +
      `?app_id=${process.env.ADZUNA_APP_ID}` +
      `&app_key=${process.env.ADZUNA_API_KEY}` +
      `&results_per_page=50&what=developer&content-type=application/json`;

    const { data } = await axios.get(url);
    return data.results.map(job => ({
      source:      'adzuna',
      externalId:  `adzuna_${job.id}`,
      title:       job.title,
      company:     job.company?.display_name,
      location:    job.location?.display_name,
      description: job.description,
      salary:      { min: job.salary_min, max: job.salary_max, currency: 'GBP' },
      applyUrl:    job.redirect_url,
      postedAt:    new Date(job.created),
    }));
  } catch (err) {
    logger.error(`Adzuna fetch error: ${err.message}`);
    return [];
  }
}

// Save jobs to DB — skip duplicates using externalId
async function saveJobs(jobs) {
  if (jobs.length === 0) return;
  
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  let saved = 0;
  for (const job of jobs) {
    try {
      await Job.findOneAndUpdate(
        { externalId: job.externalId },
        { ...job, expiresAt: thirtyDaysFromNow },
        { upsert: true, returnDocument: 'after' }
      );
      saved++;
    } catch (e) { /* skip duplicates */ }
  }
  logger.info(`Job scraper saved ${saved} jobs`);
}

exports.runScraper = async () => {
  logger.info('Running job scraper...');
  const [remotive, adzuna] = await Promise.all([fetchRemotiveJobs(), fetchAdzunaJobs()]);
  await saveJobs([...remotive, ...adzuna]);
};
