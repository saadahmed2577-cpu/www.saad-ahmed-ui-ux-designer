const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  console.log('🌱 [Admin Seed] Connecting to MongoDB...');
  await mongoose.connect(env.MONGO_URI);

  const existingAdmin = await Admin.findOne({ email: env.ADMIN_EMAIL.toLowerCase().trim() });

  if (existingAdmin) {
    console.log(`ℹ️ [Admin Seed] Admin account already exists for ${env.ADMIN_EMAIL}.`);
    console.log(`🔑 Username: ${existingAdmin.username}`);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, salt);

  const newAdmin = await Admin.create({
    username: env.ADMIN_USERNAME,
    email: env.ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
  });

  console.log('====================================================');
  console.log('✅ [Admin Seed] Admin account initialized successfully!');
  console.log(`👤 Username: ${newAdmin.username}`);
  console.log(`📧 Email:    ${newAdmin.email}`);
  console.log(`🔑 Password: ${env.ADMIN_PASSWORD} (hashed with bcrypt in DB)`);
  console.log('====================================================');

  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('❌ [Admin Seed Error]:', err.message);
  process.exit(1);
});
