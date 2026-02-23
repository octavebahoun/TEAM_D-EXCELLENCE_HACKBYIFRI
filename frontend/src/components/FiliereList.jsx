// ...existing code...

export default function FiliereList({ filieres }) {
  // filieres = [{ nom, annees, etudiants, matieres, actif }]
  return (
    <div className="bg-white dark:bg-(--card-bg) rounded-xl shadow p-6 mb-8">
      <div className="font-bold text-lg mb-4">FILIÈRES DU DÉPARTEMENT</div>
      <div className="space-y-4">
        {filieres.map((filiere, idx) => (
          <motion.div
            key={filiere.nom}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.08 }}
            className="flex items-center justify-between p-4 rounded-lg border-(--border) bg-(--card-bg)"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold bg-(--accent) text-white rounded-full w-8 h-8 flex items-center justify-center">
                {filiere.short}
              </span>
              <div>
                <div className="font-semibold">{filiere.nom}</div>
                <div className="text-sm text-(--text-muted)">
                  {filiere.annees} années • {filiere.etudiants} étudiants •{" "}
                  {filiere.matieres} matières
                </div>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${filiere.actif ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}
            >
              {filiere.actif ? "Actif" : "Inactif"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
