const pool = require('../config/database');
const { statesAndLGAs, universities, polytechnics } = require('../config/data');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed States
    console.log('Seeding states...');
    for (const stateName of Object.keys(statesAndLGAs)) {
      const result = await pool.query(
        'INSERT INTO states (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id',
        [stateName]
      );
      
      if (result.rows.length > 0) {
        const stateId = result.rows[0].id;
        
        // Seed LGAs for this state
        const lgas = statesAndLGAs[stateName];
        for (const lga of lgas) {
          await pool.query(
            'INSERT INTO lgas (name, state_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [lga, stateId]
          );
        }
      }
    }

    // Seed Universities
    console.log('Seeding universities...');
    for (const university of universities) {
      await pool.query(
        'INSERT INTO universities (name, state) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [university.name, university.state]
      );
    }

    // Seed Polytechnics
    console.log('Seeding polytechnics...');
    for (const polytechnic of polytechnics) {
      await pool.query(
        'INSERT INTO polytechnics (name, state) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [polytechnic.name, polytechnic.state]
      );
    }

    console.log('Database seeded successfully!');
    pool.end();
  } catch (error) {
    console.error('Error seeding database:', error);
    pool.end();
  }
}

seedDatabase();
