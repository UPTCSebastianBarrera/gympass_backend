const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, address, phone, profilePicture } = req.body;
  
  console.log('Creating user:', req.body); // Add this line to log the incoming request

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    address,
    phone,
    profilePicture,
  });

  const createdUser = await user.save();

  console.log('User created:', createdUser); // Add this line to log the created user

  res.status(201).json(createdUser);
});

module.exports = {
  getUsers,
  createUser,
};
