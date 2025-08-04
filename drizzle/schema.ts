import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable("users", {
  // Authentication fields
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  
  // Profile information
  name: text("name").default(""),
  email: text("email").default(""),
  bio: text("bio").default(""),
  location: text("location").default(""),
  website: text("website").default(""),
  
  // Account settings
  language: text("language").default("en"),
  timezone: text("timezone").default("America/Los_Angeles"),
  emailNotifications: integer("email_notifications", { mode: "boolean" }).default(true),
  pushNotifications: integer("push_notifications", { mode: "boolean" }).default(false),
  marketingEmails: integer("marketing_emails", { mode: "boolean" }).default(false),
  
  // UI Preferences
  theme: text("theme").default("system"), // system, light, dark
  displayDensity: text("display_density").default("comfortable"), // comfortable, compact, spacious
  dashboardLayout: text("dashboard_layout").default("grid"), // grid, list, masonry
  sidebarCollapsed: integer("sidebar_collapsed", { mode: "boolean" }).default(false),
  enableAnimations: integer("enable_animations", { mode: "boolean" }).default(true),
  enableSounds: integer("enable_sounds", { mode: "boolean" }).default(false),
  autoSave: integer("auto_save", { mode: "boolean" }).default(true),
  
  // System fields (timestamps managed by application code)
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
  lastPasswordChange: text("last_password_change"),
});
