import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trophy,
} from "lucide-react";
import { aiService } from "../../services/aiService";

export default function QuizTool() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState("upload"); // 'upload', 'playing', 'result'
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await aiService.generateQuiz({ file, nbQuestions: 5 });
      setQuiz(res);
      setCurrentStep("playing");
    } catch (error) {
      alert("Erreur lors de la génération du quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: optionIndex });
  };

  const handleSubmit = () => {
    let s = 0;
    quiz.questions.forEach((q, i) => {
      // Pour la démo, on considère que la première option est la bonne si l'api ne renvoie pas correct_answer
      // Dans un vrai cas, l'API renvoie l'index correct
      if (userAnswers[i] === (q.correct_answer || 0)) s++;
    });
    setScore(s);
    setCurrentStep("result");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {currentStep === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="relative group">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`p-16 border-2 border-dashed rounded-[3rem] transition-all flex flex-col items-center gap-6 ${file ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`}
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${file ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                >
                  {file ? (
                    <CheckCircle2 size={40} />
                  ) : (
                    <UploadCloud size={40} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    {file ? file.name : "Prêt à tester vos connaissances ?"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">
                    Importez votre PDF pour générer des questions basées sur son
                    contenu.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!file || loading}
              className="w-full bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ClipboardCheck size={18} />
              )}
              Démarrer le Quiz IA
            </button>
          </motion.div>
        )}

        {currentStep === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {quiz.questions.map((q, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-950 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm"
                >
                  <div className="flex gap-4 mb-6">
                    <span className="flex-shrink-0 w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xs font-black text-slate-500">
                      {i + 1}
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {q.question}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, j) => (
                      <button
                        key={j}
                        onClick={() => handleAnswer(i, j)}
                        className={`p-4 rounded-xl text-left text-sm font-medium transition-all border-2 ${userAnswers[i] === j ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-slate-100 dark:border-slate-900 hover:border-slate-200 dark:hover:border-slate-800 text-slate-600 dark:text-slate-400"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length < quiz.questions.length}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:scale-105 transition-all disabled:opacity-50 shadow-2xl"
            >
              Valider mes réponses
            </button>
          </motion.div>
        )}

        {currentStep === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100 dark:border-slate-800"
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${score === quiz.questions.length ? "bg-emerald-500" : "bg-amber-500"} text-white shadow-xl`}
            >
              {score === quiz.questions.length ? (
                <Trophy size={48} />
              ) : (
                <AlertCircle size={48} />
              )}
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">
              {score} / {quiz.questions.length}
            </h2>
            <p className="text-slate-500 font-medium mb-10">
              {score === quiz.questions.length
                ? "Parfait ! Vous maîtrisez ce cours."
                : "Pas mal ! Encore un peu d'entraînement."}
            </p>
            <button
              onClick={() => {
                setCurrentStep("upload");
                setQuiz(null);
                setUserAnswers({});
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-slate-200 transition-all"
            >
              Recommencer avec un autre fichier
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
