'use strict';

require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const sslConfig = isProduction ? { rejectUnauthorized: false } : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

const onConnect = () => {
  if (!isProduction) {
    console.log('✅ Connected to PostgreSQL database');
  }
};

const onError = (err) => {
  console.error('❌ PostgreSQL error:', err);
  process.exit(-1);
};

pool.on('connect', onConnect);
pool.on('error', onError);

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
