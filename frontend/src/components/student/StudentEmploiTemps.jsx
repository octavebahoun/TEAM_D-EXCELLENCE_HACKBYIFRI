import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { studentService } from "../../services/studentService";

export default function StudentEmploiTemps() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmploiTemps = async () => {
      try {
        const data = await studentService.getEmploiTemps();
        const formattedSchedule = data.map((cours) => {
          let color =
            "bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 border-l-4 border-slate-500";
          if (cours.type_cours === "CM")
            color =
              "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 border-l-4 border-blue-500";
          else if (cours.type_cours === "TD")
            color =
              "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 border-l-4 border-emerald-500";
          else if (cours.type_cours === "TP")
            color =
              "bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100 border-l-4 border-purple-500";

          return {
            id: cours.id,
            day: cours.jour,
            startTime: cours.heure_debut.substring(0, 5),
            endTime: cours.heure_fin.substring(0, 5),
            title: cours.matiere?.nom || "Cours",
            location: cours.salle || "Non définie",
            type: cours.type_cours,
            color,
            prof: cours.enseignant,
          };
        });
        setSchedule(formattedSchedule);
      } catch (error) {
        console.error("Erreur chargement emploi du temps :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmploiTemps();
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
      className="space-y-8 pb-20 max-w-7xl mx-auto"
    >
      {/* Schedule Grid */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm overflow-x-auto min-h-[600px]"
      >
        <div className="grid grid-cols-7 min-w-[800px] h-full gap-4">
          {/* En-têtes des jours */}
          {days.map((day, i) => (
            <div
              key={i}
              className="text-center pb-6 border-b border-slate-100 dark:border-slate-800 mb-4 h-max"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {day}
              </span>
            </div>
          ))}

          {/* Colonnes des jours */}
          {days.map((day, i) => (
            <div key={i} className="flex flex-col gap-4 relative">
              {/* Affichage des cours si existant pour ce jour */}
              {schedule.filter((s) => s.day === day).length > 0 ? (
                schedule.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl p-4 shadow-sm ${item.color}`}
                  >
                    <div className="text-[10px] font-black mb-1 opacity-80 flex justify-between">
                      <span>
                        {item.startTime} - {item.endTime}
                      </span>
                      <span>{item.type}</span>
                    </div>
                    <div className="text-xs font-black uppercase tracking-tight mb-2 leading-tight">
                      {item.title}
                    </div>
                    <div className="text-[10px] font-bold opacity-60 uppercase flex justify-between">
                      <span>{item.location}</span>
                      {item.prof && <span>{item.prof}</span>}
                    </div>
                  </div>
                ))
              ) : day === "Dimanche" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 transform -rotate-90 md:rotate-0">
                    Repos
                  </span>
                </div>
              ) : null}

              {/* Lignes verticales de séparation decoratives */}
              {i < days.length - 1 && (
                <div className="absolute right-[-10px] top-0 bottom-0 w-px bg-slate-50 dark:bg-slate-800/50"></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
