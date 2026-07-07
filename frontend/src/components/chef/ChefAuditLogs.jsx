import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Search, X, Filter, ChevronLeft, ChevronRight, User, Globe, Activity } from "lucide-react";
import { toast } from "react-hot-toast";
import { departementService } from "../../services/departementService";
import { cn } from "../../utils/cn";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const ACTION_STYLES = {
  created: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  updated: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  deleted: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
  login: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
};

const ACTION_LABELS = {
  created: "Création",
  updated: "Modification",
  deleted: "Suppression",
  login: "Connexion",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function ChefAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    action_type: "",
    date_from: "",
    date_to: "",
    user: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, per_page: 15 };
      if (search) params.keyword = search;
      if (filters.action_type) params.action_type = filters.action_type;
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;
      if (filters.user) params.user = filters.user;

      const response = await departementService.getAuditLogs(params);
      const data = response.data || response || [];
      const logsData = Array.isArray(data) ? data : data.data || [];
      setLogs(logsData);
      setPagination({
        current_page: data.current_page || response.current_page || page,
        last_page: data.last_page || response.last_page || 1,
        per_page: data.per_page || response.per_page || 15,
        total: data.total || response.total || logsData.length,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors du chargement des logs";
      toast.error(message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    fetchLogs(page);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ action_type: "", date_from: "", date_to: "", user: "" });
    setSearch("");
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || search;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const totalPages = Math.max(1, pagination.last_page);
  const pageButtons = [];
  const maxVisible = 5;
  let startPage = Math.max(1, pagination.current_page - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i);
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">
              Journal d'Audit
            </h2>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              {pagination.total} événement{pagination.total > 1 ? "s" : ""} enregistré{pagination.total > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 h-9 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 w-full sm:w-52"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center border transition-colors",
                showFilters || hasActiveFilters
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <Filter size={15} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                      Type d'action
                    </label>
                    <select
                      value={filters.action_type}
                      onChange={(e) => handleFilterChange("action_type", e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    >
                      <option value="">Tous</option>
                      <option value="created">Création</option>
                      <option value="updated">Modification</option>
                      <option value="deleted">Suppression</option>
                      <option value="login">Connexion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                      Date début
                    </label>
                    <Input
                      type="date"
                      value={filters.date_from}
                      onChange={(e) => handleFilterChange("date_from", e.target.value)}
                      className="h-9 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                      Date fin
                    </label>
                    <Input
                      type="date"
                      value={filters.date_to}
                      onChange={(e) => handleFilterChange("date_to", e.target.value)}
                      className="h-9 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                      Utilisateur
                    </label>
                    <Input
                      value={filters.user}
                      onChange={(e) => handleFilterChange("user", e.target.value)}
                      placeholder="Nom d'utilisateur..."
                      className="h-9 text-xs rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
                {hasActiveFilters && (
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={resetFilters}
                      className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <X size={12} />
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Activity size={36} className="text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                  Aucun événement trouvé
                </p>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                  {hasActiveFilters ? "Essayez de modifier vos filtres" : "Aucune activité enregistrée"}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800" role="list">
                {logs.map((log, i) => (
                  <motion.li
                    key={log.id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        <User size={14} className="text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {log.user?.name || log.user?.nom || log.user_name || "Inconnu"}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                              ACTION_STYLES[log.action] || "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                            )}
                          >
                            {ACTION_LABELS[log.action] || log.action || "Action"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {log.description || "Aucune description"}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Globe size={10} className="shrink-0" />
                            {log.ip_address || "—"}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            {formatDate(log.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {!loading && logs.length > 0 && totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-1"
        >
          <button
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page <= 1}
            className="h-8 w-8 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          {pageButtons[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="h-8 min-w-8 rounded-xl flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                1
              </button>
              {pageButtons[0] > 2 && (
                <span className="h-8 flex items-center text-xs text-slate-400 px-1">...</span>
              )}
            </>
          )}
          {pageButtons.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={cn(
                "h-8 min-w-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors",
                page === pagination.current_page
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              {page}
            </button>
          ))}
          {pageButtons[pageButtons.length - 1] < totalPages && (
            <>
              {pageButtons[pageButtons.length - 1] < totalPages - 1 && (
                <span className="h-8 flex items-center text-xs text-slate-400 px-1">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="h-8 min-w-8 rounded-xl flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page >= totalPages}
            className="h-8 w-8 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
