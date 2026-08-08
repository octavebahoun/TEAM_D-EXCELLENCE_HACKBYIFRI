/**
 * @file redis.js
 * @description Configuration de la connexion au serveur Redis.
 * TLS-aware pour la compatibilité avec Upstash Redis.
 */

const redis = require('redis');
require('dotenv').config();

let redisClient;

async function getRedisClient() {
  if (!redisClient) {
    const url = process.env.REDIS_URL || 
                `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || '6379'}`;
    
    const useTls = url.startsWith('rediss://') || 
                   process.env.REDIS_SCHEME === 'tls' ||
                   (process.env.REDIS_HOST && 
                    process.env.REDIS_HOST !== '127.0.0.1' && 
                    process.env.REDIS_HOST !== 'localhost' && 
                    process.env.REDIS_HOST !== 'redis');

    redisClient = redis.createClient({
      url: url,
      socket: useTls ? {
        tls: true,
        rejectUnauthorized: false
      } : {}
    });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    
    try {
      await redisClient.connect();
      console.log('Connecté à Redis avec succès');
    } catch (err) {
      console.error('Échec de la connexion à Redis:', err);
    }
  }
  return redisClient;
}

module.exports = { getRedisClient };
