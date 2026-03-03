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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
