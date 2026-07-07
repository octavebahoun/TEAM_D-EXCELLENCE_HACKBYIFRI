import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { departementService } from "../../services/departementService";
import { toast } from "react-hot-toast";
import { Plus, Pencil, Trash2, BookOpen, X, ChevronDown, ChevronUp } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const initialFormState = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  specialite: "",
  grade: "",
};

export default function ChefEnseignants() {
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnseignant, setEditingEnseignant] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [assigningMatieres, setAssigningMatieres] = useState([]);
  const [assignedMatiereIds, setAssignedMatiereIds] = useState(new Set());
  const [assignLoading, setAssignLoading] = useState(false);
  const [matieresLoading, setMatieresLoading] = useState(false);

  useEffect(() => {
    fetchEnseignants();
    fetchMatieres();
  }, []);

  const fetchEnseignants = async () => {
    setLoading(true);
    try {
      const response = await departementService.getEnseignants();
      setEnseignants(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des enseignants");
    } finally {
      setLoading(false);
    }
  };

  const fetchMatieres = async () => {
    try {
      const response = await departementService.getMatieres();
      setMatieres(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Erreur chargement matières:", error);
    }
  };

  const openAddModal = () => {
    setEditingEnseignant(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (enseignant) => {
    setEditingEnseignant(enseignant);
    setForm({
      nom: enseignant.nom || "",
      prenom: enseignant.prenom || "",
      email: enseignant.email || "",
      telephone: enseignant.telephone || "",
      specialite: enseignant.specialite || "",
      grade: enseignant.grade || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEnseignant(null);
    setForm(initialFormState);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingEnseignant) {
        await departementService.updateEnseignant(editingEnseignant.id, form);
        toast.success("Enseignant modifié avec succès");
      } else {
        await departementService.createEnseignant(form);
        toast.success("Enseignant ajouté avec succès");
      }
      closeModal();
      fetchEnseignants();
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de l'enregistrement";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (enseignant) => {
    if (!confirm(`Supprimer l'enseignant "${enseignant.prenom} ${enseignant.nom}" ? Cette action est irréversible.`)) return;
    try {
      await departementService.deleteEnseignant(enseignant.id);
      toast.success("Enseignant supprimé avec succès");
      fetchEnseignants();
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la suppression";
      toast.error(message);
    }
  };

  const toggleExpand = async (enseignant) => {
    if (expandedId === enseignant.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(enseignant.id);
    setAssigningId(null);
    try {
      const response = await departementService.getEnseignant(enseignant.id);
      const data = response.data || response;
      const ids = new Set((data.matieres || []).map((m) => m.id));
      setAssignedMatiereIds(ids);
    } catch (error) {
      console.error("Erreur chargement matières enseignant:", error);
    }
  };

  const openAssignMatieres = async (enseignant) => {
    setAssigningId(enseignant.id);
    setMatieresLoading(true);
    try {
      const response = await departementService.getEnseignant(enseignant.id);
      const data = response.data || response;
      const ids = new Set((data.matieres || []).map((m) => m.id));
      setAssignedMatiereIds(ids);
      if (matieres.length === 0) {
        await fetchMatieres();
      }
    } catch (error) {
      console.error("Erreur chargement matières:", error);
    } finally {
      setMatieresLoading(false);
    }
  };

  const closeAssignMatieres = () => {
    setAssigningId(null);
    fetchEnseignants();
  };

  const toggleMatiere = async (matiereId) => {
    setAssignLoading(true);
    try {
      if (assignedMatiereIds.has(matiereId)) {
        await departementService.removeMatiereFromEnseignant(assigningId, matiereId);
        setAssignedMatiereIds((prev) => {
          const next = new Set(prev);
          next.delete(matiereId);
          return next;
        });
        toast.success("Matière retirée");
      } else {
        await departementService.assignMatiereToEnseignant(assigningId, matiereId);
        setAssignedMatiereIds((prev) => new Set(prev).add(matiereId));
        toast.success("Matière assignée");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la modification";
      toast.error(message);
    } finally {
      setAssignLoading(false);
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
              Gestion des Enseignants
            </h2>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              {enseignants.length} Enseignant{enseignants.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full md:w-auto">
            <button
              onClick={openAddModal}
              className="flex-1 md:flex-none bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-slate-900 transition-all shadow-md active:scale-95"
            >
              <Plus size={16} /> Nouvel Enseignant
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
            {enseignants.map((enseignant) => (
              <motion.div
                key={enseignant.id}
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                        {enseignant.prenom?.charAt(0) || "E"}
                        {enseignant.nom?.charAt(0) || ""}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                          {enseignant.prenom} {enseignant.nom}
                        </h3>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                          {enseignant.grade || "Grade non défini"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(enseignant)}
                        className="text-slate-400 hover:text-amber-500 transition-colors p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(enseignant)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl col-span-2 sm:col-span-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Email
                      </p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                        {enseignant.email || "—"}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl col-span-2 sm:col-span-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Téléphone
                      </p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {enseignant.telephone || "—"}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Spécialité
                      </p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {enseignant.specialite || "—"}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Grade
                      </p>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {enseignant.grade || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <button
                      onClick={() => toggleExpand(enseignant)}
                      className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <BookOpen size={14} />
                      {expandedId === enseignant.id ? "Masquer les matières" : "Voir les matières"}
                      {expandedId === enseignant.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button
                      onClick={() => openAssignMatieres(enseignant)}
                      className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-[10px] px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all border border-slate-200 dark:border-slate-700"
                    >
                      Assigner
                    </button>
                  </div>

                  {expandedId === enseignant.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-5 pt-5 border-t border-slate-50 dark:border-slate-800"
                    >
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 max-h-48 overflow-y-auto custom-scrollbar">
                        {assignedMatiereIds.size === 0 ? (
                          <p className="text-[10px] font-bold text-slate-400 text-center py-4 uppercase">
                            Aucune matière assignée
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {matieres
                              .filter((m) => assignedMatiereIds.has(m.id))
                              .map((matiere) => (
                                <div
                                  key={matiere.id}
                                  className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm"
                                >
                                  <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                      {matiere.nom}
                                    </p>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
                                      {matiere.code}
                                    </p>
                                  </div>
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

      <AnimatePresence>
        {assigningId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeAssignMatieres}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Assigner des matières
                </h3>
                <button
                  onClick={closeAssignMatieres}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {matieresLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  </div>
                ) : matieres.length === 0 ? (
                  <p className="text-xs font-bold text-slate-400 text-center py-10 uppercase">
                    Aucune matière disponible
                  </p>
                ) : (
                  <div className="space-y-2">
                    {matieres.map((matiere) => {
                      const isAssigned = assignedMatiereIds.has(matiere.id);
                      return (
                        <button
                          key={matiere.id}
                          onClick={() => toggleMatiere(matiere.id)}
                          disabled={assignLoading}
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left disabled:opacity-60 ${
                            isAssigned
                              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800"
                              : "bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {matiere.nom}
                            </p>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
                              {matiere.code}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              isAssigned
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            {isAssigned && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {editingEnseignant ? "Modifier l'enseignant" : "Nouvel enseignant"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={form.nom}
                      onChange={handleChange}
                      required
                      placeholder="Nom"
                      className="w-full px-3.5 py-3 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={form.prenom}
                      onChange={handleChange}
                      required
                      placeholder="Prénom"
                      className="w-full px-3.5 py-3 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="enseignant@universite.edu"
                    className="w-full px-3.5 py-3 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    placeholder="+225 00 00 00 00 00"
                    className="w-full px-3.5 py-3 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Spécialité
                    </label>
                    <input
                      type="text"
                      name="specialite"
                      value={form.specialite}
                      onChange={handleChange}
                      placeholder="Informatique, Mathématiques..."
                      className="w-full px-3.5 py-3 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Grade
                    </label>
                    <select
                      name="grade"
                      value={form.grade}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all appearance-none"
                    >
                      <option value="">Sélectionner un grade</option>
                      <option value="Professeur">Professeur</option>
                      <option value="Maître de Conférences">Maître de Conférences</option>
                      <option value="Maître Assistant">Maître Assistant</option>
                      <option value="Assistant">Assistant</option>
                      <option value="Attaché">Attaché</option>
                      <option value="Vacataire">Vacataire</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-3 text-xs font-bold text-white uppercase tracking-widest rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      editingEnseignant ? "Modifier" : "Ajouter"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
