const { Pool } = require('pg');

exports.handler = async function(event) {
  const username = (event.queryStringParameters && event.queryStringParameters.username) || null;
  if (!username) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Missing username' }) };
  }

  const pool = new Pool({ connectionString: process.env.NEON_CONNECTION_STRING, ssl: { rejectUnauthorized: false } });
  try {
    const res = await pool.query('SELECT data FROM app_state WHERE LOWER(username)=LOWER($1) LIMIT 1', [username]);
    await pool.end();
    if (res.rowCount === 0) return { statusCode: 200, body: JSON.stringify({ success: true, data: null }) };
    return { statusCode: 200, body: JSON.stringify({ success: true, data: res.rows[0].data }) };
  } catch (err) {
    console.error('FETCH_DATA_ERROR', err);
    try { await pool.end(); } catch (e) {}
    return { statusCode: 500, body: JSON.stringify({ success: false, message: String(err.message || err) }) };
  }
};
