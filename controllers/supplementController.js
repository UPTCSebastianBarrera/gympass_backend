const asyncHandler = require('express-async-handler');
const Supplement = require('../models/Supplement');

// @desc    Get all supplements
// @route   GET /api/supplements
// @access  Public
const getSupplements = asyncHandler(async (req, res) => {
  const supplements = await Supplement.find({});
  res.json(supplements);
});

// @desc    Create a supplement
// @route   POST /api/supplements
// @access  Public
const createSupplement = asyncHandler(async (req, res) => {
  const { name, description, price, tags, image } = req.body;

  const supplement = new Supplement({
    name,
    description,
    price,
    tags,
    image,
  });

  const createdSupplement = await supplement.save();
  res.status(201).json(createdSupplement);
});

module.exports = {
  getSupplements,
  createSupplement,
};
