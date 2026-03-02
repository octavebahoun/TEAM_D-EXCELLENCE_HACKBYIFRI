import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

//Enregistrement du Service Worker
import { registerSW } from "virtual:pwa-register";
registerSW({
  immediate: true,
  onRegistered(registration) {
    console.log("[SW] ✅ Service Worker enregistré :", registration);
  },
  onRegisterError(error) {
    console.error("[SW] ❌ Erreur d'enregistrement :", error);
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
