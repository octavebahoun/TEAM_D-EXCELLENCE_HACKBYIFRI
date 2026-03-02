import { AnimatePresence, motion as Motion } from "framer-motion";
import { WifiOff, Wifi, AlertCircle, RefreshCw } from "lucide-react";

// Fonctionnalités qui nécessitent une connexion active
const DISABLED_FEATURES = [
  "Sessions collaboratives",
  "Génération IA (résumés, quiz, podcasts)",
];

export default function OfflineBanner({
  isOnline,
  justReconnected,
  pendingCount = 0,
}) {
  const isVisible = !isOnline || justReconnected;

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div
          key="offline-banner"
          // Slide depuis le haut
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {!isOnline && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
              {/* Icône + titre */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <WifiOff
                    size={16}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                    Mode hors-ligne
                  </p>
                  <p className="text-[11px] text-amber-600/80 dark:text-amber-400/70 font-medium">
                    Données en cache — révisions IA disponibles
                  </p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-amber-200 dark:bg-amber-500/30" />
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={13}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <p className="text-[11px] text-amber-600/80 dark:text-amber-400/70 font-medium">
                  <span className="font-black text-amber-700 dark:text-amber-400">
                    Indisponibles :{" "}
                  </span>
                  {DISABLED_FEATURES.join(" · ")}
                </p>
              </div>

              {/* Badge tâches en attente (affiché seulement si > 0) */}
              {pendingCount > 0 && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-amber-200 dark:bg-amber-500/30" />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <RefreshCw
                      size={12}
                      className="text-amber-500 animate-spin"
                    />
                    <span className="text-[11px] font-black text-amber-700 dark:text-amber-400">
                      {pendingCount} action{pendingCount > 1 ? "s" : ""} en
                      attente de sync
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {isOnline && justReconnected && (
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <Wifi
                  size={16}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  Connexion rétablie
                </p>
                <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70 font-medium">
                  Toutes les fonctionnalités sont de nouveau actives
                </p>
              </div>
            </div>
          )}
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
