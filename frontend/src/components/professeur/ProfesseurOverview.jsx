import { motion } from "framer-motion";
import { BookOpen, Users, FileText, Bell } from "lucide-react";
import { authService } from "../../services/authService";
import { Card, CardContent } from "../ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const stats = [
  {
    label: "Matières",
    value: "—",
    sub: "Matières assignées",
    Icon: BookOpen,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Étudiants",
    value: "—",
    sub: "Total inscrits",
    Icon: Users,
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Communications",
    value: "—",
    sub: "Messages envoyés",
    Icon: FileText,
    iconBg: "bg-purple-50 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    label: "Notifications",
    value: "—",
    sub: "En attente",
    Icon: Bell,
    iconBg: "bg-orange-50 dark:bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
];

export default function ProfesseurOverview() {
  const user = authService.getCurrentUser();
  const fullName = user
    ? `${user.prenom || ""} ${user.nom || ""}`.trim()
    : "Professeur";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20"
    >
      <motion.div variants={itemVariants}>
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Bienvenue, {fullName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Bienvenue dans votre espace Professeur
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map(({ label, value, sub, Icon, iconBg, iconColor }) => (
          <Card
            key={label}
            className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="px-4 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-white leading-tight">
                  {label}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                  <Icon size={13} aria-hidden="true" className={iconColor} />
                </div>
              </div>
              <p className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white tabular-nums leading-none mb-1.5">
                {value}
              </p>
              <span className="text-[9px] font-medium text-slate-400 dark:text-white">
                {sub}
              </span>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
