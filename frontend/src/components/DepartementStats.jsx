// ...existing code...

export default function DepartementStats({ stats }) {
  // stats = { reussite, moyenne, assiduite, abandons }
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-(--card-bg) rounded-xl shadow p-6 mb-8"
    >
      <div className="font-bold text-lg mb-4">STATS DÉPARTEMENT</div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Taux de Réussite</span>
          <span className="font-bold text-green-500">{stats.reussite}%</span>
        </div>
        <div className="flex justify-between">
          <span>Moyenne Générale</span>
          <span className="font-bold text-blue-500">{stats.moyenne}/20</span>
        </div>
        <div className="flex justify-between">
          <span>Taux Assiduité</span>
          <span className="font-bold text-purple-500">{stats.assiduite}%</span>
        </div>
        <div className="flex justify-between">
          <span>Abandons</span>
          <span className="font-bold text-red-500">{stats.abandons}%</span>
        </div>
      </div>
    </motion.div>
  );
}
