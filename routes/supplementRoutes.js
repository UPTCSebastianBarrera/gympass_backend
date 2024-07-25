const express = require('express');
const router = express.Router();


const { getSupplements, createSupplement } = require('../controllers/supplementController');

router.route('/').get(getSupplements).post(createSupplement);

module.exports = router;
