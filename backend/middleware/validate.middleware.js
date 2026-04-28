const Joi = require('joi');

// --- Validation Schemas ---

const schemas = {
  register: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(8).max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
    role: Joi.string().valid('seeker', 'recruiter', 'freelancer').default('seeker'),
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().required(),
  }),

  profileUpdate: Joi.object({
    headline: Joi.string().trim().max(200).allow(''),
    summary: Joi.string().trim().max(2000).allow(''),
    skills: Joi.array().items(Joi.string().trim().max(50)).max(50),
    phone: Joi.string().trim().max(20).allow(''),
    education: Joi.array().items(Joi.object({
      degree: Joi.string().trim().max(200),
      institute: Joi.string().trim().max(200),
      year: Joi.number().integer().min(1950).max(2030),
      grade: Joi.string().trim().max(20),
    })).max(10),
    experience: Joi.array().items(Joi.object({
      title: Joi.string().trim().max(200),
      company: Joi.string().trim().max(200),
      from: Joi.date(),
      to: Joi.date().allow(null),
      current: Joi.boolean().default(false),
      description: Joi.string().trim().max(2000),
    })).max(20),
    certifications: Joi.array().items(Joi.object({
      name: Joi.string().trim().max(200),
      issuer: Joi.string().trim().max(200),
      year: Joi.number().integer().min(1950).max(2030),
      url: Joi.string().uri().allow(''),
    })).max(20),
    location: Joi.string().trim().max(100).allow(''),
    linkedin: Joi.string().trim().uri().allow(''),
    github: Joi.string().trim().uri().allow(''),
    portfolio: Joi.string().trim().uri().allow(''),
    preferredRoles: Joi.array().items(Joi.string().trim().max(100)).max(10),
    preferredLocations: Joi.array().items(Joi.string().trim().max(100)).max(10),
    expectedSalary: Joi.number().min(0).max(100000000),
    jobType: Joi.string().valid('full-time', 'part-time', 'remote', 'hybrid').allow(''),
    availability: Joi.string().valid('immediately', '2-weeks', '1-month', '3-months').allow(''),
    // Recruiter fields
    companyName: Joi.string().trim().max(200).allow(''),
    companyWebsite: Joi.string().trim().uri().allow(''),
    companyDescription: Joi.string().trim().max(2000).allow(''),
    companySize: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+').allow(''),
    industry: Joi.string().trim().max(100).allow(''),
    // Freelancer fields
    professionalTitle: Joi.string().trim().max(200).allow(''),
    hourlyRate: Joi.number().min(0).max(100000),
    languages: Joi.array().items(Joi.string().trim().max(50)).max(10),
    availabilityStatus: Joi.string().valid('available', 'busy', 'away').allow(''),
    responseTime: Joi.string().valid('1-hour', '24-hours', '2-3-days').allow(''),
  }),

  postJob: Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    company: Joi.string().trim().max(200),
    location: Joi.string().trim().max(200),
    description: Joi.string().trim().max(10000),
    skills: Joi.array().items(Joi.string().trim().max(50)).max(30),
    salary: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
      currency: Joi.string().max(5).default('INR'),
    }),
    jobType: Joi.string().valid('full-time', 'part-time', 'remote', 'contract'),
    applyUrl: Joi.string().uri().allow(''),
    experienceRequired: Joi.string().valid('0-1', '2-4', '5-7', '8+').allow(''),
    applicationDeadline: Joi.date().allow(null, ''),
    openings: Joi.number().integer().min(1).max(1000).default(1),
  }),

  createGig: Joi.object({
    title: Joi.string().trim().min(5).max(200).required(),
    description: Joi.string().trim().min(20).max(5000).required(),
    category: Joi.string().trim().max(100),
    skills: Joi.array().items(Joi.string().trim().max(50)).max(20),
    packages: Joi.alternatives().try(
      Joi.string(), // Allow stringified JSON from multipart forms
      Joi.array().items(Joi.object({
        name: Joi.string().valid('basic', 'standard', 'premium').required(),
        description: Joi.string().trim().max(500),
        price: Joi.number().min(1).max(10000000).required(),
        deliveryDays: Joi.number().integer().min(1).max(365),
        revisions: Joi.number().integer().min(0).max(100),
      })).max(3)
    ),
  }),

  sendMessage: Joi.object({
    content: Joi.string().trim().min(1).max(5000).required(),
  }),

  applyToJob: Joi.object({
    coverLetter: Joi.string().trim().max(5000).allow(''),
  }),

  updateApplicationStatus: Joi.object({
    status: Joi.string().valid('applied', 'viewed', 'shortlisted', 'rejected', 'hired').required(),
  }),

  createOrder: Joi.object({
    packageId: Joi.string().required(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
  }),


  forgotPassword: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
  }),

  verifyEmail: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    token: Joi.string().required(),
  }),
};

// --- Validation Middleware Factory ---

/**
 * Returns an Express middleware that validates req.body against the named schema.
 * @param {string} schemaName — key in the schemas object
 */
function validate(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return next(new Error(`Validation schema "${schemaName}" not found`));
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true, // Remove fields not in schema
    });

    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }

    req.body = value; // Replace body with validated + sanitized values
    next();
  };
}

module.exports = { validate, schemas };
