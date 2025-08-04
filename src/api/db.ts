import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from "better-sqlite3";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get database path from environment variable or fallback to local development path
const getDbPath = () => {
  // Production: use environment variable
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }
  
  // Development: use local path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const projectRoot = join(__dirname, '..', '..');
  return join(projectRoot, 'drizzle', 'db.sqlite');
};

const dbPath = getDbPath();
console.log('Database path:', dbPath);

// Create database connection with proper options
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent access
sqlite.pragma('journal_mode = WAL');

export const db: BetterSQLite3Database = drizzle(sqlite);
