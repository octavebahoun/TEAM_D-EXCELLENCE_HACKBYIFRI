import { io } from "socket.io-client";

const DEFAULT_SOCKET_URL = "https://acadmix-serveur.duckdns.org";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL;

/**
 * Socket temps réel des discussions Prof ↔ Responsable.
 * Se connecte au `io` principal (authentifié par token Sanctum).
 */
class DiscussionSocketService {
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

  joinDiscussion(discussionId) {
    this.socket?.emit("join-discussion", discussionId);
  }

  leaveDiscussion(discussionId) {
    this.socket?.emit("leave-discussion", discussionId);
  }

  onNewMessage(handler) {
    this.socket?.on("new-discussion-message", handler);
  }

  offNewMessage(handler) {
    this.socket?.off("new-discussion-message", handler);
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const discussionSocket = new DiscussionSocketService();
