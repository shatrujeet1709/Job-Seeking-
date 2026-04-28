const Job = require('../models/Job');
const Application = require('../models/Application');
const { createNotification } = require('../services/notification.service');

exports.getRecruiterJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));

    const [jobs, total] = await Promise.all([
      Job.find({ postedBy: req.user.id })
        .sort({ postedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Job.countDocuments({ postedBy: req.user.id }),
    ]);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalJobs: total,
    });
  } catch (err) { next(err); }
};

exports.getApplicants = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user.id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });

    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));

    const [applications, total] = await Promise.all([
      Application.find({ job: req.params.id })
        .populate('applicant', 'name email avatar')
        .sort({ aiScore: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Application.countDocuments({ job: req.params.id }),
    ]);

    res.json({
      applications,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalApplicants: total,
    });
  } catch (err) { next(err); }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.job.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized to update this application' });

    application.status = status;
    await application.save();

    // Persistent notification + real-time socket
    await createNotification({
      userId: application.applicant.toString(),
      type: 'application_status',
      title: `Application ${status}`,
      message: `Your application for "${application.job.title}" has been ${status}.`,
      link: `/jobs/${application.job._id}`,
      metadata: { jobId: application.job._id, status },
    });

    res.json(application);
  } catch (err) { next(err); }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    const jobIds = jobs.map(j => j._id);
    const applications = await Application.find({ job: { $in: jobIds } });
    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(j => j.isActive).length,
      totalApplications: applications.length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      hired: applications.filter(a => a.status === 'hired').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
    res.json(stats);
  } catch (err) { next(err); }
};
