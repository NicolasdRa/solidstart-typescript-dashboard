"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { Users } from "../../drizzle/schema";

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

async function login(username: string, password: string) {
  const user = db.select().from(Users).where(eq(Users.username, username)).get();
  
  if (!user) {
    throw new Error("Invalid login");
  }
  
  if (password !== user.password) {
    throw new Error("Invalid login");
  }
  
  return user;
}

async function register(username: string, password: string) {
  const existingUser = db.select().from(Users).where(eq(Users.username, username)).get();
  if (existingUser) {
    throw new Error("User already exists");
  }
  
  return db.insert(Users).values({ username, password }).returning().get();
}

function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace"
  });
}

export async function loginOrRegister(formData: FormData) {
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);

  try {
    const user = await (loginType !== "login"
      ? register(username, password)
      : login(username, password));
    const session = await getSession();
    await session.update(d => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect("/");
}

export async function logout() {
  const session = await getSession();
  await session.update(d => (d.userId = undefined));
  throw redirect("/login");
}

export async function getUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");

  try {
    const user = db.select().from(Users).where(eq(Users.id, userId)).get();
    if (!user) throw redirect("/login");
    
    // Return full user profile data (excluding password)
    return {
      id: user.id,
      username: user.username,
      // Profile information
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      // Account settings
      language: user.language || "en",
      timezone: user.timezone || "America/Los_Angeles",
      emailNotifications: user.emailNotifications ?? true,
      pushNotifications: user.pushNotifications ?? false,
      marketingEmails: user.marketingEmails ?? false,
      // UI Preferences
      theme: user.theme || "system",
      displayDensity: user.displayDensity || "comfortable",
      dashboardLayout: user.dashboardLayout || "grid",
      sidebarCollapsed: user.sidebarCollapsed ?? false,
      enableAnimations: user.enableAnimations ?? true,
      enableSounds: user.enableSounds ?? false,
      autoSave: user.autoSave ?? true,
      // System fields
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastPasswordChange: user.lastPasswordChange,
    };
  } catch {
    throw logout();
  }
}

export async function updateProfileInfo(formData: FormData) {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");

  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const bio = String(formData.get("bio") || "");
  const location = String(formData.get("location") || "");
  const website = String(formData.get("website") || "");

  try {
    const updatedUser = db.update(Users)
      .set({ 
        name, 
        email, 
        bio, 
        location, 
        website,
        updatedAt: new Date().toISOString()
      })
      .where(eq(Users.id, userId))
      .returning()
      .get();

    return { success: true, user: updatedUser };
  } catch (error) {
    return new Error("Failed to update profile");
  }
}

export async function updateAccountSettings(formData: FormData) {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");

  const language = String(formData.get("language") || "en");
  const timezone = String(formData.get("timezone") || "America/Los_Angeles");
  const emailNotifications = formData.get("emailNotifications") === "true";
  const pushNotifications = formData.get("pushNotifications") === "true";
  const marketingEmails = formData.get("marketingEmails") === "true";

  try {
    const updatedUser = db.update(Users)
      .set({ 
        language, 
        timezone, 
        emailNotifications, 
        pushNotifications, 
        marketingEmails,
        updatedAt: new Date().toISOString()
      })
      .where(eq(Users.id, userId))
      .returning()
      .get();

    return { success: true, user: updatedUser };
  } catch (error) {
    return new Error("Failed to update account settings");
  }
}

export async function updatePreferences(formData: FormData) {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");

  const theme = String(formData.get("theme") || "system");
  const displayDensity = String(formData.get("displayDensity") || "comfortable");
  const dashboardLayout = String(formData.get("dashboardLayout") || "grid");
  const sidebarCollapsed = formData.get("sidebarCollapsed") === "true";
  const enableAnimations = formData.get("enableAnimations") === "true";
  const enableSounds = formData.get("enableSounds") === "true";
  const autoSave = formData.get("autoSave") === "true";

  try {
    const updatedUser = db.update(Users)
      .set({ 
        theme, 
        displayDensity, 
        dashboardLayout, 
        sidebarCollapsed, 
        enableAnimations, 
        enableSounds, 
        autoSave,
        updatedAt: new Date().toISOString()
      })
      .where(eq(Users.id, userId))
      .returning()
      .get();

    return { success: true, user: updatedUser };
  } catch (error) {
    return new Error("Failed to update preferences");
  }
}
