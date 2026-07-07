import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Paperclip,
  CalendarClock,
  Megaphone,
  Inbox,
} from "lucide-react";

const TYPE_META = {
  info: { label: "Information", variant: "secondary" },
  annulation: { label: "Cours annulé", variant: "destructive" },
  rattrapage: { label: "Rattrapage", variant: "default" },
  support: { label: "Support de cours", variant: "outline" },
  regle: { label: "Règle de classe", variant: "outline" },
};

const fmt = (value) =>
  value
    ? new Date(value).toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

export default function CommunicationsFeed({
  items = [],
  loading = false,
  onDelete,
  canDelete = false,
  emptyLabel = "Aucune communication.",
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="grid place-items-center text-center py-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        <Inbox className="text-slate-300 dark:text-slate-700 mb-3" size={40} />
        <p className="text-slate-500 dark:text-slate-400 max-w-xs">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {items.map((c) => {
          const meta = TYPE_META[c.type] || TYPE_META.info;
          return (
            <motion.article
              key={c.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={meta.variant}>{meta.label}</Badge>
                  {c.filiere?.nom && (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {c.filiere.nom}
                    </span>
                  )}
                </div>
                {canDelete && onDelete && (
                  <button
                    onClick={() => onDelete(c.id)}
                    className="text-slate-300 hover:text-destructive transition-colors shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                {c.titre}
              </h3>
              {c.message && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {c.message}
                </p>
              )}

              {c.date_evenement && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  <CalendarClock size={14} /> {fmt(c.date_evenement)}
                </p>
              )}

              {c.fichier_url && (
                <a
                  href={c.fichier_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Paperclip size={14} />
                  {c.fichier_nom || "Télécharger le support"}
                </a>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Megaphone size={12} />
                <span>
                  {c.auteur_nom || "Auteur"}
                  {c.auteur_type ? ` • ${c.auteur_type}` : ""}
                </span>
                <span className="ml-auto">{fmt(c.created_at)}</span>
              </div>
            </motion.article>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
