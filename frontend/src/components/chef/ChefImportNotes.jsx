import { motion } from "framer-motion";
import {
  Info,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function ChefImportNotes() {
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
      className="max-w-4xl mx-auto space-y-6 pb-20"
    >
      {/* Instructions Box */}
      <motion.div
        variants={itemVariants}
        className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
            <Info size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-blue-100 uppercase tracking-tight mb-3">
              Instructions d'import CSV
            </h3>
            <ol className="text-sm text-slate-700 dark:text-blue-200/80 space-y-2 mb-4 leading-relaxed font-medium">
              <li>
                <strong className="text-slate-900 dark:text-white">
                  1. Format requis :
                </strong>{" "}
                Le fichier CSV doit contenir les colonnes : Matricule, Nom,
                Prénom, Matière, Note
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">
                  2. Sélection :
                </strong>{" "}
                Choisissez d'abord la filière et l'année académique avant
                d'importer
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">
                  3. Validation :
                </strong>{" "}
                Vérifiez les données avant de confirmer l'import final
              </li>
            </ol>
            <button className="bg-blue-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-md active:scale-95">
              <Download size={16} /> Télécharger Modèle CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Step 1: Selection */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
          1. Sélection de la filière
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              Filière *
            </label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 outline-none font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
              <option value="">Choisir une filière</option>
              <option value="l-info">Licence Informatique</option>
              <option value="m-info">Master Informatique</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              Année d'études *
            </label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 outline-none font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
              <option value="">Choisir une année</option>
              <option value="l1">Première Année (L1)</option>
              <option value="l2">Deuxième Année (L2)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              Période
            </label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 outline-none font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
              <option value="semestre1">Semestre 1</option>
              <option value="semestre2">Semestre 2</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Step 2: Upload dropzone */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
          2. Import du fichier CSV
        </h3>

        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <UploadCloud size={28} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Cliquez pour sélectionner ou glissez-déposez
          </h4>
          <p className="text-sm text-slate-500 font-medium">
            Formats acceptés : .csv (Max 5MB)
          </p>
        </div>
      </motion.div>

      {/* Historique */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
          Historique des imports
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Notes Licence L1 - Semestre 1
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  15 décembre 2024, 14:30 • 52 étudiants • 6 matières
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 text-xs px-3 py-1 rounded-full font-bold">
                Succès
              </span>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Notes BTS 2 - Programmation
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  10 décembre 2024, 09:15 • 45 étudiants • 3 erreurs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-orange-50 text-orange-600 dark:bg-orange-500/10 text-xs px-3 py-1 rounded-full font-bold">
                Partiel
              </span>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
