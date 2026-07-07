import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProfesseurSidebar from "../components/professeur/ProfesseurSidebar";
import ProfesseurOverview from "../components/professeur/ProfesseurOverview";
import ProfesseurCommunications from "../components/professeur/ProfesseurCommunications";
import { authService } from "../services/authService";

export default function ProfesseurDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "overview",
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
      case "overview":
        return {
          title: `Espace Professeur`,
          subtitle: user?.prenom ? `Bonjour, ${user.prenom}` : "Tableau de bord",
        };
      case "communications":
        return {
          title: "Communications",
          subtitle: "Gérez vos communications avec les étudiants",
        };
      default:
        return {
          title: "Espace Professeur",
          subtitle: user?.prenom ? `Bonjour, ${user.prenom}` : "Tableau de bord",
        };
    }
  };

  const { title, subtitle } = getPageTitles();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
      <ProfesseurSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 md:ml-64 px-4 pt-4 pb-4 md:px-8 md:pt-0 md:pb-6 overflow-hidden h-screen flex flex-col min-w-0">
        <header className="-mx-4 md:-mx-8 px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 mb-6 flex items-center md:mt-2 h-14 md:h-17">
          <div className="w-full flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Ouvrir le menu"
                className="md:hidden rounded-md p-2 -ml-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </motion.button>
              <div>
                <h1 className="text-base md:text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight leading-tight line-clamp-1">
                  {title}
                </h1>
                {subtitle && (
                  <p className="hidden md:block text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleThemeToggle}
                aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
                className="h-9 w-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                {theme === "dark" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </motion.button>
            </div>
          </div>
        </header>

        <main className="relative flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ProfesseurOverview />
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
                <ProfesseurCommunications />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
