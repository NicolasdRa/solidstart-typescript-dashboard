import { action, query } from "@solidjs/router";
import { 
  getUser as gU, 
  logout as l, 
  loginOrRegister as lOR,
  updateProfileInfo as uPI,
  updateAccountSettings as uAS,
  updatePreferences as uP
} from "./server";

export const getUser = query(gU, "user");
export const loginOrRegister = action(lOR, "loginOrRegister");
export const logout = action(l, "logout");
export const updateProfileInfo = action(uPI, "updateProfileInfo");
export const updateAccountSettings = action(uAS, "updateAccountSettings");
export const updatePreferences = action(uP, "updatePreferences");