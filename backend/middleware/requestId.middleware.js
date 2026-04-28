const crypto = require('crypto');

/**
 * Request ID Middleware
 * Attaches a unique request ID to every incoming request for tracing/debugging.
 * The ID is also set as a response header for client-side correlation.
 */
function requestId(req, res, next) {
  const id = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}

module.exports = requestId;
