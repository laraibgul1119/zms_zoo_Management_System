import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// For Render free tier without persistent disk, use /tmp directory
// Note: Data will be lost on restart/redeploy
const getDbPath = () => {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }
  
  // In production without persistent storage, use /tmp
  if (process.env.NODE_ENV === 'production') {
    const tmpDir = '/tmp';
    if (fs.existsSync(tmpDir)) {
      return path.join(tmpDir, 'zoo.db');
    }
  }
  
  // Local development
  return path.resolve(__dirname, '../../zoo.db');
};

const dbPath = getDbPath();
console.log('Database path:', dbPath);

export const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
