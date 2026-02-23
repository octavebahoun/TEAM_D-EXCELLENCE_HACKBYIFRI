import { motion } from "framer-motion";
import { Plus, Edit3, Eye, ArrowRight } from "lucide-react";
import { cn } from "../../utils/cn";

export default function AdminDepartements() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const departements = [
    {
      name: "Informatique",
      code: "INFO",
      desc: "Département dédié aux sciences informatiques, au développement logiciel et...",
      filieres: 8,
      etudiants: 456,
      chef: "Dr. FOLARIN",
      chefInit: "MF",
      color: "bg-blue-100 text-blue-600",
      letter: "I",
    },
    {
      name: "Génie Civil",
      code: "GC",
      desc: "Formation en construction, structures et aménagement du territoire.",
      filieres: 6,
      etudiants: 380,
      chef: "Pr. KOUTON",
      chefInit: "JK",
      color: "bg-orange-100 text-orange-600",
      letter: "G",
    },
    {
      name: "Mathématiques",
      code: "MATH",
      desc: "Enseignement des mathématiques pures et appliquées, statistiques et analyse.",
      filieres: 5,
      etudiants: 320,
      chef: "Dr. AKANDE",
      chefInit: "MA",
      color: "bg-emerald-100 text-emerald-600",
      letter: "M",
    },
    {
      name: "Physique",
      code: "PHY",
      desc: "Recherche et enseignement en physique théorique et expérimentale.",
      filieres: 4,
      etudiants: 245,
      chef: "Pr. DOSSOU",
      chefInit: "PD",
      color: "bg-purple-100 text-purple-600",
      letter: "P",
    },
    {
      name: "Chimie",
      code: "CHI",
      desc: "Sciences chimiques, biochimie et chimie appliquée à l'industrie.",
      filieres: 3,
      etudiants: 180,
      chef: "Dr. ADJOVI",
      chefInit: "LA",
      color: "bg-rose-100 text-rose-600",
      letter: "C",
    },
    {
      name: "Biologie",
      code: "BIO",
      desc: "Sciences de la vie, écologie et biotechnologies modernes.",
      filieres: 4,
      etudiants: 290,
      chef: "À désigner",
      chefInit: "XX",
      color: "bg-teal-100 text-teal-600",
      letter: "B",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20"
    >
      {/* Header with New Button */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-xl font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">
            Gestion des Départements
          </h2>
          <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest mt-1">
            6 DÉPARTEMENTS ENREGISTRÉS
          </p>
        </div>
        <button className="bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-md active:scale-95 whitespace-nowrap">
          <Plus size={16} /> Nouveau Département
        </button>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departements.map((dept, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl",
                    dept.color,
                  )}
                >
                  {dept.letter}
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                {dept.name}
              </h3>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {dept.code}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 leading-relaxed line-clamp-2">
                {dept.desc}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Filières
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {dept.filieres}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Étudiants
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {dept.etudiants}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Chef
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                      dept.color,
                    )}
                  >
                    {dept.chefInit}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {dept.chef}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-400 dark:text-slate-500 font-medium">
                Détails
              </span>
              <button className="text-emerald-500 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Voir plus <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Stats Footer */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-wrap justify-around items-center gap-8 mt-12"
      >
        <h3 className="text-sm font-black font-display text-slate-900 dark:text-white uppercase tracking-tight w-full md:w-auto text-center md:text-left">
          Statistiques Générales
        </h3>

        <div className="text-center">
          <p className="text-3xl font-black text-emerald-500 mb-1">6</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Départements
          </p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-blue-500 mb-1">30</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Filières
          </p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-purple-500 mb-1">1,871</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Étudiants
          </p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-orange-500 mb-1">156</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Enseignants
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
