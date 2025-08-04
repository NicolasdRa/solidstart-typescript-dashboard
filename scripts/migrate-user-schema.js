#!/usr/bin/env node

import Database from "better-sqlite3";

// Create database file and connection
const sqlite = new Database('./drizzle/db.sqlite');

console.log('🔄 Starting database migration...');

try {
  // Check if columns already exist to avoid errors
  const tableInfo = sqlite.prepare("PRAGMA table_info(users)").all();
  const existingColumns = tableInfo.map(col => col.name);
  
  console.log('📋 Existing columns:', existingColumns);
  
  // Add new columns if they don't exist
  const newColumns = [
    { name: 'name', sql: 'ALTER TABLE users ADD COLUMN name TEXT DEFAULT ""' },
    { name: 'email', sql: 'ALTER TABLE users ADD COLUMN email TEXT DEFAULT ""' },
    { name: 'bio', sql: 'ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ""' },
    { name: 'location', sql: 'ALTER TABLE users ADD COLUMN location TEXT DEFAULT ""' },
    { name: 'website', sql: 'ALTER TABLE users ADD COLUMN website TEXT DEFAULT ""' },
    { name: 'language', sql: 'ALTER TABLE users ADD COLUMN language TEXT DEFAULT "en"' },
    { name: 'timezone', sql: 'ALTER TABLE users ADD COLUMN timezone TEXT DEFAULT "America/Los_Angeles"' },
    { name: 'email_notifications', sql: 'ALTER TABLE users ADD COLUMN email_notifications INTEGER DEFAULT 1' },
    { name: 'push_notifications', sql: 'ALTER TABLE users ADD COLUMN push_notifications INTEGER DEFAULT 0' },
    { name: 'marketing_emails', sql: 'ALTER TABLE users ADD COLUMN marketing_emails INTEGER DEFAULT 0' },
    { name: 'created_at', sql: 'ALTER TABLE users ADD COLUMN created_at TEXT DEFAULT (datetime("now"))' },
    { name: 'updated_at', sql: 'ALTER TABLE users ADD COLUMN updated_at TEXT DEFAULT (datetime("now"))' },
    { name: 'last_password_change', sql: 'ALTER TABLE users ADD COLUMN last_password_change TEXT DEFAULT (datetime("now"))' }
  ];
  
  for (const column of newColumns) {
    if (!existingColumns.includes(column.name)) {
      console.log(`➕ Adding column: ${column.name}`);
      sqlite.exec(column.sql);
    } else {
      console.log(`✅ Column ${column.name} already exists`);
    }
  }
  
  // Update existing users with default profile data based on their username
  console.log('🔄 Updating existing users with default profile data...');
  
  const users = sqlite.prepare('SELECT id, username FROM users').all();
  const updateUser = sqlite.prepare(`
    UPDATE users 
    SET 
      name = ?,
      email = ?,
      bio = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `);
  
  for (const user of users) {
    // Generate some default data based on username
    const defaultName = user.username.charAt(0).toUpperCase() + user.username.slice(1);
    const defaultEmail = `${user.username}@example.com`;
    const defaultBio = `${defaultName}'s profile`;
    
    updateUser.run(defaultName, defaultEmail, defaultBio, user.id);
    console.log(`✅ Updated user: ${user.username} with default profile data`);
  }
  
  // Verify the migration
  console.log('🔍 Verifying migration...');
  const updatedTableInfo = sqlite.prepare("PRAGMA table_info(users)").all();
  console.log('📋 Updated table structure:');
  updatedTableInfo.forEach(col => {
    console.log(`  - ${col.name}: ${col.type}${col.dflt_value ? ` (default: ${col.dflt_value})` : ''}`);
  });
  
  // Show sample data
  console.log('📊 Sample user data:');
  const sampleUsers = sqlite.prepare('SELECT id, username, name, email, bio, language, timezone FROM users LIMIT 3').all();
  console.table(sampleUsers);
  
  console.log('✅ Database migration completed successfully!');
  
} catch (error) {
  console.error('❌ Migration failed:', error);
} finally {
  sqlite.close();
}