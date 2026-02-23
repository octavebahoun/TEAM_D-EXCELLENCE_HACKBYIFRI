import { motion } from "framer-motion";
import {
  PlayCircle,
  Globe,
  Video,
  MapPin,
  Plus,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../utils/cn";

export default function StudentSessions() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const sessions = [
    {
      id: 1,
      category: "MATHÉMATIQUES",
      status: "EN DIRECT",
      title: "Calcul III: Révision des Intégrales Multiples",
      date: "Aujourd'hui, 16h00 - 18h00",
      location: "Bibliothèque Campus, Salle 402",
      locIcon: MapPin,
      organizer: "Sarah Miller",
      organizerInitials: "SM",
      orgOrg: "Organisatrice",
      colorTag: "text-blue-600 bg-blue-100",
      statusGroup: "bg-rose-100 text-rose-600",
      avatarColor: "bg-blue-600 text-white",
      buttonText: "Rejoindre la Session",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      participants: "+3",
    },
    {
      id: 2,
      category: "HISTOIRE",
      status: "À VENIR",
      title: "La Révolution Industrielle: Analyse Critique du Groupe",
      date: "Demain, 10h00",
      location: "Réunion Zoom",
      locIcon: Video,
      organizer: "David Chen",
      organizerInitials: "DC",
      orgOrg: "Organisateur",
      colorTag: "text-emerald-600 bg-emerald-100",
      statusGroup:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      avatarColor: "bg-emerald-500 text-white",
      buttonText: "Confirmer Présence",
      buttonColor:
        "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300",
      participants: "+4",
    },
    {
      id: 3,
      category: "PHYSIQUE",
      status: "À VENIR",
      title: "Mécanique Quantique: Résolution de Problèmes Set #4",
      date: "24 Oct, 14h00",
      location: "Science Hall B.12",
      locIcon: MapPin,
      organizer: "Elena Rodriguez",
      organizerInitials: "ER",
      orgOrg: "Organisatrice",
      colorTag: "text-orange-600 bg-orange-100",
      statusGroup:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      avatarColor: "bg-orange-500 text-white",
      buttonText: "Rejoindre la Session",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      participants: "+2",
    },
    {
      id: 4,
      category: "INFORMATIQUE",
      status: "À VENIR",
      title: "Structures de Données: Implémentation Hash Map",
      date: "25 Oct, 18h00",
      location: "Discord Code Lab",
      locIcon: Globe,
      organizer: "Marcus Tao",
      organizerInitials: "MT",
      orgOrg: "Organisateur",
      colorTag: "text-purple-600 bg-purple-100",
      statusGroup:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      avatarColor: "bg-purple-500 text-white",
      buttonText: "Rejoindre la Session",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      participants: "+15",
    },
    {
      id: 5,
      category: "LITTÉRATURE",
      status: "À VENIR",
      title: 'Poésie Post-Moderniste: Analyse de "La Terre Vague"',
      date: "26 Oct, 15h00",
      location: "The Coffee Bean Loft",
      locIcon: MapPin,
      organizer: "Chloe Banks",
      organizerInitials: "CB",
      orgOrg: "Organisatrice",
      colorTag: "text-rose-600 bg-rose-100",
      statusGroup:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      avatarColor: "bg-rose-500 text-white",
      buttonText: "Rejoindre la Session",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      participants: "+3",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20 max-w-7xl mx-auto"
    >
      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-2 items-center mb-8"
      >
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-blue-700 transition">
          Toutes les Sessions
        </button>
        <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          Mathématiques
        </button>
        <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          Informatique
        </button>
        <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          Histoire
        </button>
        <div className="mx-2 w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
        <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          Aujourd'hui
        </button>
        <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          À venir
        </button>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded",
                    session.colorTag,
                  )}
                >
                  {session.category}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded flex items-center gap-1",
                    session.statusGroup,
                  )}
                >
                  {session.status === "EN DIRECT" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  )}
                  {session.status}
                </span>
              </div>

              <h3 className="text-lg font-black font-display tracking-tight text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight">
                {session.title}
              </h3>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <PlayCircle size={14} className="shrink-0" />
                  <span className="text-xs font-bold">{session.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <session.locIcon size={14} className="shrink-0" />
                  <span className="text-xs font-bold">{session.location}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      session.avatarColor,
                    )}
                  >
                    {session.organizerInitials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {session.organizer}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {session.orgOrg}
                    </p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border border-white dark:border-slate-900 z-10"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 border border-white dark:border-slate-900 z-0"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-white dark:border-slate-900 z-20 flex items-center justify-center text-[8px] font-bold text-slate-500">
                    {session.participants}
                  </div>
                </div>
              </div>

              <button
                className={cn(
                  "w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                  session.buttonColor,
                )}
              >
                {session.buttonText}
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add New Session Card */}
        <motion.div
          variants={itemVariants}
          className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group min-h-[350px]"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
            <Plus size={28} />
          </div>
          <h3 className="text-base font-black font-display text-slate-900 dark:text-white mb-2">
            Organisez votre propre session
          </h3>
          <p className="text-sm text-slate-500 font-medium mb-8 max-w-xs">
            Vous ne trouvez pas ce que vous cherchez ? Créez une nouvelle
            session pour vos camarades de classe.
          </p>
          <button className="bg-blue-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
            Créer une Session
          </button>
        </motion.div>
      </div>

      {/* Voir Plus */}
      <motion.div variants={itemVariants} className="flex justify-center mt-12">
        <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
          Voir Plus de Sessions <ChevronDown size={14} />
        </button>
      </motion.div>
    </motion.div>
  );
}
