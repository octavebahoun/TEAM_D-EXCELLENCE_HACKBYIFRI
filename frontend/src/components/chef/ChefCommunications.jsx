import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Plus,
  X,
  Send,
  Trash2,
  Info,
  AlertTriangle,
  AlertOctagon,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { departementService } from "../../services/departementService";
import { toast } from "react-hot-toast";
import { cn } from "../../utils/cn";

const typeConfig = {
  info: {
    label: "Information",
    icon: Info,
    badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    dot: "bg-blue-500",
  },
  alert: {
    label: "Alerte",
    icon: AlertTriangle,
    badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
    dot: "bg-amber-500",
  },
  important: {
    label: "Important",
    icon: AlertOctagon,
    badge: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20",
    dot: "bg-red-500",
  },
};

const destinatorOptions = [
  { value: "all", label: "Tout le monde" },
  { value: "etudiants", label: "Étudiants" },
  { value: "enseignants", label: "Enseignants" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChefCommunications() {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    destinator: "all",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCommunications();
  }, []);

  const fetchCommunications = async () => {
    setLoading(true);
    try {
      const response = await departementService.getCommunications();
      setCommunications(response.data || response || []);
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors du chargement";
      toast.error(message);
      setCommunications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setSubmitting(true);
    try {
      await departementService.createCommunication({
        title: formData.title,
        message: formData.message,
        type: formData.type,
        destinator: formData.destinator,
      });
      toast.success("Communication publiée avec succès");
      setFormData({ title: "", message: "", type: "info", destinator: "all" });
      setIsModalOpen(false);
      fetchCommunications();
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la création";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette communication ?")) return;
    setDeletingId(id);
    try {
      await departementService.deleteCommunication(id);
      toast.success("Communication supprimée");
      fetchCommunications();
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la suppression";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const ComTypeIcon = typeConfig[formData.type]?.icon || Info;

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 pb-12"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-lg font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">
              Communications
            </h2>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              {communications.length} annonce{communications.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus size={16} /> Nouvelle Communication
          </button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : communications.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl"
          >
            <Megaphone size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
              Aucune communication pour le moment
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <Plus size={13} /> Publier une annonce
            </button>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} className="space-y-4">
            {communications.map((comm, idx) => {
              const type = typeConfig[comm.type] || typeConfig.info;
              const TypeIcon = type.icon;
              return (
                <motion.div
                  key={comm.id || idx}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5", type.badge)}>
                        <TypeIcon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {comm.title}
                          </h3>
                          <span className={cn("inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border", type.badge)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", type.dot)} />
                            {type.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap leading-relaxed">
                          {comm.message}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            <Calendar size={11} /> {formatDate(comm.created_at)}
                          </span>
                          {comm.destinator && (
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                              · {destinatorOptions.find(o => o.value === comm.destinator)?.label || comm.destinator}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(comm.id)}
                      disabled={deletingId === comm.id}
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-50"
                    >
                      {deletingId === comm.id ? (
                        <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-white/20 my-8"
            >
              <div className="p-4 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Nouvelle Communication
                  </h3>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                    Publier une annonce
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-3">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Titre
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Megaphone size={18} />
                      </div>
                      <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Titre de l'annonce"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Type
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <ComTypeIcon size={18} />
                        </div>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                        >
                          {Object.entries(typeConfig).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Destinataires
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Send size={18} />
                        </div>
                        <select
                          value={formData.destinator}
                          onChange={(e) => setFormData({ ...formData, destinator: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                        >
                          {destinatorOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Message
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-4 text-slate-400">
                        <Megaphone size={18} />
                      </div>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Écrivez votre message ici..."
                        rows={5}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-500 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Publier <Send size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
