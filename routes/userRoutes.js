// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  authUser,
  recoverPassword,
  resetPassword // Import the new function
} = require('../controllers/userController');

router.route('/').get(getUsers).post(createUser);
router.post('/login', authUser);
router.post('/recover', recoverPassword);
router.post('/reset-password/:token', resetPassword); // Add this route
//testeo nuevo xd
module.exports = router;
