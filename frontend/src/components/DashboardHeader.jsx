import { motion } from "framer-motion";

export default function DashboardHeader({ departement, year, onThemeToggle }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 60 }}
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 py-4 md:py-6 px-4 md:px-8 bg-transparent"
    >
      <div className="text-xl md:text-2xl font-bold text-[var(--primary)]">
        MANAGEMENT BOARD
      </div>
      <div className="text-sm md:text-lg font-semibold text-[var(--accent)]">
        {departement}{" "}
        <span className="ml-2 text-sm text-[var(--text)]">
          Année académique {year}
        </span>
      </div>
      <button
        className="rounded-full p-2 bg-[var(--accent)] text-white shadow"
        onClick={onThemeToggle}
        aria-label="Changer le thème"
      >
        🌓
      </button>
    </motion.header>
  );
}
