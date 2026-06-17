// Direct Supabase REST API integration
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

class SupabaseClient {
  constructor() {
    this.url = SUPABASE_URL;
    this.key = SUPABASE_KEY;
    this.isOnline = false;
    this.lastError = null;
  }

  // Test connection
  async testConnection() {
    try {
      await this.query('SELECT 1');
      this.isOnline = true;
      console.log('✅ Supabase connection verified');
      return true;
    } catch (error) {
      this.isOnline = false;
      this.lastError = error;
      console.warn('⚠️  Supabase offline:', error.message);
      return false;
    }
  }

  // Make API request
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.url || !this.key) {
        reject(new Error('Supabase credentials not configured'));
        return;
      }

      // For REST API, we need to use table-based queries
      // This is a simplified approach - convert SQL to REST calls
      const matches = sql.match(/FROM\s+(\w+)/i);
      const table = matches ? matches[1] : null;

      if (!table) {
        reject(new Error('Could not determine table from query'));
        return;
      }

      const selectMatch = sql.match(/SELECT\s+([\w\s,*]+)\s+FROM/i);
      const select = selectMatch ? selectMatch[1] : '*';

      const url = new URL(`${this.url}/rest/v1/${table}`);
      
      if (select !== '*') {
        url.searchParams.set('select', select);
      }

      // Add filters if present
      if (sql.includes('WHERE')) {
        const whereMatch = sql.match(/WHERE\s+([\w\s=<>!'"]+)(?:\s+ORDER|\s+LIMIT|$)/i);
        if (whereMatch) {
          // Simple WHERE clause parsing - you may need to expand this
          const condition = whereMatch[1];
          console.log('WHERE clause:', condition);
        }
      }

      // Add ordering
      if (sql.includes('ORDER BY')) {
        const orderMatch = sql.match(/ORDER BY\s+([\w\s,.]+)(?:\s+LIMIT|$)/i);
        if (orderMatch) {
          const orderBy = orderMatch[1];
          // Format for Supabase: 'column.asc' or 'column.desc'
          url.searchParams.set('order', orderBy.replace(/\s+DESC/i, '.desc').replace(/\s+ASC/i, '.asc'));
        }
      }

      // Add limit
      if (sql.includes('LIMIT')) {
        const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
        if (limitMatch) {
          url.searchParams.set('limit', limitMatch[1]);
        }
      }

      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
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

      req.on('error', (error) => {
        this.isOnline = false;
        this.lastError = error;
        reject(error);
      });

      req.end();
    });
  }

  // Insert data
  async insert(table, data) {
    return new Promise((resolve, reject) => {
      if (!this.url || !this.key) {
        reject(new Error('Supabase credentials not configured'));
        return;
      }

      const url = new URL(`${this.url}/rest/v1/${table}`);

      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        this.isOnline = false;
        this.lastError = error;
        reject(error);
      });

      req.write(JSON.stringify(data));
      req.end();
    });
  }

  // Get status
  getStatus() {
    return {
      online: this.isOnline,
      url: this.url,
      lastError: this.lastError ? this.lastError.message : null
    };
  }
}

// Create singleton instance
const supabase = new SupabaseClient();

// Test connection on startup
setTimeout(() => {
  supabase.testConnection();
}, 2000);

module.exports = supabase;
