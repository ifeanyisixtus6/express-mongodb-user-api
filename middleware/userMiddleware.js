const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  next();
};

module.exports = validateObjectId;
