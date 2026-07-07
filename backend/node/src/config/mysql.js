/**
 * @file mysql.js
 * @description Pool MySQL partagé (même base que Laravel) pour les besoins
 * hors authentification : lecture des filières, responsables de classe, etc.
 */

const mysql = require('mysql2/promise');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || process.env.DB_DATABASE || 'academix',
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

module.exports = { getPool };
