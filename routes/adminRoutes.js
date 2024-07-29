// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getGyms,
  createGym,
  updateGym,
  deleteGym,
} = require('../controllers/adminController');

router.route('/gyms').get(getGyms).post(createGym);
router.route('/gyms/:id').put(updateGym).delete(deleteGym);

module.exports = router;
