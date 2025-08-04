#!/usr/bin/env node

// Test the database connection as used by the API
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from "better-sqlite3";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";

// Same path resolution as API
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const dbPath = join(projectRoot, 'drizzle', 'db.sqlite');

console.log('Testing API database connection...');
console.log('Database path:', dbPath);

// Same connection setup as API
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

const Users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

const db = drizzle(sqlite);

try {
  // Test read
  console.log('\n📖 Testing database read...');
  const users = db.select().from(Users).all();
  console.log('✅ Found users:', users);

  // Test login function
  console.log('\n🔐 Testing login...');
  const adminUser = db.select().from(Users).where(eq(Users.username, 'admin')).get();
  console.log('Admin user found:', adminUser);
  
  if (adminUser && 'admin123' === adminUser.password) {
    console.log('✅ Admin login would succeed');
  } else {
    console.log('❌ Admin login would fail');
  }

  // Test write
  console.log('\n✏️ Testing database write...');
  const testUsername = `test_${Date.now()}`;
  const result = db.insert(Users).values({ 
    username: testUsername, 
    password: 'testpass' 
  }).returning().get();
  console.log('✅ Insert successful:', result);

  // Clean up test user
  db.delete(Users).where(eq(Users.username, testUsername)).run();
  console.log('✅ Test user cleaned up');

} catch (error) {
  console.error('❌ Database test failed:', error);
} finally {
  sqlite.close();
}