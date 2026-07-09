import { io } from "socket.io-client";

const DEFAULT_SOCKET_URL = "https://52-47-71-184.sslip.io";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL;

/**
 * Socket temps réel des notifications utilisateur.
 * Se connecte au `io` principal (authentifié par token Sanctum) ; le serveur
 * rejoint automatiquement la salle `user_<id>` et y pousse l'event `notification`.
 */
class NotificationSocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket && this.socket.connected) return this.socket;
    const token = localStorage.getItem("token");
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
    });
    return this.socket;
  }

  onNotification(handler) {
    this.connect();
    this.socket?.on("notification", handler);
  }

  offNotification(handler) {
    this.socket?.off("notification", handler);
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const notificationSocket = new NotificationSocketService();
