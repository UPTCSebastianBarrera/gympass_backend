const asyncHandler = require('express-async-handler');
const Gym = require('../models/Gym');

// @desc    Get all gyms
// @route   GET /api/gyms
// @access  Public
const getGyms = asyncHandler(async (req, res) => {
  const gyms = await Gym.find({});
  res.json(gyms);
});

module.exports = {
  getGyms,
};
