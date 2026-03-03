import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT:
// This site is deployed on GitHub Pages and may also use a custom domain.
// A RELATIVE base makes JS/CSS asset URLs work in both cases.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
