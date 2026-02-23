import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText } from "lucide-react";
import { cn } from "../../utils/cn";
import { studentService } from "../../services/studentService";

export default function StudentNotes() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await studentService.getNotes();
        setNotes(data);
      } catch (error) {
        console.error("Erreur chargement notes :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20 max-w-5xl mx-auto"
    >
      {/* Table Container */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="pb-4 pr-6">Module</th>
                <th className="pb-4 pr-6">Type d'Évaluation</th>
                <th className="pb-4 pr-6 text-center">Date</th>
                <th className="pb-4 pr-6 text-center">Coefficient</th>
                <th className="pb-4 text-right">Note</th>
              </tr>
            </thead>
            <tbody>
              {notes.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-sm font-medium text-slate-500"
                  >
                    Aucune note disponible pour le moment.
                  </td>
                </tr>
              ) : (
                notes.map((note) => (
                  <tr
                    key={note.id}
                    className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-5 pr-6 w-1/3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 text-blue-500 bg-blue-50 dark:bg-blue-500/10">
                          <BookOpen size={18} />
                        </div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white capitalize tracking-tight">
                          {note.matiere?.nom || "Non défini"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 pr-6 text-sm font-bold text-slate-600 dark:text-slate-300">
                      {note.type_evaluation || "Non défini"}
                    </td>
                    <td className="py-5 pr-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                      {new Date(note.date_evaluation).toLocaleDateString()}
                    </td>
                    <td className="py-5 pr-6 text-center text-sm font-black text-slate-900 dark:text-white">
                      {note.coefficient || note.matiere?.coefficient || "-"}
                    </td>
                    <td className="py-5 text-right">
                      <span
                        className={cn(
                          "text-base font-black italic",
                          note.note >= note.note_max / 2
                            ? "text-emerald-500"
                            : "text-red-500",
                        )}
                      >
                        {parseFloat(note.note).toFixed(2)}{" "}
                        <span className="text-xs text-slate-400 font-bold ml-0.5">
                          /{note.note_max}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
