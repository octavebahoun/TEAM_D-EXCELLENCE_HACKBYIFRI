import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { cn } from "../../utils/cn";
import {
  getNotifications,
  getNotificationUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notifications";
import { notificationSocket } from "../../services/notificationSocket";

/** Couleur de la pastille selon le type de notification. */
const DOT = {
  message: "bg-emerald-500",
  mention: "bg-emerald-500",
  alerte: "bg-red-500",
  rappel: "bg-amber-500",
  succes: "bg-emerald-500",
  session: "bg-blue-500",
  badge: "bg-purple-500",
  info: "bg-slate-400",
};

/** Formatage relatif court en français. */
function timeAgo(date) {
  if (!date) return "";
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)} j`;
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

/**
 * Cloche de notifications (feed MongoDB via l'API Node) avec compteur de non-lus
 * et mise à jour temps réel (event socket `notification`).
 *
 * @param {(notification: object) => void} [onNavigate] Appelé au clic sur une notif
 *        (ex. pour ouvrir l'onglet ciblé par `action_url`).
 */
export default function NotificationBell({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications({ limit: 15 });
      setItems(res?.notifications || []);
      if (typeof res?.unreadCount === "number") setUnread(res.unreadCount);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial + compteur + temps réel
  useEffect(() => {
    load();
    getNotificationUnreadCount()
      .then((r) => typeof r?.unreadCount === "number" && setUnread(r.unreadCount))
      .catch(() => {});

    const handler = (notif) => {
      setItems((prev) =>
        prev.some((n) => String(n._id) === String(notif._id)) ? prev : [notif, ...prev],
      );
      setUnread((u) => u + 1);
    };
    notificationSocket.onNotification(handler);
    return () => notificationSocket.offNotification(handler);
  }, [load]);

  // Fermeture au clic extérieur
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) load();
  };

  const handleItemClick = async (notif) => {
    if (!notif.is_read) {
      setItems((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, is_read: true } : n)),
      );
      setUnread((u) => Math.max(0, u - 1));
      markNotificationAsRead(notif._id).catch(() => {});
    }
    setOpen(false);
    onNavigate?.(notif);
  };

  const handleMarkAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnread(0);
    markAllNotificationsAsRead().catch(() => {});
  };

  return (
    <div ref={wrapRef} className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        aria-label="Notifications"
        className="relative h-9 w-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
      >
        <Bell size={16} aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black grid place-items-center leading-none">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold font-display text-sm text-slate-900 dark:text-white">
                Notifications
              </span>
              {unread > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <CheckCheck size={13} /> Tout lire
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading && items.length === 0 ? (
                <div className="p-3 space-y-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="grid place-items-center text-center py-12 px-4">
                  <Inbox size={32} className="text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Aucune notification.</p>
                </div>
              ) : (
                items.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => handleItemClick(n)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex gap-3",
                      !n.is_read && "bg-emerald-50/40 dark:bg-emerald-500/5",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        n.is_read ? "bg-transparent" : DOT[n.type] || "bg-slate-400",
                      )}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm truncate text-slate-900 dark:text-white",
                          !n.is_read && "font-semibold",
                        )}
                      >
                        {n.titre}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
