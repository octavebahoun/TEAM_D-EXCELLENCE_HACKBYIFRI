import { motion } from "framer-motion";
import {
  Building2,
  GraduationCap,
  GraduationCap as FiliereIcon,
  ShieldAlert,
  Download,
} from "lucide-react";
import { cn } from "../../utils/cn";

export default function AdminOverview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    {
      label: "DÉPARTEMENTS ACTIFS",
      value: 6,
      icon: Building2,
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "TOTAL ÉTUDIANTS",
      value: "1,871",
      icon: GraduationCap,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "FILIÈRES TOTAL",
      value: 30,
      icon: FiliereIcon,
      color: "bg-orange-50 text-orange-500",
    },
    {
      label: "ALERTES SÉCURITÉ",
      value: 0,
      icon: ShieldAlert,
      color: "bg-rose-50 text-rose-500",
    },
  ];

  const auditLogs = [
    {
      admin: "John Doe",
      initials: "JD",
      action: "Mise à jour rôles",
      target: "Dep. Info",
      date: "AUJOURD'HUI, 14:20",
      status: "SUCCÈS",
      statusColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
      initialsColor: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600",
    },
    {
      admin: "Marc Simon",
      initials: "MS",
      action: "Nouveau compte",
      target: "Admin Finance",
      date: "HIER, 09:15",
      status: "SUCCÈS",
      statusColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
      initialsColor: "bg-blue-100 dark:bg-blue-500/20 text-blue-600",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
                stat.color,
              )}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <h3 className="text-4xl font-black font-display text-slate-900 dark:text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Audit Journal */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
      >
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white uppercase tracking-tight italic">
              Journal d'Audit
            </h2>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              Dernières actions administratives
            </p>
          </div>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
            Exporter PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="pb-4 pr-6">Administrateur</th>
                <th className="pb-4 pr-6">Action</th>
                <th className="pb-4 pr-6">Cible</th>
                <th className="pb-4 pr-6">Date</th>
                <th className="pb-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-5 pr-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                          log.initialsColor,
                        )}
                      >
                        {log.initials}
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white whitespace-nowrap">
                        {log.admin}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 pr-6 text-sm font-semibold text-slate-700 dark:text-slate-300 italic">
                    {log.action}
                  </td>
                  <td className="py-5 pr-6 text-sm font-bold text-slate-900 dark:text-white">
                    {log.target}
                  </td>
                  <td className="py-5 pr-6 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {log.date}
                  </td>
                  <td className="py-5 text-right">
                    <span
                      className={cn(
                        "text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-block",
                        log.statusColor,
                      )}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
