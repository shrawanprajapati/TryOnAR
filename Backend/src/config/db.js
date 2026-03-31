const mysql = require('mysql2/promise');

let pool;

function getDbPool() {
  if (pool) {
    return pool;
  }

  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

  if (!DB_HOST || !DB_NAME || !DB_USER) {
    throw new Error('Missing database environment variables in Backend/.env.');
  }

  pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT || 3306),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

async function query(sql, params = []) {
  const [rows] = await getDbPool().execute(sql, params);
  return rows;
}

module.exports = {
  getDbPool,
  query,
};
