import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use a relative base so the same build works on BOTH:
  // 1) GitHub project pages: https://<user>.github.io/Jamien-flooring/
  // 2) Custom domain root:  https://jamienflooring.com.au/
  // This prevents 404s for JS/CSS/images caused by an absolute base path.
  base: command === "build" ? "./" : "/",
}));
