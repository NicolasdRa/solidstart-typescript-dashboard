import { defineConfig } from "@solidjs/start/config";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    preset: process.env.NODE_ENV === "development" ? "node" : "netlify"
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
