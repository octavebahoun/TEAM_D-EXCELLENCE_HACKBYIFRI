import { motion } from "framer-motion";

const stats = [
  { icon: "🎓", label: "Filières", value: 8 },
  { icon: "👨‍🎓", label: "Étudiants", value: 456 },
  { icon: "📚", label: "Matières", value: 47 },
  { icon: "📈", label: "Moyenne Générale", value: "14.2/20" },
];

export default function StatsCards({ data }) {
  // data = { filieres, etudiants, matieres, moyenne }
  const cards = data || stats;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {cards.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ scale: 1.04 }}
          className="bg-(--card-bg) text-(--card-text) rounded-xl shadow p-6 flex flex-col items-center justify-center font-semibold text-lg"
        >
          <span className="text-3xl mb-2">{stat.icon}</span>
          <span>{stat.label}</span>
          <span className="mt-2 text-2xl text-(--primary)">{stat.value}</span>
        </motion.div>
      ))}
    </div>
  );
}
