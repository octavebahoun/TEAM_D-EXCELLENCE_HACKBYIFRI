import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ResponsableSidebar from "../components/responsable/ResponsableSidebar";
import ResponsableHeader from "../components/responsable/ResponsableHeader";
import ResponsableAbsences from "../components/responsable/ResponsableAbsences";
import ResponsableCommunications from "../components/responsable/ResponsableCommunications";
import ResponsableCamarades from "../components/responsable/ResponsableCamarades";
import DiscussionsView from "../components/discussions/DiscussionsView";
import { authService } from "../services/authService";

export default function ResponsableDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "absences",
  );
  const [theme, setTheme] = useState("light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  const user = authService.getCurrentUser();

  const getPageTitles = () => {
    switch (activeTab) {
      case "absences":
        return {
          title: "Gestion des Absences",
          subtitle: "Responsable de Classe",
        };
      case "communications":
        return {
          title: "Communications",
          subtitle: "Responsable de Classe",
        };
      case "camarades":
        return {
          title: "Mes Camarades",
          subtitle: "Responsable de Classe",
        };
      case "discussions":
        return {
          title: "Discussions",
          subtitle: "Échanges avec les professeurs",
        };
      default:
        return {
          title: `Bon retour, ${user?.prenom || "Responsable"} !`,
          subtitle: "Responsable de Classe",
        };
    }
  };

  const { title, subtitle } = getPageTitles();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
      <ResponsableSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 md:ml-64 px-4 pt-4 pb-4 md:px-8 md:pt-0 md:pb-6 overflow-hidden h-screen flex flex-col min-w-0">
        <ResponsableHeader
          title={title}
          subtitle={subtitle}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="relative flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "absences" && (
              <motion.div
                key="absences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ResponsableAbsences />
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
                <ResponsableCommunications />
              </motion.div>
            )}

            {activeTab === "camarades" && (
              <motion.div
                key="camarades"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ResponsableCamarades />
              </motion.div>
            )}

            {activeTab === "discussions" && (
              <motion.div
                key="discussions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <DiscussionsView />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
