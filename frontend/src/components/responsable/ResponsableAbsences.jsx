import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  User,
  Users,
  AlertTriangle,
  Check,
  X as XIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useState, useEffect, useRef } from "react";
import { laravelApiClient } from "../../api/client";
import { toast } from "react-hot-toast";

const SEANCES = ["08:00-10:00", "10:00-12:00", "13:00-15:00", "15:00-17:00"];

export default function ResponsableAbsences() {
  const [absences, setAbsences] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [etudiants, setEtudiants] = useState([]);

  const [formData, setFormData] = useState({
    user_id: "",
    date: new Date().toISOString().split("T")[0],
    seance: "",
    justifie: false,
  });

  useEffect(() => {
    fetchAbsences();
    fetchStats();
    fetchEtudiants();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAbsences = async () => {
    try {
      const res = await laravelApiClient.get("/responsable/absences");
      setAbsences(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Erreur absences:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await laravelApiClient.get("/responsable/absences/stats");
      setStats(res.data || { total: 0, today: 0 });
    } catch (error) {
      console.error("Erreur stats:", error);
    }
  };

  const fetchEtudiants = async () => {
    try {
      const res = await laravelApiClient.get("/responsable/etudiants");
      setEtudiants(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Erreur étudiants:", error);
    }
  };

  const openCreateModal = () => {
    setEditingAbsence(null);
    setFormData({
      user_id: "",
      date: new Date().toISOString().split("T")[0],
      seance: "",
      justifie: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (absence) => {
    setEditingAbsence(absence);
    setFormData({
      user_id: absence.user_id?.toString() || "",
      date: absence.date || new Date().toISOString().split("T")[0],
      seance: absence.seance || "",
      justifie: absence.justifie || false,
    });
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.seance) {
      toast.error("Veuillez sélectionner une séance");
      return;
    }
    setModalLoading(true);
    try {
      const payload = {
        user_id: parseInt(formData.user_id, 10),
        date: formData.date,
        seance: formData.seance,
        justifie: formData.justifie,
      };

      if (editingAbsence) {
        await laravelApiClient.put(`/responsable/absences/${editingAbsence.id}`, payload);
        toast.success("Absence modifiée avec succès");
      } else {
        await laravelApiClient.post("/responsable/absences", payload);
        toast.success("Absence enregistrée avec succès");
      }

      setIsModalOpen(false);
      setEditingAbsence(null);
      fetchAbsences();
      fetchStats();
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
      toast.error(message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (absence) => {
    if (!confirm("Supprimer cette absence ? Cette action est irréversible.")) return;
    setOpenMenuId(null);
    try {
      await laravelApiClient.delete(`/responsable/absences/${absence.id}`);
      toast.success("Absence supprimée");
      fetchAbsences();
      fetchStats();
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la suppression";
      toast.error(message);
    }
  };

  const handleToggleJustifie = async (absence) => {
    try {
      await laravelApiClient.put(`/responsable/absences/${absence.id}`, {
        ...absence,
        justifie: !absence.justifie,
        user_id: absence.user_id,
      });
      toast.success(absence.justifie ? "Marqué comme non justifié" : "Marqué comme justifié");
      fetchAbsences();
      fetchStats();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
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
            Gestion des Absences
          </h2>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            {absences.length} Absence{absences.length > 1 ? "s" : ""} enregistrée{absences.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex-1 md:flex-none bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-slate-900 transition-all shadow-md active:scale-95"
        >
          <Plus size={16} /> Nouvelle Absence
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Absences</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.total || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aujourd'hui</p>
          <p className="text-3xl font-black text-emerald-500">{stats.today || 0}</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : absences.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 shadow-sm text-center"
        >
          <AlertTriangle size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Aucune absence trouvée
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all mx-auto"
          >
            <Plus size={16} /> Ajouter une absence
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {absences.map((absence) => (
            <motion.div
              key={absence.id}
              variants={itemVariants}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-sm shrink-0">
                    {absence.etudiant?.nom?.charAt(0) || absence.user?.nom?.charAt(0) || "?"}
                    {absence.etudiant?.prenom?.charAt(0) || absence.user?.prenom?.charAt(0) || ""}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                      {absence.etudiant
                        ? `${absence.etudiant.nom} ${absence.etudiant.prenom}`
                        : absence.user
                          ? `${absence.user.nom} ${absence.user.prenom}`
                          : `Étudiant #${absence.user_id}`}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {absence.matiere?.nom || ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <Calendar size={12} />
                    {absence.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <Clock size={12} />
                    {absence.seance}
                  </div>
                  <button
                    onClick={() => handleToggleJustifie(absence)}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all",
                      absence.justifie
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400"
                    )}
                  >
                    {absence.justifie ? "Justifié" : "Absent"}
                  </button>
                  <div className="relative" ref={openMenuId === absence.id ? menuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === absence.id ? null : absence.id);
                      }}
                      className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <MoreVertical size={18} />
                    </button>
                    <AnimatePresence>
                      {openMenuId === absence.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute right-0 top-8 z-50 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden min-w-40"
                        >
                          <button
                            onClick={() => openEditModal(absence)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors uppercase tracking-widest"
                          >
                            <Pencil size={14} />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(absence)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors uppercase tracking-widest"
                          >
                            <Trash2 size={14} />
                            Supprimer
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto">
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
                    {editingAbsence ? "Modifier l'absence" : "Nouvelle Absence"}
                  </h3>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                    {editingAbsence ? "Modifier les informations" : "Saisie d'une absence"}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Étudiant
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <User size={18} />
                    </div>
                    <select
                      required
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Sélectionner un étudiant</option>
                      {etudiants.map((etud) => (
                        <option key={etud.id} value={etud.id}>
                          {etud.nom} {etud.prenom} — {etud.matricule}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Calendar size={18} />
                      </div>
                      <input
                        required
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Séance
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Clock size={18} />
                      </div>
                      <select
                        required
                        value={formData.seance}
                        onChange={(e) => setFormData({ ...formData, seance: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                      >
                        <option value="">Sélectionner</option>
                        {SEANCES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, justifie: !formData.justifie })}
                    className={cn(
                      "flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl border-2 transition-all",
                      formData.justifie
                        ? "bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 border-red-300 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400"
                    )}
                  >
                    {formData.justifie ? <Check size={16} /> : <XIcon size={16} />}
                    {formData.justifie ? "Justifié" : "Non Justifié"}
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Cliquez pour basculer
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="w-full bg-emerald-500 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {modalLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>{editingAbsence ? "Modifier" : "Enregistrer"}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
