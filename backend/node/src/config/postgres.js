/**
 * @file postgres.js
 * @description Pool PostgreSQL partagé pour les connexions relationnelles (Supabase).
 * Fournit une compatibilité avec l'API mysql2/promise (wrapper query) pour
 * simplifier la transition sans réécrire toutes les requêtes SQL du projet.
 */

const { Pool } = require('pg');
require('dotenv').config();

let pool;

function getPool() {
  if (!pool) {
    const isProduction = process.env.NODE_ENV === 'production';
    const host = process.env.DB_HOST || '127.0.0.1';
    const connectionString = process.env.DATABASE_URL || process.env.DB_URL;
    
    // Configurer le SSL automatiquement si hôte externe (Supabase) ou si DB_SSL est activé
    const useSsl = process.env.DB_SSL === 'true' || 
                   !!connectionString ||
                   (host !== '127.0.0.1' && host !== 'localhost' && host !== 'mysql');

    const config = connectionString ? {
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: useSsl ? { rejectUnauthorized: false } : false
    } : {
      host: host,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || process.env.DB_DATABASE || 'postgres',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: useSsl ? { rejectUnauthorized: false } : false
    };

    pool = new Pool(config);

    pool.on('error', (err) => {
      console.error('Erreur inattendue sur le pool PostgreSQL:', err);
    });
  }

  // Wrapper pour imiter le comportement de mysql2/promise [rows, fields]
  return {
    query: async (text, params) => {
      let pgText = text;
      // Traduire les placeholders MySQL "?" en placeholders PostgreSQL "$1", "$2", etc.
      if (params && params.length > 0) {
        let index = 1;
        pgText = text.replace(/\?/g, () => `$${index++}`);
      }
      
      const res = await pool.query(pgText, params);
      return [res.rows, res.fields];
    },
    // Ajout d'une méthode execute pour correspondre à getPool().execute() si utilisé
    execute: async (text, params) => {
      let pgText = text;
      if (params && params.length > 0) {
        let index = 1;
        pgText = text.replace(/\?/g, () => `$${index++}`);
      }
      
      const res = await pool.query(pgText, params);
      return [res.rows, res.fields];
    },
    end: () => pool.end()
  };
}

module.exports = { getPool };
