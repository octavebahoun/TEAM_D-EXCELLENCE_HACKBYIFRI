import { motion } from "framer-motion";
import logoSvg from "../assets/logo.svg";
import logoDarkSvg from "../assets/logo-dark.svg";

const sidebarItems = [
  { icon: "📊", label: "Vue d'ensemble", route: "/chef/dashboard" },
  { icon: "🗂️", label: "Gestion Filières", route: "/chef/filieres" },
  { icon: "📄", label: "Import CSV - Notes", route: "/chef/import" },
  { icon: "📅", label: "Emploi du Temps", route: "/chef/edt" },
];

export default function Sidebar({ active, onLogout }) {
  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 60 }}
      className="bg-(--sidebar-bg) text-(--sidebar-text) w-64 min-h-screen flex flex-col p-6 shadow-lg"
    >
      <div className="mb-8">
        <img src={logoSvg} alt="AcademiX" className="h-14 w-auto dark:hidden" />
        <img
          src={logoDarkSvg}
          alt="AcademiX"
          className="h-14 w-auto hidden dark:block"
        />
      </div>
      <nav className="flex-1">
        {sidebarItems.map((item, idx) => (
          <motion.div
            key={item.label}
            whileHover={{ scale: 1.04 }}
            className={`flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer mb-2 ${active === item.route ? "bg-(--sidebar-active) font-semibold" : ""}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </motion.div>
        ))}
      </nav>
      <motion.button
        whileHover={{ scale: 1.05, color: "#ef4444" }}
        className="mt-auto text-red-500 font-semibold"
        onClick={onLogout}
      >
        Déconnexion
      </motion.button>
    </motion.aside>
  );
}
