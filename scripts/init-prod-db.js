import Database from "better-sqlite3";
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';

// Get database path
const getDbPath = () => {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const projectRoot = join(__dirname, '..');
  return join(projectRoot, 'drizzle', 'db.sqlite');
};

const dbPath = getDbPath();
console.log('Database path:', dbPath);

// Ensure directory exists
const dbDir = dirname(dbPath);
try {
  mkdirSync(dbDir, { recursive: true });
  console.log('Created directory:', dbDir);
} catch (err) {
  console.log('Directory already exists or error:', err.message);
}

// Create database and tables
try {
  const db = new Database(dbPath);
  
  // Enable WAL mode
  db.pragma('journal_mode = WAL');
  
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT DEFAULT '',
      email TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      location TEXT DEFAULT '',
      website TEXT DEFAULT '',
      language TEXT DEFAULT 'en',
      timezone TEXT DEFAULT 'America/Los_Angeles',
      email_notifications INTEGER DEFAULT 1,
      push_notifications INTEGER DEFAULT 0,
      marketing_emails INTEGER DEFAULT 0,
      theme TEXT DEFAULT 'system',
      display_density TEXT DEFAULT 'comfortable',
      dashboard_layout TEXT DEFAULT 'grid',
      sidebar_collapsed INTEGER DEFAULT 0,
      enable_animations INTEGER DEFAULT 1,
      enable_sounds INTEGER DEFAULT 0,
      auto_save INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      last_password_change TEXT DEFAULT NULL
    )
  `);
  
  console.log('Successfully created users table!');
  
  // Check if table was created
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables in database:', tables.map(t => t.name));
  
  db.close();
  console.log('Database initialized successfully!');
} catch (error) {
  console.error('Error initializing database:', error);
}