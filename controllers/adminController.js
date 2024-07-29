// backend/controllers/adminController.js
const asyncHandler = require('express-async-handler');
const Gym = require('../models/Gym');
const Supplement = require('../models/Supplement');
const User = require('../models/User');

// CRUD operations for Gyms
const getGyms = asyncHandler(async (req, res) => {
  const gyms = await Gym.find({});
  res.json(gyms);
});

const createGym = asyncHandler(async (req, res) => {
  const gym = new Gym(req.body);
  const createdGym = await gym.save();
  res.status(201).json(createdGym);
});

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
  deleteGym,
};
