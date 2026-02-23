import { motion } from "framer-motion";
import {
  UserCheck,
  Users,
  Clock,
  ShieldCheck,
  Plus,
  Eye,
  Edit3,
  UserMinus,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../utils/cn";

export default function AdminChefs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const chefs = [
    {
      id: 1,
      name: "Dr. Mourchid FOLARIN",
      email: "mourchid@univ.bj",
      initials: "MF",
      deptName: "Informatique",
      deptStudents: 456,
      deptInitial: "I",
      deptColor: "bg-blue-100 text-blue-600",
      date: "12/01/2026",
      status: "Actif",
      statusColor: "text-emerald-600 bg-emerald-50",
      perf: 85,
      perfColor: "bg-emerald-500",
    },
    {
      id: 2,
      name: "Pr. Jean KOUTON",
      email: "jean@univ.bj",
      initials: "JK",
      deptName: "Génie Civil",
      deptStudents: 380,
      deptInitial: "G",
      deptColor: "bg-orange-100 text-orange-600",
      date: "08/01/2026",
      status: "Actif",
      statusColor: "text-emerald-600 bg-emerald-50",
      perf: 78,
      perfColor: "bg-emerald-500",
    },
    {
      id: 3,
      name: "Dr. Marie AKANDE",
      email: "marie@univ.bj",
      initials: "MA",
      deptName: "Mathématiques",
      deptStudents: 320,
      deptInitial: "M",
      deptColor: "bg-emerald-100 text-emerald-600",
      date: "15/01/2026",
      status: "Inactif",
      statusColor: "text-orange-600 bg-orange-50",
      perf: 45,
      perfColor: "bg-orange-500",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20"
    >
      {/* Search & Actions Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-xl font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">
            Chefs de Département
          </h2>
          <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest mt-1">
            Gestion & Assignment
          </p>
        </div>
        <button className="bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-md active:scale-95 whitespace-nowrap">
          <Plus size={16} /> Assigner Chef
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Chefs Assignés
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              5
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Départements sans Chef
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              1
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Dernière Assignment
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              2j
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Actifs
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              5
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Main Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
      >
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
          Chefs de Département Assignés
        </h3>
        <p className="text-xs font-medium text-slate-400 mb-8">
          Gérez les assignments et permissions
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="pb-4 pr-6">Chef</th>
                <th className="pb-4 pr-6">Département</th>
                <th className="pb-4 pr-6">Date Assignment</th>
                <th className="pb-4 pr-6">Statut</th>
                <th className="pb-4 pr-6">Performance</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chefs.map((chef, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-5 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {chef.initials}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white whitespace-nowrap block">
                          {chef.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {chef.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 pr-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0",
                          chef.deptColor,
                        )}
                      >
                        {chef.deptInitial}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white whitespace-nowrap block">
                          {chef.deptName}
                        </span>
                        <span className="text-xs text-slate-400">
                          {chef.deptStudents} étudiants
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 pr-6 text-sm font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {chef.date}
                  </td>
                  <td className="py-5 pr-6">
                    <span
                      className={cn(
                        "text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-block",
                        chef.statusColor,
                      )}
                    >
                      {chef.status}
                    </span>
                  </td>
                  <td className="py-5 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
                        <div
                          className={cn("h-full rounded-full", chef.perfColor)}
                          style={{ width: `${chef.perf}%` }}
                        ></div>
                      </div>
                      <span
                        className={cn(
                          "text-xs font-bold",
                          chef.perf >= 80
                            ? "text-emerald-500"
                            : "text-slate-500 dark:text-slate-400",
                        )}
                      >
                        {chef.perf}%
                      </span>
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="text-slate-400 hover:text-emerald-500 transition-colors p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                        title="Voir infos"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-slate-400 hover:text-blue-500 transition-colors p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                        title="Editer"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        className="text-slate-400 hover:text-rose-500 transition-colors p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                        title="Révoquer"
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Alert Component */}
      <motion.div
        variants={itemVariants}
        className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-orange-900 dark:text-orange-400 uppercase tracking-tight mb-1">
              Département sans Chef
            </h4>
            <p className="text-sm text-orange-800 dark:text-orange-500/80 font-medium">
              Le département Biologie n'a pas de chef assigné
            </p>
          </div>
        </div>
        <button className="bg-orange-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-md active:scale-95 whitespace-nowrap">
          <Plus size={16} /> Assigner Chef
        </button>
      </motion.div>
    </motion.div>
  );
}
