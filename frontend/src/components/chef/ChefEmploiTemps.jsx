import { motion } from "framer-motion";
import { Eye, Upload } from "lucide-react";

export default function ChefEmploiTemps() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
      className="space-y-6"
    >
      {/* Filters Header */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-lg font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">
            Gestion des emplois du temps
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Consultez et gérez les emplois du temps pour chaque filière et année
            d'études
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
            <span>Vue:</span>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none font-bold text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm">
              <option>Vue d'ensemble</option>
              <option>Détaillée</option>
            </select>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
            <span>Filière:</span>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none font-bold text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm">
              <option>Toutes</option>
              <option>Licence</option>
              <option>Master</option>
              <option>BTS</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Licence */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center font-bold text-xl">
              L
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Licence Informatique
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                3 années d'études
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-blue-50/50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  L1
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  52 étudiants
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-xs px-2.5 py-1 rounded font-bold">
                  Publié
                </span>
                <button className="text-blue-500 hover:text-blue-600 transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>
            <div className="bg-blue-50/50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  L2
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  48 étudiants
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-xs px-2.5 py-1 rounded font-bold">
                  Publié
                </span>
                <button className="text-blue-500 hover:text-blue-600 transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>
            <div className="bg-blue-50/50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  L3
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  56 étudiants
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-orange-50 text-orange-600 dark:bg-orange-500/10 text-xs px-2.5 py-1 rounded font-bold">
                  Brouillon
                </span>
                <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
                  <Upload size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Master */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center font-bold text-xl">
              M
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Master Informatique
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                2 années d'études
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-purple-50/50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  M1
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  42 étudiants
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-xs px-2.5 py-1 rounded font-bold">
                  Publié
                </span>
                <button className="text-purple-500 hover:text-purple-600 transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>
            <div className="bg-purple-50/50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  M2
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  42 étudiants
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-rose-50 text-rose-600 dark:bg-rose-500/10 text-xs px-2.5 py-1 rounded font-bold">
                  Non défini
                </span>
                <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
                  <Upload size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BTS */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-xl">
              BTS
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                BTS Informatique
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                2 années d'études
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-emerald-50/50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  1ère Année
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  108 étudiants
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-xs px-2.5 py-1 rounded font-bold">
                  Publié
                </span>
                <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>
            <div className="bg-emerald-50/50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  2ème Année
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  108 étudiants
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-xs px-2.5 py-1 rounded font-bold">
                  Publié
                </span>
                <button className="text-emerald-500 hover:text-emerald-600 transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
