const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function withPool(fn) {
  const pool = new Pool({ connectionString: process.env.NEON_CONNECTION_STRING, ssl: { rejectUnauthorized: false } });
  try {
    return await fn(pool);
  } finally {
    try { await pool.end(); } catch (e) {}
  }
}

exports.handler = async function (event) {
  try {
    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters || {};
      if (params.action === 'ping') {
        return { statusCode: 200, body: JSON.stringify({ success: true, message: 'pong' }) };
      }
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Invalid parameters' }) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const action = (body.action || body.type || '').toString().toLowerCase();

      if (action === 'signup' || action === 'register') {
        const username = String(body.username || body.email || '').trim();
        const password = String(body.password || '').trim();
        if (!username || !password) return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Missing username or password' }) };

        const hashed = await bcrypt.hash(password, 10);
        return await withPool(async (pool) => {
          await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING', [username, hashed]);
          return { statusCode: 200, body: JSON.stringify({ success: true, message: 'User created or already exists' }) };
        });
      }

      if (action === 'login' || action === 'signin') {
        const username = String(body.username || body.email || '').trim();
        const password = String(body.password || '').trim();
        if (!username || !password) return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Missing username or password' }) };

        return await withPool(async (pool) => {
          const res = await pool.query('SELECT password FROM users WHERE username = $1 LIMIT 1', [username]);
          if (!res.rows || res.rows.length === 0) return { statusCode: 401, body: JSON.stringify({ success: false, message: 'Invalid credentials' }) };
          const row = res.rows[0];
          const match = await bcrypt.compare(password, row.password || '');
          if (!match) return { statusCode: 401, body: JSON.stringify({ success: false, message: 'Invalid credentials' }) };
          return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Authenticated' }) };
        });
      }

      if (action === 'request_password_reset' || action === 'perform_password_reset' || action === 'reset_password') {
        return { statusCode: 410, body: JSON.stringify({ success: false, message: 'Password recovery is disabled' }) };
      }

      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Unknown action' }) };
    }

    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  } catch (err) {
    console.error('auth function error', err && err.stack ? err.stack : err);
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Server error' }) };
  }
};
