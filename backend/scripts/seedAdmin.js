require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoissue_campus');
  const admin = await User.findOne({ email: 'admin@campus.edu' });
  if (!admin) {
    await User.create({
      email: 'admin@campus.edu',
      password: 'Admin@123',
      name: 'Campus Admin',
      role: 'admin'
    });
    console.log('Admin user created: admin@campus.edu / Admin@123');
  } else {
    console.log('Admin user already exists.');
  }
  process.exit(0);
}
seedAdmin().catch(err => { console.error(err); process.exit(1); });
