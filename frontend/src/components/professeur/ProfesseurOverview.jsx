import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, Bell } from "lucide-react";
import { authService } from "../../services/authService";
import { professeurService } from "../../services/professeurService";
import { discussionService } from "../../services/discussionService";
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

const STAT_META = [
  {
    key: "matieres",
    label: "Matières",
    sub: "Matières assignées",
    Icon: BookOpen,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "etudiants",
    label: "Étudiants",
    sub: "Total inscrits",
    Icon: Users,
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "communications",
    label: "Communications",
    sub: "Messages envoyés",
    Icon: FileText,
    iconBg: "bg-purple-50 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    key: "notifications",
    label: "Notifications",
    sub: "Non lues (responsables)",
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

  const [values, setValues] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [statsRes, discussionsRes] = await Promise.allSettled([
        professeurService.stats(),
        discussionService.list(),
      ]);

      if (!active) return;

      const stats =
        statsRes.status === "fulfilled" ? statsRes.value : {};
      const discussions =
        discussionsRes.status === "fulfilled" ? discussionsRes.value : [];
      const unread = Array.isArray(discussions)
        ? discussions.reduce((sum, d) => sum + (Number(d.unread) || 0), 0)
        : 0;

      setValues({
        matieres: stats.matieres ?? 0,
        etudiants: stats.etudiants ?? 0,
        communications: stats.communications ?? 0,
        notifications: unread,
      });
    })();
    return () => {
      active = false;
    };
  }, []);

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
        {STAT_META.map(({ key, label, sub, Icon, iconBg, iconColor }) => {
          const value = values ? values[key] : "—";
          return (
          <Card
            key={key}
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
          );
        })}
      </motion.div>
    </motion.div>
  );
}
