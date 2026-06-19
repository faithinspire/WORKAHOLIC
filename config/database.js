const { Pool } = require('pg');
require('dotenv').config();
const https = require('https');

const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let pgPool = null;
let dbConnected = false;
let useRESTAPI = false;

// Initialize PostgreSQL Pool with Supabase
if (DATABASE_URL) {
  try {
    pgPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pgPool.on('error', (err) => {
      console.error('❌ Unexpected error on idle client', err);
      dbConnected = false;
    });

    console.log('✅ PostgreSQL pool initialized');
  } catch (error) {
    console.error('❌ Failed to create pool:', error.message);
  }
}

// Test direct PostgreSQL connection
async function testDatabaseConnection() {
  if (!pgPool) {
    console.warn('⚠️  No database pool available, using in-memory storage');
    useRESTAPI = false;
    return false;
  }

  try {
    const result = await pgPool.query('SELECT NOW()');
    console.log('✅ Successfully connected to Supabase PostgreSQL');
    dbConnected = true;
    useRESTAPI = false;
    return true;
  } catch (error) {
    console.warn('⚠️  Direct PostgreSQL unavailable - using in-memory storage');
    dbConnected = false;
    useRESTAPI = false;
    return false;
  }
}

// Helper function to query Supabase via REST API
async function supabaseRESTQuery(table, select = '*', filters = {}) {
  return new Promise((resolve, reject) => {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      reject(new Error('Supabase credentials not configured'));
      return;
    }

    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
    url.searchParams.set('select', select);
    
    // Add filters
    Object.keys(filters).forEach(key => {
      url.searchParams.set(key, filters[key]);
    });

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (data) {
            const parsed = JSON.parse(data);
            resolve({ rows: Array.isArray(parsed) ? parsed : [parsed], rowCount: Array.isArray(parsed) ? parsed.length : 1 });
          } else {
            resolve({ rows: [], rowCount: 0 });
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test connection after delay
setTimeout(() => {
  testDatabaseConnection();
}, 2000);

// Export pool object that works with both PostgreSQL and REST API
const pool = {
  query: async (sql, params = []) => {
    try {
      // If using PostgreSQL directly
      if (pgPool && dbConnected && !useRESTAPI) {
        return await pgPool.query(sql, params);
      }
      
      // Fallback: For REST API, we need to handle different query types
      // This is a simplified implementation
      if (sql.includes('SELECT') && sql.includes('FROM')) {
        const tableMatch = sql.match(/FROM\s+(\w+)/i);
        const table = tableMatch ? tableMatch[1] : null;
        
        if (table) {
          return await supabaseRESTQuery(table, '*', {});
        }
      }
      
      // For other operations, return empty (routes handle fallback)
      return { rows: [], rowCount: 0 };
    } catch (error) {
      console.error('Pool query error:', error.message);
      return { rows: [], rowCount: 0 };
    }
  },
  end: async () => {
    if (pgPool) {
      await pgPool.end();
      console.log('✅ Database pool closed');
    }
  }
};

module.exports = {
  pool,
  supabaseRESTQuery,
  dbConnected: () => dbConnected || useRESTAPI,
  isConnected: () => dbConnected,
  isUsingRESTAPI: () => useRESTAPI,
  testDatabaseConnection,
  getConnection: async () => {
    if (pgPool && dbConnected) {
      return await pgPool.connect();
    }
    throw new Error('Database not connected, using REST API fallback');
  }
};
