import Database from 'better-sqlite3';
import path from 'path';

// Use persistent disk path in production, local path in development
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/backend/zoo.db'
  : path.resolve(__dirname, '../../zoo.db');

export const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
