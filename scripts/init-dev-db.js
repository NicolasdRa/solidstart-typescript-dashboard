import Database from "better-sqlite3";
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const dbPath = join(projectRoot, 'drizzle', 'db.sqlite');

console.log('Initializing development database...');
console.log('Database path:', dbPath);

// Check if already exists
if (existsSync(dbPath)) {
  console.log('Database already exists!');
  const response = process.argv.includes('--force') ? 'y' : 'n';
  if (response !== 'y' && !process.argv.includes('--force')) {
    console.log('Use --force flag to recreate the database');
    process.exit(0);
  }
  console.log('Recreating database...');
}

// Ensure directory exists
const dbDir = dirname(dbPath);
mkdirSync(dbDir, { recursive: true });

// Create database
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

// Create a test user for development
if (process.argv.includes('--seed')) {
  console.log('Creating test user...');
  try {
    db.prepare(`
      INSERT INTO users (username, password, name, email) 
      VALUES (?, ?, ?, ?)
    `).run('testuser', 'password123', 'Test User', 'test@example.com');
    console.log('Test user created: username=testuser, password=password123');
  } catch (e) {
    console.log('Test user already exists');
  }
}

console.log('Development database initialized successfully!');

// Show table info
const tableInfo = db.prepare("PRAGMA table_info(users)").all();
console.log('\nUsers table structure:');
console.log('Columns:', tableInfo.length);

db.close();