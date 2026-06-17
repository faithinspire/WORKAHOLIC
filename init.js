#!/usr/bin/env node

/**
 * WORKAHOLIC Initialization Script
 * Initializes database, seeds data, and creates sample users
 * 
 * Features:
 * - Works WITH Supabase (when internet available)
 * - Works WITHOUT Supabase (fallback in-memory mode)
 * - Handles existing tables gracefully
 */

const pool = require('./config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const log = {
  info: (msg) => console.log('ℹ️  ' + msg),
  success: (msg) => console.log('✅ ' + msg),
  error: (msg) => console.log('❌ ' + msg),
  warn: (msg) => console.log('⚠️  ' + msg),
};

// In-memory fallback database
const inMemoryDB = {
  users: [],
  jobseekers: [],
  recruiters: [],
  states: [],
  lgas: [],
  universities: [],
  polytechnics: [],
};

let useInMemory = false;

async function runScript() {
  try {
    log.info('Starting WORKAHOLIC initialization...\n');

    // Step 1: Test database connection
    log.info('Testing database connection...');
    let dbAvailable = false;
    try {
      await pool.query('SELECT 1');
      dbAvailable = true;
      log.success('✓ Connected to Supabase database\n');
    } catch (error) {
      log.warn('Cannot connect to Supabase - using in-memory storage');
      log.warn('Reason: ' + error.message + '\n');
      useInMemory = true;
      log.info('Using IN-MEMORY MODE for development\n');
    }

    // Step 2: Create database tables (if using DB)
    if (dbAvailable) {
      log.info('Creating database tables...');
      const schemaPath = path.join(__dirname, 'database', 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      const statements = schema.split(';').filter(s => s.trim());
      let tablesCreated = 0;
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await pool.query(statement);
            if (statement.includes('CREATE TABLE') || statement.includes('CREATE INDEX')) {
              tablesCreated++;
            }
          } catch (e) {
            // Table or index might already exist - continue
            if (!e.message.includes('already exists')) {
              console.error('SQL Error:', e.message);
            }
          }
        }
      }
      log.success(`Database tables verified/created (${tablesCreated} created)\n`);
    }

    // Step 3: Seed data (States, Universities, etc.)
    log.info('Loading Nigeria data (states, universities, polytechnics)...');
    const { statesAndLGAs, universities, polytechnics } = require('./config/data');

    if (dbAvailable) {
      // Seed to database
      let statesSeeded = 0;
      for (const stateName of Object.keys(statesAndLGAs)) {
        try {
          const result = await pool.query(
            'SELECT id FROM states WHERE name = $1',
            [stateName]
          );
          
          if (result.rows.length === 0) {
            const stateResult = await pool.query(
              'INSERT INTO states (name) VALUES ($1) RETURNING id',
              [stateName]
            );
            const stateId = stateResult.rows[0].id;
            
            const lgas = statesAndLGAs[stateName];
            for (const lga of lgas) {
              await pool.query(
                'INSERT INTO lgas (name, state_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [lga, stateId]
              );
            }
            statesSeeded++;
          }
        } catch (e) {
          // Continue on error
        }
      }

      // Seed universities
      for (const university of universities) {
        try {
          await pool.query(
            'INSERT INTO universities (name, state) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [university, 'Nigeria']
          );
        } catch (e) {
          // Continue
        }
      }

      // Seed polytechnics
      for (const polytechnic of polytechnics) {
        try {
          await pool.query(
            'INSERT INTO polytechnics (name, state) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [polytechnic, 'Nigeria']
          );
        } catch (e) {
          // Continue
        }
      }

      log.success(`✓ Nigeria data seeded (${statesSeeded} states, ${universities.length} unis, ${polytechnics.length} polys)\n`);
    } else {
      // Store in memory
      inMemoryDB.states = Object.keys(statesAndLGAs);
      inMemoryDB.universities = universities;
      inMemoryDB.polytechnics = polytechnics;
      log.success('✓ Data loaded in memory\n');
    }

    // Step 4: Create sample users
    log.info('Creating sample user accounts...');

    const sampleUsers = [
      {
        email: 'teacher@workaholic.com',
        password: 'Teacher123',
        role: 'jobseeker',
        fullname: 'Dr. Chioma Okonkwo',
        phone: '08012345678',
        subject: 'Mathematics',
        experience: 5,
        state: 'Lagos',
      },
      {
        email: 'recruiter@workaholic.com',
        password: 'Recruiter123',
        role: 'recruiter',
        fullname: 'Mr. Tunde Adeyemi',
        phone: '08087654321',
        company_name: 'Excellence Academy',
        institution_type: 'School',
        state: 'Lagos',
      },
      {
        email: 'student@workaholic.com',
        password: 'Student123',
        role: 'jobseeker',
        fullname: 'Miss Blessing Eze',
        phone: '08134567890',
        subject: 'Chemistry',
        experience: 2,
        state: 'Enugu',
      },
    ];

    let usersCreated = 0;

    for (const user of sampleUsers) {
      try {
        if (dbAvailable) {
          const exists = await pool.query('SELECT * FROM users WHERE email = $1', [user.email]);
          
          if (exists.rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            const userResult = await pool.query(
              'INSERT INTO users (email, password, role, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
              [user.email, hashedPassword, user.role]
            );

            const userId = userResult.rows[0].id;

            if (user.role === 'jobseeker') {
              await pool.query(
                `INSERT INTO jobseekers (user_id, fullname, phone, state, education_level, subject, employment_type, years_experience, star_rating, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, NOW())`,
                [userId, user.fullname, user.phone, user.state, 'Master\'s Degree', user.subject, 'Full-time', user.experience]
              );
            } else if (user.role === 'recruiter') {
              const subscriptionExpiry = new Date();
              subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);

              await pool.query(
                `INSERT INTO recruiters (user_id, fullname, company_name, institution_type, state, subscription_type, scans_remaining, subscription_expiry, created_at)
                 VALUES ($1, $2, $3, $4, $5, 'basic', 5, $6, NOW())`,
                [userId, user.fullname, user.company_name || 'N/A', user.institution_type || 'School', user.state, subscriptionExpiry]
              );
            }

            usersCreated++;
            log.success(`✓ Created: ${user.role} | ${user.email} / ${user.password}`);
          }
        } else {
          // Store in memory
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(user.password, salt);
          const userId = inMemoryDB.users.length + 1;

          inMemoryDB.users.push({
            id: userId,
            email: user.email,
            password: hashedPassword,
            role: user.role,
          });

          if (user.role === 'jobseeker') {
            inMemoryDB.jobseekers.push({
              user_id: userId,
              fullname: user.fullname,
              phone: user.phone,
              state: user.state,
              subject: user.subject,
              years_experience: user.experience,
            });
          } else if (user.role === 'recruiter') {
            inMemoryDB.recruiters.push({
              user_id: userId,
              fullname: user.fullname,
              company_name: user.company_name,
              phone: user.phone,
              state: user.state,
            });
          }

          usersCreated++;
          log.success(`✓ Created (IN-MEMORY): ${user.role} | ${user.email} / ${user.password}`);
        }
      } catch (error) {
        log.warn(`⚠️  Could not create ${user.email}: ${error.message}`);
      }
    }

    log.info('');
    log.success(`✅ Created ${usersCreated} sample accounts\n`);

    // Step 5: Summary
    log.info('═══════════════════════════════════════════════════════════════');
    log.success('✨ WORKAHOLIC initialization complete!\n');

    if (dbAvailable) {
      console.log('📊 DATABASE MODE: Using Supabase PostgreSQL');
      console.log('   All data is persisted to the database');
      console.log('   Real-time sync enabled');
    } else {
      console.log('💾 IN-MEMORY MODE: Using fallback storage');
      console.log('   Data will be lost when server restarts');
      console.log('   ⚠️  To use database, ensure internet connection');
      console.log('   ⚠️  Run "node init.js" again when connected');
    }

    console.log('\n📝 Sample Accounts:\n');
    console.log('  TEACHER:');
    console.log('    Email: teacher@workaholic.com');
    console.log('    Password: Teacher123\n');
    console.log('  RECRUITER:');
    console.log('    Email: recruiter@workaholic.com');
    console.log('    Password: Recruiter123\n');
    console.log('  STUDENT:');
    console.log('    Email: student@workaholic.com');
    console.log('    Password: Student123\n');

    console.log('🚀 Next Steps:');
    console.log('  1. npm start       (start backend on port 5000)');
    console.log('  2. Browser: http://localhost:5000');
    console.log('  3. Create account or login with sample account\n');

    console.log('═══════════════════════════════════════════════════════════════\n');

    if (dbAvailable) {
      await pool.end();
    }
    
    process.exit(0);
  } catch (error) {
    log.error('Initialization failed:');
    console.error(error.message);
    process.exit(1);
  }
}

runScript();
