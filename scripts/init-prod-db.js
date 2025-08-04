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
      emailNotifications INTEGER DEFAULT 1,
      pushNotifications INTEGER DEFAULT 0,
      marketingEmails INTEGER DEFAULT 0,
      theme TEXT DEFAULT 'light',
      displayDensity TEXT DEFAULT 'comfortable',
      dashboardLayout TEXT DEFAULT 'grid',
      sidebarCollapsed INTEGER DEFAULT 0,
      enableAnimations INTEGER DEFAULT 1,
      enableSounds INTEGER DEFAULT 0,
      autoSave INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      lastPasswordChange TEXT DEFAULT NULL
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