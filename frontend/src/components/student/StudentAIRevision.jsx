import { motion } from "framer-motion";
import { BrainCircuit, UploadCloud } from "lucide-react";

export default function StudentAIRevision() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8"
    >
      {/* Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-4xl bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden group"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500 blur-[80px] rounded-full mix-blend-screen group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500 blur-[80px] rounded-full mix-blend-screen group-hover:scale-150 transition-transform duration-1000 delay-100"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-inner mb-8 group-hover:-translate-y-2 transition-transform duration-500">
            <BrainCircuit size={40} className="text-emerald-400" />
          </div>

          <h2 className="text-4xl md:text-5xl font-black font-display italic tracking-tight text-white mb-6 uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Boostez vos révisions <br />
            avec l'IA
          </h2>

          <p className="text-sm font-medium text-slate-300 max-w-lg leading-relaxed mb-4">
            Analysez vos documents, générez des quiz personnalisés et révisez
            plus efficacement que jamais.
          </p>
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-4xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group shadow-sm hover:shadow-md"
      >
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all shadow-inner">
          <UploadCloud
            size={40}
            className="text-slate-400 dark:text-slate-500"
          />
        </div>

        <h3 className="text-lg font-black font-display text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
          Déposez vos cours (PDF, WORD)
        </h3>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
          MAX. 50MB PAR FICHIER
        </p>

        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-m active:scale-95">
          Parcourir les fichiers
        </button>
      </motion.div>
    </motion.div>
  );
}
