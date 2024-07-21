const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Create a user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, address, phone, profilePicture } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = new User({
    name,
    email,
    password,
    address,
    phone,
    profilePicture,
  });

  const createdUser = await user.save();

  res.status(201).json(createdUser);
});

module.exports = {
  getUsers,
  createUser,
};
