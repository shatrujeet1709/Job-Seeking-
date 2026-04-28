const multer = require('multer');

// Allowed MIME types for server-side validation (in addition to Cloudinary checks)
const RESUME_MIMES = ['application/pdf'];
const IMAGE_MIMES  = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validates file MIME type before uploading to Cloudinary.
 * Returns a multer fileFilter function.
 */
function createFileFilter(allowedMimes) {
  return (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 
        `Invalid file type: ${file.mimetype}. Allowed: ${allowedMimes.join(', ')}`
      ));
    }
  };
}

module.exports = { createFileFilter, RESUME_MIMES, IMAGE_MIMES };
