// ...existing code...

const actions = [
  { label: "Import CSV", color: "blue", icon: "📄", onClick: () => {} },
  { label: "Emploi du Temps", color: "purple", icon: "📅", onClick: () => {} },
  { label: "Rapports", color: "green", icon: "📊", onClick: () => {} },
];

export default function ActionsPanel() {
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-(--card-bg) rounded-xl shadow p-6 mb-8"
    >
      <div className="font-bold text-lg mb-4">ACTIONS RAPIDES</div>
      <div className="space-y-3">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.04 }}
            className={`w-full flex items-center gap-3 py-2 px-4 rounded-lg font-semibold bg-${action.color}-100 text-${action.color}-700 shadow-sm`}
            onClick={action.onClick}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
