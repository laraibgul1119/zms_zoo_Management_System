import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let connectionString = process.env.DATABASE_URL;

// Extreme diagnostics for Render debugging
if (connectionString) {
  const trimmed = connectionString.trim();
  console.log(`📋 DEBUG: DATABASE_URL exists (Length: ${connectionString.length}, Trimmed Length: ${trimmed.length})`);
  console.log(`📋 DEBUG: Starts with: "${connectionString.substring(0, 10)}..."`);

  // Strict validation: Must start with postgresql:// or postgres://
  if (!trimmed.startsWith('postgresql://') && !trimmed.startsWith('postgres://')) {
    console.error('❌ ERROR: DATABASE_URL does not start with a valid protocol (postgresql://)');
    connectionString = undefined; // Force fallback
  } else {
    try {
      const url = new URL(trimmed);
      console.log(`🔌 Database Host detected: ${url.hostname}`);
      connectionString = trimmed; // Use the fresh trimmed version
    } catch (e) {
      console.error('❌ ERROR: DATABASE_URL is not a valid URL format.');
      connectionString = undefined; // Force fallback
    }
  }
}

if (!connectionString) {
  console.warn('⚠️ WARNING: Valid DATABASE_URL is not set. Using local fallback.');
  console.log('📋 Checking for interfering PG* variables:');
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('PG') || key.includes('DATABASE') || key.includes('URL')) {
      // Don't log values for security, just keys and value length
      const val = process.env[key] || '';
      console.log(`   - ${key} (exists, length: ${val.length})`);
    }
  });
}

export const pool = new Pool({
  connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/zms',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection immediately
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

// For backward compatibility during migration, we'll keep the export name 'db' 
// but it will be a wrapper or we will refactor all 'db' usages to 'pool'
export const db = {
  prepare: (sql: string) => {
    // This is a temporary shim to help find all usages that need refactoring
    throw new Error('db.prepare is no longer supported. Please use pool.query(sql, params) instead.');
  },
  exec: async (sql: string) => {
    return await pool.query(sql);
  }
};
