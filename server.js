const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Ensure environment variables are loaded

connectDB(); // Connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json()); // To accept JSON data

app.use('/api/users', userRoutes); // User routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
