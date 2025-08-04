#!/usr/bin/env node

import Database from "better-sqlite3";

// Create database file and connection
const sqlite = new Database('./drizzle/db.sqlite');

// Create the table with proper auto-increment
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

// Insert some test users
const testUsers = [
  { username: 'kody', password: 'twixrox' },
  { username: 'admin', password: 'admin123' },
];

const insertUser = sqlite.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)');

for (const user of testUsers) {
  try {
    const result = insertUser.run(user.username, user.password);
    if (result.changes > 0) {
      console.log(`Created user: ${user.username} with ID: ${result.lastInsertRowid}`);
    } else {
      console.log(`User ${user.username} already exists`);
    }
  } catch (error) {
    console.error(`Error creating user ${user.username}:`, error);
  }
}

console.log('Database initialized successfully!');
sqlite.close();