import Database from "better-sqlite3";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
console.log('Checking database at:', dbPath);

try {
  const db = new Database(dbPath);
  
  // Check if users table exists
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('\nExisting tables:', tables.map(t => t.name));
  
  // Check users table structure if it exists
  const userTableExists = tables.some(t => t.name === 'users');
  if (userTableExists) {
    console.log('\nUsers table structure:');
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    tableInfo.forEach(col => {
      console.log(`  ${col.name} - ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Check indexes
    console.log('\nIndexes on users table:');
    const indexes = db.prepare("PRAGMA index_list(users)").all();
    indexes.forEach(idx => {
      console.log(`  ${idx.name} - unique: ${idx.unique}`);
    });
    
    // Count users
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
    console.log(`\nTotal users: ${userCount.count}`);
  } else {
    console.log('\nUsers table does not exist!');
  }
  
  db.close();
} catch (error) {
  console.error('Error checking database:', error);
}