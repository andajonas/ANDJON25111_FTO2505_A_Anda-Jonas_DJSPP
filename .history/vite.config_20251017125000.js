import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {  // ← Add this "build" property
    outDir: 'dist',
    assetsDir: 'assets'
  }
})