import { useState } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Download,
  Send,
} from "lucide-react";
import { aiService } from "../../services/aiService";

export default function ImageTool() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.generateImage(prompt);
      setImage(res);
    } catch (error) {
      alert("Erreur lors de la génération de l'image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col gap-6">
          <label className="text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest pl-2">
            <Sparkles size={16} className="text-amber-500" /> Quel concept
            souhaitez-vous visualiser ?
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Ex: Un schéma 3D d'une cellule procaryote avec légendes..."
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
              Générer
            </button>
          </div>
        </div>
      </div>

      {image && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 overflow-hidden shadow-2xl text-center"
        >
          <h3 className="text-xl font-black text-white mb-4 uppercase italic tracking-tight underline decoration-amber-500 underline-offset-8">
            Résultat de la génération
          </h3>
          <p className="text-slate-400 mb-10 italic text-sm">
            "{image.prompt}"
          </p>

          <div className="relative group max-w-2xl mx-auto rounded-[2rem] overflow-hidden border-4 border-slate-800 shadow-inner bg-black aspect-video flex items-center justify-center">
            {image.image_url ? (
              <img
                src={`http://127.0.0.1:5000${image.image_url}`}
                alt={image.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 py-20">
                <ImageIcon size={64} className="text-slate-700" />
                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">
                  Image non chargée
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={`http://127.0.0.1:5000${image.image_url}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg"
            >
              <Download size={18} /> Télécharger HD
            </a>
            <button
              onClick={() => setImage(null)}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Nouvelle image
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
