const express = require('express');
const router = express.Router();
const { getGyms, createGym, updateGym, deleteGym } = require('../controllers/gymController');

router.route('/').get(getGyms).post(createGym);
router.route('/:id').put(updateGym).delete(deleteGym);

module.exports = router;