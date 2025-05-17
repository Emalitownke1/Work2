
const { Pool } = require('pg');

// Create connection pool with robust configuration
const pool = new Pool({
  connectionString: 'postgresql://postgres:zuzeIwLmEisQPsUkLmbBLkYxYXhIOLiT@crossover.proxy.rlwy.net:16749/railway',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  maxRetries: 3,
  retryDelay: 1000
});

// Add error handler for the pool
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

async function withRetry(operation, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await pool.connect();
      try {
        return await operation(client);
      } finally {
        client.release();
      }
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

async function recordClaim(userId, link) {
  return withRetry(async (client) => {
    const query = `
      INSERT INTO freelikes_claims (user_id, instagram_link, claim_date)
      VALUES ($1, $2, NOW())
    `;
    await client.query(query, [userId, link]);
  });
}

async function getAllClaims() {
  return withRetry(async (client) => {
    const result = await client.query('SELECT * FROM freelikes_claims ORDER BY claim_date DESC');
    return result.rows;
  });
}

async function initializeDatabase() {
  return withRetry(async (client) => {
    console.log('Initializing database...');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS freelikes_claims (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        instagram_link TEXT NOT NULL,
        claim_date TIMESTAMP NOT NULL
      )
    `;
    await client.query(createTableQuery);
    console.log('Database initialized successfully');
  });
}

// Healthcheck function
async function checkDatabaseConnection() {
  return withRetry(async (client) => {
    await client.query('SELECT 1');
    return true;
  });
}

module.exports = { 
  recordClaim, 
  getAllClaims, 
  initializeDatabase,
  checkDatabaseConnection 
};
