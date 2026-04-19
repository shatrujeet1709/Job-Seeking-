const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

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

exports.uploadResume = multer({ storage: resumeStorage });
exports.uploadAvatar = multer({ storage: avatarStorage });
