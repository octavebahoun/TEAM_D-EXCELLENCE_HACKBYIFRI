import { motion } from "framer-motion";
import {
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  CheckCheck,
  Search,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useState, useEffect, useMemo } from "react";
import { departementService } from "../../services/departementService";
import { toast } from "react-hot-toast";

const STATUT_LABELS = {
  en_attente: "En attente",
  valide: "Valid\u00e9e",
  invalide: "Invalid\u00e9e",
};

const STATUT_BADGE = {
  en_attente:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  valide:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  invalide:
    "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-800",
};

const STATUT_ICON = {
  en_attente: Clock,
  valide: CheckCircle2,
  invalide: XCircle,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function ChefNotesValidation() {
  const [notes, setNotes] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filters, setFilters] = useState({
    filiere_id: "",
    matiere_id: "",
    statut: "",
  });

  useEffect(() => {
    departementService.getFilieres().then((res) => {
      const data = res?.data || res || [];
      setFilieres(Array.isArray(data) ? data : []);
    }).catch(() => {});
    departementService.getMatieres().then((res) => {
      const data = res?.data || res || [];
      setMatieres(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [filters]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.filiere_id) params.filiere_id = filters.filiere_id;
      if (filters.matiere_id) params.matiere_id = filters.matiere_id;
      if (filters.statut) params.statut = filters.statut;
      const response = await departementService.getNotes(params);
      const data = response?.data?.data || response?.data || response || [];
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error?.response?.data?.message || "Erreur lors du chargement des notes";
      toast.error(message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = notes.length;
    const en_attente = notes.filter((n) => n.statut === "en_attente").length;
    const validees = notes.filter((n) => n.statut === "valide").length;
    const invalidees = notes.filter((n) => n.statut === "invalide").length;
    return { total, en_attente, validees, invalidees };
  }, [notes]);

  const handleValidate = async (id) => {
    setActionLoading(id);
    try {
      await departementService.validerNote(id);
      toast.success("Note valid\u00e9e avec succ\u00e8s");
      fetchNotes();
    } catch (error) {
      const message = error?.response?.data?.message || "Erreur lors de la validation";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleInvalidate = async (id) => {
    setActionLoading(id);
    try {
      await departementService.invaliderNote(id);
      toast.success("Note invalid\u00e9e");
      fetchNotes();
    } catch (error) {
      const message = error?.response?.data?.message || "Erreur lors de l'invalidation";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBatchValidate = async () => {
    if (selectedIds.size === 0) {
      toast.error("S\u00e9lectionnez au moins une note");
      return;
    }
    setBatchLoading(true);
    try {
      await departementService.validerLotNotes(Array.from(selectedIds));
      toast.success(`${selectedIds.size} note(s) valid\u00e9e(s)`);
      setSelectedIds(new Set());
      fetchNotes();
    } catch (error) {
      const message = error?.response?.data?.message || "Erreur lors de la validation par lot";
      toast.error(message);
    } finally {
      setBatchLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === notes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notes.map((n) => n.id)));
    }
  };

  const selectableNotes = useMemo(
    () => notes.filter((n) => n.statut === "en_attente"),
    [notes]
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelectedIds(new Set());
  };

  const clearFilters = () => {
    setFilters({ filiere_id: "", matiere_id: "", statut: "" });
    setSelectedIds(new Set());
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const statCards = [
    { label: "Total", value: stats.total, color: "text-slate-900 dark:text-white", bg: "bg-slate-50 dark:bg-slate-800/50" },
    { label: "En attente", value: stats.en_attente, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/5" },
    { label: "Valid\u00e9es", value: stats.validees, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/5" },
    { label: "Invalid\u00e9es", value: stats.invalidees, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/5" },
  ];

  const selectClass =
    "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-4 pr-10 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none w-full";

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
            Validation des Notes
          </h2>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            {notes.length} note{notes.length > 1 ? "s" : ""} enregistr\u00e9e{notes.length > 1 ? "s" : ""}
          </p>
        </div>
        {selectedIds.size > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleBatchValidate}
            disabled={batchLoading}
            className="bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
          >
            {batchLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCheck size={16} />
            )}
            Valider ({selectedIds.size})
          </motion.button>
        )}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm",
              stat.bg
            )}
          >
            <p className={cn("text-2xl font-black font-display tabular-nums leading-none", stat.color)}>
              {stat.value}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 w-full space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Fili\u00e8re
            </label>
            <div className="relative">
              <select
                value={filters.filiere_id}
                onChange={(e) => handleFilterChange("filiere_id", e.target.value)}
                className={selectClass}
              >
                <option value="">Toutes les fili\u00e8res</option>
                {filieres.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nom}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Filter size={14} />
              </div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Mati\u00e8re
            </label>
            <div className="relative">
              <select
                value={filters.matiere_id}
                onChange={(e) => handleFilterChange("matiere_id", e.target.value)}
                className={selectClass}
              >
                <option value="">Toutes les mati\u00e8res</option>
                {matieres.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nom}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Filter size={14} />
              </div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Statut
            </label>
            <div className="relative">
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange("statut", e.target.value)}
                className={selectClass}
              >
                <option value="">Tous les statuts</option>
                {Object.entries(STATUT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Filter size={14} />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="shrink-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <RotateCcw size={14} />
              R\u00e9initialiser
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16">
            <Search size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Aucune note trouv\u00e9e
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 text-[10px] font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-widest"
              >
                R\u00e9initialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="hidden md:grid grid-cols-[40px_2fr_1.5fr_1fr_1fr_1fr_180px] gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.size === notes.length && notes.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">\u00c9tudiant</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mati\u00e8re</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Note</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coefficient</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notes.map((note) => {
                const isSelected = selectedIds.has(note.id);
                const isEnAttente = note.statut === "en_attente";
                const StatutIcon = STATUT_ICON[note.statut] || Clock;
                const etudiant = note.etudiant || note.user || {};
                const etudiantNom = etudiant.nom && etudiant.prenom
                  ? `${etudiant.nom} ${etudiant.prenom}`
                  : etudiant.nom || etudiant.name || "N/A";
                const matiereNom = note.matiere?.nom || note.matiere_nom || "N/A";

                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "grid grid-cols-1 md:grid-cols-[40px_2fr_1.5fr_1fr_1fr_1fr_180px] gap-3 md:gap-4 px-6 py-4 items-center transition-colors",
                      isSelected
                        ? "bg-emerald-50/50 dark:bg-emerald-500/5"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    )}
                  >
                    <div className="flex items-center justify-start md:justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(note.id)}
                        disabled={!isEnAttente}
                        className={cn(
                          "w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer",
                          !isEnAttente && "opacity-30 cursor-not-allowed"
                        )}
                      />
                    </div>

                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0">
                        {etudiantNom.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {etudiantNom}
                        </p>
                        {etudiant.matricule && (
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                            {etudiant.matricule}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {matiereNom}
                      </p>
                      {note.matiere?.code && (
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {note.matiere.code}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-base font-black text-slate-900 dark:text-white tabular-nums">
                        {note.note ?? "—"}
                        <span className="text-[10px] font-bold text-slate-400">
                          /{note.note_max ?? 20}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {note.coefficient ?? 1}
                      </p>
                    </div>

                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border",
                          STATUT_BADGE[note.statut] || STATUT_BADGE.en_attente
                        )}
                      >
                        <StatutIcon size={12} />
                        {STATUT_LABELS[note.statut] || note.statut}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      {isEnAttente ? (
                        <>
                          <button
                            onClick={() => handleValidate(note.id)}
                            disabled={actionLoading === note.id}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-2 rounded-lg hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all active:scale-95 disabled:opacity-50"
                          >
                            {actionLoading === note.id ? (
                              <div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                            Valider
                          </button>
                          <button
                            onClick={() => handleInvalidate(note.id)}
                            disabled={actionLoading === note.id}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all active:scale-95 disabled:opacity-50"
                          >
                            <Ban size={14} />
                            Invalider
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 italic">
                          {note.statut === "valide" ? "D\u00e9j\u00e0 valid\u00e9e" : "Note rejet\u00e9e"}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
