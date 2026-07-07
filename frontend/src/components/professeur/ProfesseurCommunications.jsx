import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Megaphone, Clock, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { laravelApiClient } from "../../api/client";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProfesseurCommunications() {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", message: "" });

  const fetchCommunications = async () => {
    try {
      const res = await laravelApiClient.get("/professeur/communications");
      const data = res.data?.communications ?? res.data?.data ?? res.data ?? [];
      setCommunications(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Erreur lors du chargement des communications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    try {
      await laravelApiClient.post("/professeur/communications", formData);
      toast.success("Communication créée avec succès");
      setModalOpen(false);
      setFormData({ title: "", message: "" });
      fetchCommunications();
    } catch (err) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette communication ?")) return;
    try {
      await laravelApiClient.delete(`/professeur/communications/${id}`);
      toast.success("Communication supprimée");
      fetchCommunications();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20" aria-busy="true">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-20"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            Communications
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gérez les communications avec vos étudiants
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors duration-200"
        >
          <Plus size={14} aria-hidden="true" />
          Nouvelle communication
        </button>
      </motion.div>

      {communications.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Megaphone
                size={48}
                className="text-slate-300 dark:text-slate-600 mb-4"
                aria-hidden="true"
              />
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                Aucune communication pour le moment
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                Créez votre première communication
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {communications.map((comm) => (
            <motion.div key={comm.id} variants={itemVariants}>
              <Card className="relative border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Megaphone
                          size={14}
                          className="text-emerald-500 shrink-0"
                          aria-hidden="true"
                        />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {comm.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
                        {comm.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} aria-hidden="true" />
                          {formatDate(comm.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} aria-hidden="true" />
                          Communication
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(comm.id)}
                      aria-label="Supprimer"
                      className="shrink-0 rounded-lg p-2 text-slate-300 dark:text-slate-600 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Nouvelle communication
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  aria-label="Fermer"
                  className="rounded-md p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-5">
                <div>
                  <label
                    htmlFor="comm-title"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                  >
                    Titre
                  </label>
                  <input
                    id="comm-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Titre de la communication"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="comm-message"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="comm-message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Votre message..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-colors"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
