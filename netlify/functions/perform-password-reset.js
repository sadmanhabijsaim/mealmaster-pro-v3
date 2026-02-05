const { Pool } = require('pg');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  const body = JSON.parse(event.body || '{}');
  const username = String(body.username || '').trim();
  const token = String(body.token || '').trim();
  const newPassword = String(body.newPassword || body.password || '').trim();
  if (!username || !token || !newPassword) return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Missing fields' }) };

  const pool = new Pool({ connectionString: process.env.NEON_CONNECTION_STRING, ssl: { rejectUnauthorized: false } });
  try {
    const res = await pool.query('SELECT token_hash, expires_at FROM password_resets WHERE LOWER(username)=LOWER($1) LIMIT 1', [username]);
    if (res.rowCount === 0) {
      await pool.end();
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'No reset request found' }) };
    }

    const row = res.rows[0];
    const now = new Date();
    if (!row.expires_at || new Date(row.expires_at) < now) {
      await pool.query('DELETE FROM password_resets WHERE LOWER(username)=LOWER($1)', [username]);
      await pool.end();
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Token expired' }) };
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (tokenHash !== row.token_hash) {
      await pool.end();
      return { statusCode: 401, body: JSON.stringify({ success: false, message: 'Invalid token' }) };
    }

    // Hash new password and update users table
    const hashed = bcrypt.hashSync(newPassword, 10);
    await pool.query('UPDATE users SET password=$1 WHERE LOWER(username)=LOWER($2)', [hashed, username]);
    await pool.query('DELETE FROM password_resets WHERE LOWER(username)=LOWER($1)', [username]);
    await pool.end();
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('PERFORM_RESET_ERROR', err);
    try { await pool.end(); } catch (e) {}
    return { statusCode: 500, body: JSON.stringify({ success: false, message: String(err.message || err) }) };
  }
  return {
  statusCode: 410,
  body: JSON.stringify({ success: false, message: 'Password reset endpoint removed. Admin manages passwords directly.' })
  };
};
