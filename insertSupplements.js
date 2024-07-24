const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Supplement = require('./models/Supplement');

dotenv.config();

const supplements = [
  { name: 'Gold Whey', description: 'Updated today', price: '$29.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' },
  { name: 'Dinamize ISO 100', description: 'Updated yesterday', price: '$35.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' },
  { name: 'Smart Whey Pure', description: 'Updated 2 days ago', price: '$25.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' },
  { name: 'Funat Whey Protein', description: 'Updated today', price: '$27.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' },
  { name: 'Bi-Pro Classic', description: 'Updated yesterday', price: '$32.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' },
  { name: 'Whey Protein Plus', description: 'Updated 3 days ago', price: '$24.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' },
  { name: 'Optimum Nutrition Whey', description: 'Updated 4 days ago', price: '$31.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' },
  { name: 'MuscleTech NitroTech', description: 'Updated 5 days ago', price: '$36.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' },
  { name: 'Body Fortress Whey', description: 'Updated 6 days ago', price: '$22.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' },
  { name: 'Dymatize Elite Whey', description: 'Updated a week ago', price: '$28.99', tags: ['Proteina'], image: 'https://via.placeholder.com/150' }
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected...');
  try {
    await Supplement.insertMany(supplements);
    console.log('Supplements inserted successfully!');
  } catch (error) {
    console.error('Error inserting supplements:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});
