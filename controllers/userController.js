// controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
  return regex.test(password);
};

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|uptc\.edu\.co)$/;
  return regex.test(email);
};

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

  if (!validateEmail(email)) {
    res.status(400);
    throw new Error('Email invalido');
  }

  if (!validatePassword(password)) {
    res.status(400);
    throw new Error('Contraseña no cumple con los requisitos de complejidad');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Usuario ya existe');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let uploadedImage;
  if (profilePicture) {
    uploadedImage = await cloudinary.uploader.upload(profilePicture, {
      folder: 'profile_pictures',
    });
  }

  const user = new User({
    name,
    email,
    password: hashedPassword,
    address,
    phone,
    profilePicture: uploadedImage ? uploadedImage.secure_url : '',
  });

  const createdUser = await user.save();

  res.status(201).json({
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    profilePicture: createdUser.profilePicture,
    token: generateToken(createdUser._id),
  });
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { emailOrName, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrName }, { name: emailOrName }],
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Usuario o contraseñas incorrectos');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  getUsers,
  createUser,
  authUser,
};
