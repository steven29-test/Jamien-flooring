import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT:
// This project is deployed to GitHub Pages (project site) and also may use a custom domain.
// Using a relative base makes asset URLs work in BOTH cases.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
