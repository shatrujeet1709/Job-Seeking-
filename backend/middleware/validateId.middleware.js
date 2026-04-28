const mongoose = require('mongoose');

/**
 * Validates that the specified route parameter(s) are valid MongoDB ObjectIds.
 * Usage: router.get('/:id', validateObjectId('id'), controller)
 * Usage: router.get('/:id/:userId', validateObjectId('id', 'userId'), controller)
 */
function validateObjectId(...paramNames) {
  return (req, res, next) => {
    for (const name of paramNames) {
      const value = req.params[name];
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        return res.status(400).json({ message: `Invalid ${name} format` });
      }
    }
    next();
  };
}

module.exports = { validateObjectId };
