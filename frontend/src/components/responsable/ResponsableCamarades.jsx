import { motion } from "framer-motion";
import {
  Users,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { laravelApiClient } from "../../api/client";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function ResponsableCamarades() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEtudiants();
  }, []);

  const fetchEtudiants = async () => {
    try {
      const res = await laravelApiClient.get("/responsable/etudiants");
      setEtudiants(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Erreur chargement étudiants:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = etudiants.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (e.nom || "").toLowerCase().includes(q) ||
      (e.prenom || "").toLowerCase().includes(q) ||
      (e.matricule || "").toLowerCase().includes(q)
    );
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">
              Mes Camarades
            </h2>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              {etudiants.length} étudiant{etudiants.length > 1 ? "s" : ""} dans votre classe
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl"
        >
          <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
            {search ? "Aucun résultat trouvé" : "Aucun étudiant dans votre classe"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((etudiant, idx) => (
            <motion.div
              key={etudiant.id || idx}
              variants={itemVariants}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-sm shrink-0">
                  {(etudiant.nom || "?").charAt(0)}
                  {(etudiant.prenom || "").charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                    {etudiant.nom} {etudiant.prenom}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                    {etudiant.matricule}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
