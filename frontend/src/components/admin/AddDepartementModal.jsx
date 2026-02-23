import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Layout, Hash, FileText } from "lucide-react";
import { useState } from "react";
import { laravelApiClient } from "../../api/client";
import { toast } from "react-hot-toast";

export default function AddDepartementModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await laravelApiClient.post("/admin/departements", formData);
      toast.success("Département créé avec succès !");
      onSuccess();
      onClose();
      setFormData({ nom: "", code: "", description: "" });
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || "Erreur lors de la création";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Nouveau Département
                </h3>
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">
                  Enregistrer une unité académique
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
              <div className="space-y-4">
                {/* Nom */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nom du Département
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Layout size={18} />
                    </div>
                    <input
                      required
                      type="text"
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      placeholder="Ex: Informatique"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Code */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Code (Trigramme)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Hash size={18} />
                    </div>
                    <input
                      required
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="Ex: INFO"
                      maxLength={10}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-slate-400">
                      <FileText size={18} />
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Décrivez brièvement le département..."
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Créer le Département <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
