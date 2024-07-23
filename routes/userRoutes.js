// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, createUser, authUser } = require('../controllers/userController');

router.route('/').get(getUsers).post(createUser);
router.post('/login', authUser);

module.exports = router;
