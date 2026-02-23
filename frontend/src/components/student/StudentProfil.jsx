import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Edit3,
  Building,
  GraduationCap,
  Hash,
  BookOpen,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { studentService } from "../../services/studentService";

export default function StudentProfil() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const [profil, setProfil] = useState(null);
  const [moyennesData, setMoyennesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilData, moyennes] = await Promise.all([
          studentService.getProfil(),
          studentService.getMoyennes(),
        ]);
        setProfil(profilData);
        setMoyennesData(moyennes);
      } catch (error) {
        console.error("Erreur chargement profil :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const matieresList = moyennesData?.semestres
    ? Object.values(moyennesData.semestres).flatMap((s) => s.matieres)
    : [];

  const getInitials = (nom, prenom) => {
    return `${prenom?.charAt(0) || ""}${nom?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20 max-w-5xl mx-auto"
    >
      {/* Header Profile Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
          <GraduationCap size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white backdrop-blur-sm flex items-center justify-center text-4xl font-black italic relative shadow-inner">
              {getInitials(profil?.nom, profil?.prenom)}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black font-display tracking-tight mb-2">
                {profil?.prenom} {profil?.nom}
              </h1>
              <p className="text-sm font-bold text-white/80 uppercase tracking-widest">
                {profil?.filiere?.nom || "Non défini"} • Class of{" "}
                {parseInt(profil?.annee_admission || new Date().getFullYear()) +
                  3}
              </p>
            </div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2">
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* General Info Side */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm h-max"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <span className="text-xs font-black italic">i</span>
            </div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
              General Info
            </h3>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <Building size={18} className="text-slate-400 mt-1" />
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  University
                </h4>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {profil?.filiere?.departement?.nom || "Non défini"}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <GraduationCap size={18} className="text-slate-400 mt-1" />
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Major / Filière
                </h4>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {profil?.filiere?.nom || "Non défini"}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Hash size={18} className="text-slate-400 mt-1" />
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Student ID
                </h4>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {profil?.matricule || "N/D"}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail size={18} className="text-slate-400 mt-1" />
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Email
                </h4>
                <a
                  href={`mailto:${profil?.email}`}
                  className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors leading-tight"
                >
                  {profil?.email}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin size={18} className="text-slate-400 mt-1" />
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Campus
                </h4>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Campus Principal
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Academic Standing
            </h4>
            <div className="flex justify-between items-end mb-2">
              <p className="text-lg font-black italic">
                AVG:{" "}
                {parseFloat(moyennesData?.moyenne_generale || 0).toFixed(2)}
              </p>
              <p className="text-xs font-bold text-emerald-500">
                {moyennesData?.moyenne_generale >= 15 ? "Excellent" : "Bien"}
              </p>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  moyennesData?.moyenne_generale >=
                    (moyennesData?.objectif_moyenne || 10)
                    ? "bg-emerald-500"
                    : "bg-orange-500",
                )}
                style={{
                  width: `${Math.min(100, (moyennesData?.moyenne_generale / 20) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Current Enrollment Table */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <BookOpen size={16} />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                Current Enrollment
              </h3>
            </div>
            <button className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline transition-all flex items-center gap-1">
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="pb-4 pr-6">Matière</th>
                  <th className="pb-4 pr-6">Cours</th>
                  <th className="pb-4 pr-6 text-center">Moyenne</th>
                  <th className="pb-4 text-center">Coefficient</th>
                </tr>
              </thead>
              <tbody>
                {matieresList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-8 text-center text-sm font-medium text-slate-500"
                    >
                      Aucune matière suivie actuellement.
                    </td>
                  </tr>
                ) : (
                  matieresList.map((matiere, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 pr-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">
                          {matiere.nom.charAt(0)}
                        </div>
                      </td>
                      <td className="py-4 pr-6">
                        <span className="font-bold text-sm text-slate-900 dark:text-white whitespace-nowrap block">
                          {matiere.nom}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          ID: {matiere.matiere_id}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-center">
                        <span className="text-base font-black italic mr-1">
                          {matiere.moyenne.toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          /20
                        </span>
                      </td>
                      <td className="py-4 text-center text-base font-black italic">
                        {matiere.coefficient}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Showing {matieresList.length} courses</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400 cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
