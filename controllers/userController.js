const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');
const mailgun = require('mailgun-js');

const mg = mailgun({ apiKey: '75c0453968819c9a7d22a01e66023a26-afce6020-e04787bf', domain: 'sandbox0473816090b7474fa18dd5dca2ccf06d.mailgun.org' });

const resetTokens = new Map(); // Store reset tokens temporarily in memory

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

// @desc    Recover password
// @route   POST /api/users/recover
// @access  Public
// const recoverPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     res.status(404);
//     throw new Error('User not found');
//   }

//   const resetToken = crypto.randomBytes(32).toString('hex');
//   const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

//   // Store the token in memory with an expiration time
//   resetTokens.set(resetToken, { email, expires: Date.now() + 3600000 }); // Token valid for 1 hour

//   const data = {
//     from: 'Your App <no-reply@yourdomain.com>',
//     to: user.email,
//     subject: 'Password Recovery',
//     text: `You requested a password reset. Please click the link to reset your password: ${resetURL}`
//   };

//   mg.messages().send(data, (error, body) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('Error sending email');
//     } else {
//       res.status(200).send('Email sent');
//     }
//   });
// });

// @desc    Reset password
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetData = resetTokens.get(token);

  if (!resetData || resetData.expires < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  const user = await User.findOne({ email: resetData.email });

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  await user.save();

  // Remove the token from memory
  resetTokens.delete(token);

  res.status(200).send('Password has been reset');
});

module.exports = {
  getUsers,
  createUser,
  authUser,
  resetPassword, // Export the new function
};
