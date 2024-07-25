const express = require('express');
const router = express.Router();
const { getGyms } = require('../controllers/gymController');

router.get('/', getGyms);

module.exports = router;
