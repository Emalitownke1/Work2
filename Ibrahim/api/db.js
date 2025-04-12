
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.SM_DB
});

async function recordClaim(userId, link) {
  const query = `
    INSERT INTO freelikes_claims (user_id, instagram_link, claim_date)
    VALUES ($1, $2, NOW())
  `;
  
  await pool.query(query, [userId, link]);
}

async function getAllClaims() {
  const result = await pool.query('SELECT * FROM freelikes_claims ORDER BY claim_date DESC');
  return result.rows;
}

async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS freelikes_claims (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      instagram_link TEXT NOT NULL,
      claim_date TIMESTAMP NOT NULL
    )
  `;
  
  await pool.query(createTableQuery);
}

module.exports = { recordClaim, getAllClaims, initializeDatabase };
