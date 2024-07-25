// backend/models/Gym.js
const mongoose = require("mongoose");

const gymSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    plans: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Gym = mongoose.model("gyms", gymSchema);

module.exports = Gym;
