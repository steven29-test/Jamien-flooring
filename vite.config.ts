import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For GitHub Pages (project site) you need base="/<repo>/"
// For a custom domain (jamienflooring.com.au) you want base="/"
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "github" ? "/jamien-flooring/" : "/",
}));
