import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️ WARNING: DATABASE_URL is not set. Using local fallback.');
} else {
  console.log('🔌 Database connection string detected.');
  // Mask the password for security in logs if needed, but for now just acknowledge it's there
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
