import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  Plus,
  X,
  Pencil,
  Trash2,
  DoorOpen,
  Users,
  Calendar,
  Clock,
  Hash,
  BookOpen,
  Send,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useState, useEffect, useRef } from "react";
import { departementService } from "../../services/departementService";
import { toast } from "react-hot-toast";

export default function ChefSalles() {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [salleToEdit, setSalleToEdit] = useState(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [salleToReserve, setSalleToReserve] = useState(null);
  const [expandedSalleId, setExpandedSalleId] = useState(null);
  const [disponibilites, setDisponibilites] = useState({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    fetchSalles();
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

  const fetchSalles = async () => {
    setLoading(true);
    try {
      const response = await departementService.getSalles();
      setSalles(response);
    } catch (error) {
      console.error("Erreur salles:", error);
      toast.error("Erreur lors du chargement des salles");
    } finally {
      setLoading(false);
    }
  };

  const fetchDisponibilite = async (salleId) => {
    try {
      const response = await departementService.getSalleDisponibilite({ salle_id: salleId });
      setDisponibilites((prev) => ({ ...prev, [salleId]: response }));
    } catch (error) {
      console.error("Erreur disponibilité:", error);
      toast.error("Erreur lors du chargement des disponibilités");
    }
  };

  const toggleExpand = (salleId) => {
    if (expandedSalleId === salleId) {
      setExpandedSalleId(null);
      return;
    }
    setExpandedSalleId(salleId);
    if (!disponibilites[salleId]) {
      fetchDisponibilite(salleId);
    }
  };

  const handleEditSalle = (salle) => {
    setSalleToEdit(salle);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteSalle = async (salle) => {
    if (
      !confirm(
        `Supprimer la salle "${salle.nom}" ? Cette action est irréversible.`,
      )
    )
      return;
    setIsDeleting(true);
    setOpenMenuId(null);
    try {
      await departementService.deleteSalle(salle.id);
      toast.success("Salle supprimée avec succès");
      fetchSalles();
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la suppression";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReserve = (salle) => {
    setSalleToReserve(salle);
    setIsReserveModalOpen(true);
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "td":
      case "tp":
      case "laboratoire":
        return "bg-amber-50 text-amber-600 dark:bg-amber-500/10";
      case "amphi":
      case "amphithéâtre":
        return "bg-purple-50 text-purple-600 dark:bg-purple-500/10";
      default:
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10";
    }
  };

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
              Gestion des Salles
            </h2>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              {salles.length} Salles disponibles
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 md:flex-none bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-slate-900 transition-all shadow-md active:scale-95"
            >
              <Plus size={16} /> Nouvelle Salle
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 xl:grid-cols-2 gap-6"
          >
            {salles.map((salle) => (
              <motion.div
                key={salle.id}
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform",
                        getTypeIcon(salle.type)
                      )}>
                        <DoorOpen size={22} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          {salle.nom}
                        </h3>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                          {salle.code} • {salle.type || "Standard"}
                        </p>
                      </div>
                    </div>
                    <div
                      className="relative"
                      ref={openMenuId === salle.id ? menuRef : null}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === salle.id ? null : salle.id,
                          );
                        }}
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <MoreVertical size={20} />
                      </button>

                      <AnimatePresence>
                        {openMenuId === salle.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-0 top-8 z-50 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden min-w-40"
                          >
                            <button
                              onClick={() => handleEditSalle(salle)}
                              className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors uppercase tracking-widest"
                            >
                              <Pencil size={14} />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleReserve(salle)}
                              className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest"
                            >
                              <Calendar size={14} />
                              Réserver
                            </button>
                            <button
                              onClick={() => handleDeleteSalle(salle)}
                              disabled={isDeleting}
                              className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors uppercase tracking-widest disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              Supprimer
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <Users size={18} className="mx-auto text-slate-400 mb-1" />
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        {salle.capacite || 0}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Capacité
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <Hash size={18} className="mx-auto text-slate-400 mb-1" />
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px] mx-auto">
                        {salle.code}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Code
                      </p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <BookOpen size={18} className="mx-auto text-slate-400 mb-1" />
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px] mx-auto">
                        {salle.type || "Standard"}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Type
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {salle.disponibilites && salle.disponibilites.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-emerald-500">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-bold">{salle.disponibilites.length} créneaux</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Info size={14} />
                            <span className="text-[10px] font-bold">Aucune disponibilité</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(salle.id)}
                      className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-[10px] px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all border border-slate-200 dark:border-slate-700"
                    >
                      {expandedSalleId === salle.id
                        ? "Masquer Disponibilités"
                        : "Voir Disponibilités"}
                    </button>
                  </div>

                  {expandedSalleId === salle.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800"
                    >
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 min-h-25">
                        {!disponibilites[salle.id] ? (
                          <div className="flex justify-center items-center py-4">
                            <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                          </div>
                        ) : Array.isArray(disponibilites[salle.id]) &&
                          disponibilites[salle.id].length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                              Aucune disponibilité enregistrée
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {(Array.isArray(disponibilites[salle.id])
                              ? disponibilites[salle.id]
                              : []
                            ).map((dispo, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                    <Clock size={14} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                      {dispo.jour || dispo.day || "N/A"}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                                      {dispo.heure_debut?.slice(0, 5) || dispo.start_time?.slice(0, 5) || "N/A"} - {dispo.heure_fin?.slice(0, 5) || dispo.end_time?.slice(0, 5) || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <span className={cn(
                                  "text-[9px] px-2 py-1 rounded-full font-bold uppercase tracking-wider",
                                  dispo.disponible || dispo.available
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                                    : "bg-red-50 text-red-600 dark:bg-red-500/10"
                                )}>
                                  {dispo.disponible || dispo.available ? "Libre" : "Occupé"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <AddSalleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchSalles}
      />

      <EditSalleModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSalleToEdit(null);
        }}
        onSuccess={fetchSalles}
        salle={salleToEdit}
      />

      <ReserveSalleModal
        isOpen={isReserveModalOpen}
        onClose={() => {
          setIsReserveModalOpen(false);
          setSalleToReserve(null);
        }}
        onSuccess={() => {
          if (salleToReserve && disponibilites[salleToReserve.id]) {
            fetchDisponibilite(salleToReserve.id);
          }
          fetchSalles();
        }}
        salle={salleToReserve}
      />
    </>
  );
}

function AddSalleModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    capacite: "",
    type: "",
    disponibilites: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        capacite: parseInt(formData.capacite, 10) || 0,
      };
      if (payload.disponibilites) {
        try {
          payload.disponibilites = JSON.parse(payload.disponibilites);
        } catch {
          toast.error("Format JSON invalide pour les disponibilités");
          setIsLoading(false);
          return;
        }
      } else {
        delete payload.disponibilites;
      }
      await departementService.createSalle(payload);
      toast.success("Salle créée avec succès !");
      onSuccess();
      onClose();
      setFormData({
        nom: "",
        code: "",
        capacite: "",
        type: "",
        disponibilites: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la création";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  Nouvelle Salle
                </h3>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                  Ajouter une salle au département
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-3">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nom de la Salle
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <DoorOpen size={18} />
                    </div>
                    <input
                      required
                      type="text"
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      placeholder="Ex: Salle 101"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Code
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Hash size={18} />
                      </div>
                      <input
                        required
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="Ex: S101"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Capacité
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Users size={18} />
                      </div>
                      <input
                        required
                        type="number"
                        min="1"
                        value={formData.capacite}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            capacite: e.target.value,
                          })
                        }
                        placeholder="Ex: 30"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Type de Salle
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <BookOpen size={18} />
                    </div>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Cours">Cours</option>
                      <option value="TD">TD</option>
                      <option value="TP">TP</option>
                      <option value="Amphithéâtre">Amphithéâtre</option>
                      <option value="Laboratoire">Laboratoire</option>
                      <option value="Réunion">Réunion</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Disponibilités (JSON - Optionnel)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-slate-400">
                      <Calendar size={18} />
                    </div>
                    <textarea
                      value={formData.disponibilites}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          disponibilites: e.target.value,
                        })
                      }
                      placeholder='[{"jour":"Lundi","heure_debut":"08:00","heure_fin":"10:00"}]'
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Créer la Salle <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function EditSalleModal({ isOpen, onClose, onSuccess, salle }) {
  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    capacite: "",
    type: "",
    disponibilites: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (salle) {
      setFormData({
        nom: salle.nom || "",
        code: salle.code || "",
        capacite: salle.capacite?.toString() || "",
        type: salle.type || "",
        disponibilites: salle.disponibilites
          ? JSON.stringify(salle.disponibilites, null, 2)
          : "",
      });
    }
  }, [salle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        capacite: parseInt(formData.capacite, 10) || 0,
      };
      if (payload.disponibilites) {
        try {
          payload.disponibilites = JSON.parse(payload.disponibilites);
        } catch {
          toast.error("Format JSON invalide pour les disponibilités");
          setIsLoading(false);
          return;
        }
      } else {
        delete payload.disponibilites;
      }
      await departementService.updateSalle(salle.id, payload);
      toast.success("Salle modifiée avec succès !");
      onSuccess();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la modification";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  Modifier la Salle
                </h3>
                <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">
                  {salle?.nom} • {salle?.code}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-3">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nom de la Salle
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <DoorOpen size={18} />
                    </div>
                    <input
                      required
                      type="text"
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      placeholder="Ex: Salle 101"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Code
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Hash size={18} />
                      </div>
                      <input
                        required
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="Ex: S101"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Capacité
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Users size={18} />
                      </div>
                      <input
                        required
                        type="number"
                        min="1"
                        value={formData.capacite}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            capacite: e.target.value,
                          })
                        }
                        placeholder="Ex: 30"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Type de Salle
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <BookOpen size={18} />
                    </div>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Cours">Cours</option>
                      <option value="TD">TD</option>
                      <option value="TP">TP</option>
                      <option value="Amphithéâtre">Amphithéâtre</option>
                      <option value="Laboratoire">Laboratoire</option>
                      <option value="Réunion">Réunion</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Disponibilités (JSON - Optionnel)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-slate-400">
                      <Calendar size={18} />
                    </div>
                    <textarea
                      value={formData.disponibilites}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          disponibilites: e.target.value,
                        })
                      }
                      placeholder='[{"jour":"Lundi","heure_debut":"08:00","heure_fin":"10:00"}]'
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-600 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Modifier la Salle <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ReserveSalleModal({ isOpen, onClose, onSuccess, salle }) {
  const [formData, setFormData] = useState({
    date: "",
    heure_debut: "",
    heure_fin: "",
    motif: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salle) return;
    setIsLoading(true);
    try {
      await departementService.reserverSalle(salle.id, formData);
      toast.success(`Salle "${salle.nom}" réservée avec succès !`);
      onSuccess();
      onClose();
      setFormData({
        date: "",
        heure_debut: "",
        heure_fin: "",
        motif: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la réservation";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  Réserver une Salle
                </h3>
                <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">
                  {salle?.nom} • {salle?.code}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-3">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Calendar size={18} />
                      </div>
                      <input
                        required
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Heure de début
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Clock size={18} />
                      </div>
                      <input
                        required
                        type="time"
                        value={formData.heure_debut}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            heure_debut: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Heure de fin
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Clock size={18} />
                      </div>
                      <input
                        required
                        type="time"
                        value={formData.heure_fin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            heure_fin: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Motif
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Info size={18} />
                      </div>
                      <input
                        required
                        type="text"
                        value={formData.motif}
                        onChange={(e) =>
                          setFormData({ ...formData, motif: e.target.value })
                        }
                        placeholder="Ex: Cours de Maths"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirmer la Réservation <Calendar size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
