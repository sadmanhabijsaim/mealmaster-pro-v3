const { Pool } = require('pg');

exports.handler = async function(event) {
  const conn = process.env.NEON_CONNECTION_STRING;
  if (!conn) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Missing NEON_CONNECTION_STRING environment variable' })
    };
  }

  const pool = new Pool({
    connectionString: conn,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('SELECT version()');
    await pool.end();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, version: res.rows[0].version })
    };
  } catch (err) {
    console.error('NEON_CONN_ERROR', err);
    try { await pool.end(); } catch(e) {}
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: String(err.message || err) })
    };
  }
};
