const { Pool } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  const body = JSON.parse(event.body || '{}');
  const username = String(body.username || body.user || body.usernameRaw || '').trim();
  const data = body.data || null;
  if (!username) return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Missing username' }) };

  const pool = new Pool({ connectionString: process.env.NEON_CONNECTION_STRING, ssl: { rejectUnauthorized: false } });
  try {
    // Upsert app_state
    await pool.query(
      `INSERT INTO app_state (username, data, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (username) DO UPDATE SET data = EXCLUDED.data, updated_at = now();`,
      [username, data]
    );
    await pool.end();
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('SAVE_DATA_ERROR', err);
    try { await pool.end(); } catch (e) {}
    return { statusCode: 500, body: JSON.stringify({ success: false, message: String(err.message || err) }) };
  }
};
