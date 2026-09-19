const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const connectDB = require('./src/config/database');

dotenv.config();

const users = [
  {
    username: 'admin',
    email: 'admin@cybershield.com',
    password: 'password123',
    role: 'admin',
    totalScore: 500,
    completedChallenges: 5,
  },
  {
    username: 'player1',
    email: 'player1@example.com',
    password: 'password123',
    role: 'user',
    totalScore: 150,
    completedChallenges: 2,
  },
  {
    username: 'player2',
    email: 'player2@example.com',
    password: 'password123',
    role: 'user',
    totalScore: 50,
    completedChallenges: 1,
  },
];

const importData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    console.log('Data Destroyed...');

    await User.insertMany(users);
    console.log('Data Imported...');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    
    console.log('Data Destroyed...');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
