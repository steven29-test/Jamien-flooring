import { theme } from "./theme";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// GitHub Pages SPA redirect restore
const redirectPath = sessionStorage.getItem("redirectPath");
if (redirectPath) {
  sessionStorage.removeItem("redirectPath");
  const url = new URL(window.location.href);
  if (redirectPath !== "/" && url.pathname === "/") {
    window.history.replaceState(null, "", redirectPath);
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render React app:", error);
  rootElement.innerHTML = `<div style="padding: 20px; font-family: Arial; color: red;"><h1>Error Loading Application</h1><p>${error instanceof Error ? error.message : String(error)}</p></div>`;
}
