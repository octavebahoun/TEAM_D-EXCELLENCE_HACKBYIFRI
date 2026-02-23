import { motion } from "framer-motion";
import { Upload, MoreVertical } from "lucide-react";
import { cn } from "../../utils/cn";
import { useState } from "react";

export default function ChefFilieres() {
  const [activeTab, setActiveTab] = useState("matieres");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const matieres = [
    {
      name: "Programmation C",
      code: "PROG-C-L1 • 6 ECTS",
      level: "L1",
      levelColor: "text-blue-500 bg-blue-50",
    },
    {
      name: "Mathématiques",
      code: "MATH-L1 • 5 ECTS",
      level: "L1",
      levelColor: "text-blue-500 bg-blue-50",
    },
    {
      name: "Base de Données",
      code: "BDD-L2 • 6 ECTS",
      level: "L2",
      levelColor: "text-purple-500 bg-purple-50",
    },
    {
      name: "Projet Final",
      code: "PROJ-L3 • 8 ECTS",
      level: "L3",
      levelColor: "text-emerald-500 bg-emerald-50",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-lg font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">
            Filières du Département
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez toutes les filières et programmes d'études de votre
            département
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Filtrer par niveau:</span>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-700 dark:text-slate-200">
              <option>Tous</option>
              <option>Licence</option>
              <option>Master</option>
            </select>
          </div>
          <button className="bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-md active:scale-95 whitespace-nowrap">
            <Upload size={16} /> Upload CSV - Filières
          </button>
        </div>
      </motion.div>

      {/* Filières Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Licence Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center font-bold text-xl">
                  L
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Licence Informatique
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-widest">
                    CODE: L-INFO-001
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-xs px-3 py-1 rounded-full font-bold">
                  Actif
                </span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 px-4">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  156
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Étudiants
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  3
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Années
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  18
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Matières
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Gestion de la filière
            </h4>
            <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800 mb-4">
              <button
                className={cn(
                  "pb-3 text-sm font-bold border-b-2 transition-colors",
                  activeTab === "matieres"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-500",
                )}
                onClick={() => setActiveTab("matieres")}
              >
                Matières
              </button>
              <button
                className={cn(
                  "pb-3 text-sm font-bold border-b-2 transition-colors",
                  activeTab === "etudiants"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-500",
                )}
                onClick={() => setActiveTab("etudiants")}
              >
                Étudiants
              </button>
            </div>

            {activeTab === "matieres" && (
              <div className="space-y-2">
                {matieres.map((mat, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        {mat.name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {mat.code}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-md",
                        mat.levelColor,
                      )}
                    >
                      {mat.level}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Master Card */}
        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center font-bold text-xl">
                  M
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Master Informatique
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-widest">
                    CODE: M-INFO-001
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-xs px-3 py-1 rounded-full font-bold">
                  Actif
                </span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 px-4">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  84
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Étudiants
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  2
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Années
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  15
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Matières
                </p>
              </div>
            </div>
          </motion.div>

          {/* Subcard for Master */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Répartition par année
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50/50 dark:bg-purple-500/5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                    M1
                  </span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Master 1
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-600">
                    42 étudiants
                  </p>
                  <button className="text-xs text-purple-400 hover:text-purple-600 transition-colors mt-0.5">
                    Voir liste
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50/50 dark:bg-purple-500/5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                    M2
                  </span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Master 2
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-600">
                    42 étudiants
                  </p>
                  <button className="text-xs text-purple-400 hover:text-purple-600 transition-colors mt-0.5">
                    Voir liste
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
