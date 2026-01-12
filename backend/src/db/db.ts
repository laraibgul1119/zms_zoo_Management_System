import Database from 'better-sqlite3';
import path from 'path';

// Use environment variable for DB path, fallback to local
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../../zoo.db');

export const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
