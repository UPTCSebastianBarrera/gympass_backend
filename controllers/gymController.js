const asyncHandler = require('express-async-handler');
const Gym = require('../models/Gym');

// @desc    Get all gyms
// @route   GET /api/gyms
// @access  Public
const getGyms = asyncHandler(async (req, res) => {
  const gyms = await Gym.find({});
  res.json(gyms);
});

// @desc    Create a gym
// @route   POST /api/gyms
// @access  Private/Admin
const createGym = asyncHandler(async (req, res) => {
  const gym = new Gym(req.body);
  const createdGym = await gym.save();
  res.status(201).json(createdGym);
});

// @desc    Update a gym
// @route   PUT /api/gyms/:id
// @access  Private/Admin
const updateGym = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.params.id);

  if (gym) {
    Object.assign(gym, req.body);
    const updatedGym = await gym.save();
    res.json(updatedGym);
  } else {
    res.status(404);
    throw new Error('Gym not found');
  }
});

// @desc    Delete a gym
// @route   DELETE /api/gyms/:id
// @access  Private/Admin
// @desc    Delete a gym
// @route   DELETE /api/gyms/:id
// @access  Private/Admin
const deleteGym = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.params.id);

  if (gym) {
    await gym.deleteOne();
    res.json({ message: 'Gym removed' });
  } else {
    res.status(404);
    throw new Error('Gym not found');
  }
});

module.exports = {
  getGyms,
  createGym,
  updateGym,
  deleteGym
};