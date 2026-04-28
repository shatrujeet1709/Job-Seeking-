const Job = require('../models/Job');
const Application = require('../models/Application');
const { escapeRegex } = require('../utils/helpers');
const { createNotification } = require('../services/notification.service');

exports.getAllJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, skill, location, type, search } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20)); // Cap at 50
    
    // Build filter
    const filter = { isActive: true };
    if (skill) filter.skills = { $in: [new RegExp(escapeRegex(skill), 'i')] };
    if (location) filter.location = new RegExp(escapeRegex(location), 'i');
    if (type) filter.jobType = type;
    if (search) {
      const escapedSearch = escapeRegex(search);
      filter.$or = [
        { title: new RegExp(escapedSearch, 'i') },
        { company: new RegExp(escapedSearch, 'i') },
        { description: new RegExp(escapedSearch, 'i') }
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort({ fetchedAt: -1, postedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Job.countDocuments(filter)
    ]);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalJobs: total
    });
  } catch (err) {
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

exports.postJob = async (req, res, next) => {
  try {
    const jobData = { ...req.body, source: 'manual', postedBy: req.user.id };
    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};

exports.applyToJob = async (req, res, next) => {
  try {
    // Check if job exists
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check if already applied (DB unique index also prevents this, but give nice error)
    const existing = await Application.findOne({ job: req.params.id, applicant: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const application = await Application.create({
      job: req.params.id,
      applicant: req.user.id,
      coverLetter: req.body.coverLetter || ''
    });

    // Notify recruiter about new application
    if (job.postedBy) {
      await createNotification({
        userId: job.postedBy.toString(),
        type: 'new_application',
        title: 'New Application',
        message: `Someone applied to your job posting "${job.title}".`,
        link: `/recruiter`,
        metadata: { jobId: job._id, applicationId: application._id },
      });
    }

    res.status(201).json(application);
  } catch (err) {
    // Handle duplicate index error gracefully
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }
    next(err);
  }
};

// ─── Withdraw Application ───
exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ 
      _id: req.params.applicationId, 
      applicant: req.user.id 
    });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Can only withdraw if status is 'applied' or 'viewed'
    if (!['applied', 'viewed'].includes(application.status)) {
      return res.status(400).json({ 
        message: `Cannot withdraw application with status "${application.status}"` 
      });
    }

    await Application.findByIdAndDelete(application._id);
    res.json({ message: 'Application withdrawn successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getAppliedJobs = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};
