const Job = require('../models/Job');
const Application = require('../models/Application');
const { getIO } = require('../socket/socket');

exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    // First ensure the job belongs to this recruiter
    const job = await Job.findOne({ _id: req.params.id, postedBy: req.user.id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });

    const applications = await Application.find({ job: req.params.id })
      .populate('applicant', 'name email avatar')
      .sort({ aiScore: -1 });           // Highest AI score first
      
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Ensure the recruiter owns the job
    if (application.job.postedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this application' });
    }

    application.status = status;
    await application.save();

    // Trigger real-time notification
    try {
        const io = getIO();
        io.to(application.applicant.toString()).emit('statusUpdate', {
            message: `Your application for ${application.job.title} is now ${status}`,
            jobId: application.job._id,
            status
        });
    } catch (e) {
        console.error('Socket notification failed', e.message);
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    const jobIds = jobs.map(j => j._id);
    
    const applications = await Application.find({ job: { $in: jobIds } });
    
    const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.isActive).length,
        totalApplications: applications.length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        hired: applications.filter(a => a.status === 'hired').length
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
