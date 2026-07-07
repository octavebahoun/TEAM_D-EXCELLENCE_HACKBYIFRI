import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChefSidebar from "../components/chef/ChefSidebar";
import ChefHeader from "../components/chef/ChefHeader";
import ChefOverview from "../components/chef/ChefOverview";
import ChefFilieres from "../components/chef/ChefFilieres";
import ChefImportNotes from "../components/chef/ChefImportNotes";
import ChefEnseignants from "../components/chef/ChefEnseignants";
import ChefSalles from "../components/chef/ChefSalles";
import ChefAbsences from "../components/chef/ChefAbsences";
import ChefNotesValidation from "../components/chef/ChefNotesValidation";
import ChefAuditLogs from "../components/chef/ChefAuditLogs";
import ChefCommunications from "../components/chef/ChefCommunications";
import { ChefEmploiTemps } from "../components/chef/ChefTimetable.jsx";
import useDepartementData from "../hooks/useDepartementData";
import { authService } from "../services/authService";

export default function ChefDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [initialFiliereId, setInitialFiliereId] = useState(null);
  const [theme, setTheme] = useState("light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lecture du département depuis l'utilisateur connecté (stocké par authService au login)
  const currentUser = authService.getCurrentUser();
  const deptId = currentUser?.departement_id ?? null;

  const departmentState = useDepartementData(deptId);
  // const { loading, error } = departmentState;
  const data = departmentState;

  // Initialisation du thème
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleOverviewTabChange = (tab, filiereId = null) => {
    setActiveTab(tab);
    if (filiereId != null) setInitialFiliereId(filiereId);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  const getPageTitles = () => {
    const deptName = data?.resume?.departement?.nom
      ? `Département ${data.resume.departement.nom}`
      : "Département ...";
    switch (activeTab) {
      case "overview":
        return {
          title: "Management Board",
          subtitle: deptName,
        };
      case "filieres":
        return {
          title: "Gestion des Filières",
          subtitle: deptName,
        };
      case "import":
        return {
          title: "Import CSV - Notes",
          subtitle: deptName,
        };
      case "enseignants":
        return {
          title: "Gestion des Enseignants",
          subtitle: deptName,
        };
      case "salles":
        return {
          title: "Gestion des Salles",
          subtitle: deptName,
        };
      case "absences":
        return {
          title: "Gestion des Absences",
          subtitle: deptName,
        };
      case "notes-validation":
        return {
          title: "Validation des Notes",
          subtitle: deptName,
        };
      case "audit-logs":
        return {
          title: "Journal d'Audit",
          subtitle: deptName,
        };
      case "communications":
        return {
          title: "Communications",
          subtitle: deptName,
        };
      case "emploi-temps":
        return {
          title: "Emploi du Temps",
          subtitle: deptName,
        };
      default:
        return {
          title: "Management Board",
          subtitle: deptName,
        };
    }
  };

  const { title, subtitle } = getPageTitles();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
      {/* Sidebar - fixed on the left (responsive) */}
      <ChefSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 px-4 pt-4 pb-4 md:px-8 md:pt-0 md:pb-6 overflow-x-hidden min-w-0">
        <ChefHeader
          title={title}
          subtitle={subtitle}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="relative">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefOverview
                  data={data}
                  onTabChange={handleOverviewTabChange}
                />
              </motion.div>
            )}

            {activeTab === "filieres" && (
              <motion.div
                key="filieres"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefFilieres
                  initialFiliereId={initialFiliereId}
                  onInitialFiliereConsumed={() => setInitialFiliereId(null)}
                />
              </motion.div>
            )}

            {activeTab === "enseignants" && (
              <motion.div
                key="enseignants"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefEnseignants />
              </motion.div>
            )}

            {activeTab === "salles" && (
              <motion.div
                key="salles"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefSalles />
              </motion.div>
            )}

            {activeTab === "absences" && (
              <motion.div
                key="absences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefAbsences />
              </motion.div>
            )}

            {activeTab === "notes-validation" && (
              <motion.div
                key="notes-validation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefNotesValidation />
              </motion.div>
            )}

            {activeTab === "audit-logs" && (
              <motion.div
                key="audit-logs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefAuditLogs />
              </motion.div>
            )}

            {activeTab === "communications" && (
              <motion.div
                key="communications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefCommunications />
              </motion.div>
            )}

            {activeTab === "import" && (
              <motion.div
                key="import"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefImportNotes />
              </motion.div>
            )}

            {activeTab === "emploi-temps" && (
              <motion.div
                key="emploi-temps"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ChefEmploiTemps data={data} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
