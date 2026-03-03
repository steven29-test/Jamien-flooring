import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Dev server at root, build served from GitHub Pages project path
  base: command === "build" ? "/Jamien-flooring/" : "/",
}));
