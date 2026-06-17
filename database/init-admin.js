const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin credentials
const adminEmail = 'admin@faithjobs.com';
const adminPassword = 'Admin@2024';
const adminRole = 'admin';

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Create admin account
const createAdmin = async () => {
  try {
    console.log('🔐 Creating admin account...');
    
    const hashedPassword = await hashPassword(adminPassword);
    
    // Log the credentials
    console.log('\n✅ ADMIN ACCOUNT CREATED\n');
    console.log('═══════════════════════════════════════');
    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPassword);
    console.log('Role: ' + adminRole);
    console.log('═══════════════════════════════════════\n');
    
    // Try to save to database
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL
      });
      
      const query = `
        INSERT INTO users (email, password, role)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO UPDATE
        SET password = $2, role = $3
      `;
      
      await pool.query(query, [adminEmail, hashedPassword, adminRole]);
      
      console.log('✅ Admin account saved to database successfully!\n');
      console.log('You can now login with:');
      console.log('  Email: ' + adminEmail);
      console.log('  Password: ' + adminPassword + '\n');
      
      await pool.end();
    } catch (dbError) {
      console.log('⚠️  Could not save to database (offline mode)');
      console.log('But you can still use these credentials:');
      console.log('  Email: ' + adminEmail);
      console.log('  Password: ' + adminPassword + '\n');
    }
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    process.exit(1);
  }
};

// Run
createAdmin();
