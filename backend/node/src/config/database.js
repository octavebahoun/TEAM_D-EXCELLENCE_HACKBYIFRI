/**
 * @file database.js
 * @description Proxy de compatibilité pour getPool de postgres.js.
 */

const { getPool } = require('./postgres');

module.exports = getPool();