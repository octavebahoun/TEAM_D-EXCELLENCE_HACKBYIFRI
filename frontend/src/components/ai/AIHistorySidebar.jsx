import { RotateCcw, Trash2, Clock, InboxIcon } from "lucide-react";

/**
 * Sidebar d'historique IA réutilisable — layout 30%.
 *
 * Props :
 *  - items        : array d'entrées historique
 *  - loading      : bool
 *  - onSelect     : (entry) => void  — charge l'entrée dans l'outil
 *  - onRemove     : (historyId) => void  — supprime l'entrée
 *  - onReload     : (entry) => void  — pré-remplit le formulaire pour re-générer
 *  - getTitle     : (entry) => string
 *  - getSubtitle  : (entry) => string
 *  - selectedId   : string | null
 *  - accentColor  : "indigo" | "emerald" | "purple" | "rose" | "amber" | "cyan"
 */

const ACCENT = {
  indigo: {
    border: "border-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    dot: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  emerald: {
    border: "border-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    dot: "bg-purple-500",
    text: "text-purple-600 dark:text-purple-400",
  },
  rose: {
    border: "border-rose-500",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
  },
  amber: {
    border: "border-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  cyan: {
    border: "border-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
    dot: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400",
  },
};

function timeAgo(isoString) {
  if (!isoString) return "";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return `${Math.floor(diff / 86400)} j`;
}

export default function AIHistorySidebar({
  items = [],
  loading = false,
  onSelect,
  onRemove,
  onReload,
  getTitle = (e) => e.filename || "Résultat",
  getSubtitle = () => "",
  selectedId = null,
  accentColor = "indigo",
}) {
  const ac = ACCENT[accentColor] || ACCENT.indigo;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Clock size={14} className="text-slate-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Historique
        </span>
        {items.length > 0 && (
          <span
            className={`ml-auto text-[10px] font-bold ${ac.text} px-2 py-0.5 rounded-full ${ac.bg}`}
          >
            {items.length}
          </span>
        )}
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        {loading ? (
          <div className="space-y-2 p-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center px-4">
            <InboxIcon
              size={32}
              className="text-slate-300 dark:text-slate-700"
            />
            <p className="text-xs text-slate-400 font-medium">
              Aucun historique.
              <br />
              Générez quelque chose !
            </p>
          </div>
        ) : (
          items.map((entry) => {
            const isSelected = entry.history_id === selectedId;
            return (
              <div
                key={entry.history_id}
                className={`group relative mx-2 my-1 rounded-xl px-3 py-2.5 cursor-pointer transition-all border-l-2 ${
                  isSelected
                    ? `${ac.border} ${ac.bg}`
                    : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => onSelect?.(entry)}
              >
                {/* Dot */}
                <div className="flex items-start gap-2">
                  <div
                    className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSelected ? ac.dot : "bg-slate-300 dark:bg-slate-600"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                      {getTitle(entry)}
                    </p>
                    {getSubtitle(entry) && (
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {getSubtitle(entry)}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1">
                      {timeAgo(entry.created_at)}
                    </p>
                  </div>
                </div>

                {/* Actions (apparaissent au hover) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-0.5">
                  <button
                    title="Re-générer avec ces paramètres"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReload?.(entry);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <RotateCcw size={12} />
                  </button>
                  <button
                    title="Supprimer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove?.(entry.history_id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
