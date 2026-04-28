/**
 * XSS / HTML Sanitization Middleware
 * Strips dangerous HTML tags and attributes from string fields in req.body.
 * Applied AFTER JSON parsing, BEFORE route handlers.
 * 
 * This is a lightweight server-side defence. Frontend should also use DOMPurify.
 */

// Patterns to strip from user input
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,  // <script> tags
  /on\w+\s*=\s*["'][^"']*["']/gi,                          // Event handlers (onclick, onerror, etc.)
  /javascript\s*:/gi,                                       // javascript: URIs
  /vbscript\s*:/gi,                                         // vbscript: URIs
  /data\s*:\s*text\/html/gi,                                // data:text/html URIs
  /<iframe\b[^>]*>/gi,                                      // <iframe> tags
  /<object\b[^>]*>/gi,                                      // <object> tags
  /<embed\b[^>]*>/gi,                                       // <embed> tags
  /<form\b[^>]*>/gi,                                        // <form> tags
];

function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  let clean = str;
  for (const pattern of DANGEROUS_PATTERNS) {
    clean = clean.replace(pattern, '');
  }
  return clean;
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      cleaned[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = sanitizeObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function xssSanitizer(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

module.exports = xssSanitizer;
