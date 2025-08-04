#!/usr/bin/env node

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";

// Recreate the Users table definition
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

const Users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Connect to database
const sqlite = new Database('./drizzle/db.sqlite');
const db = drizzle(sqlite);

// Test registration function (same as in server.ts)
async function register(username, password) {
  const existingUser = db.select().from(Users).where(eq(Users.username, username)).get();
  if (existingUser) throw new Error("User already exists");
  return db.insert(Users).values({ username, password }).returning().get();
}

// Test user registration
async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    const newUser = await register('testuser2', 'testpass123');
    console.log('✅ Registration successful:', newUser);
    
    // Verify user was created
    const users = db.select().from(Users).all();
    console.log('📋 All users in database:', users);
    
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
  } finally {
    sqlite.close();
  }
}

testRegistration();