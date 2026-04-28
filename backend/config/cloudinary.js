const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { createFileFilter, RESUME_MIMES, IMAGE_MIMES } = require('../middleware/fileFilter.middleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'resumes', resource_type: 'raw', allowed_formats: ['pdf'] }
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'avatars', resource_type: 'image', allowed_formats: ['jpg', 'png', 'webp'] }
});

exports.uploadResume = multer({ 
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max for resumes
  fileFilter: createFileFilter(RESUME_MIMES),
});

exports.uploadAvatar = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max for avatars/gig images
  fileFilter: createFileFilter(IMAGE_MIMES),
});
