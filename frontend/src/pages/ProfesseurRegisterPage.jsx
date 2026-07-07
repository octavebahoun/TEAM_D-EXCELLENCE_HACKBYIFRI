import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { authService } from "../services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GRADES = [
  { value: "", label: "— Grade (optionnel) —" },
  { value: "vacataire", label: "Vacataire" },
  { value: "assistant", label: "Assistant" },
  { value: "maitre_assistant", label: "Maître-assistant" },
  { value: "maitre_conference", label: "Maître de conférences" },
  { value: "professeur", label: "Professeur" },
];

const fieldClass =
  "w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 px-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all";

export default function ProfesseurRegisterPage() {
  const navigate = useNavigate();
  const [departements, setDepartements] = useState([]);
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    departement_id: "",
    specialite: "",
    grade: "",
    telephone: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    authService
      .getDepartementsPublics()
      .then((d) => setDepartements(Array.isArray(d) ? d : []))
      .catch(() => toast.error("Impossible de charger les départements."));
  }, []);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      await authService.professeurRegister(form);
      setDone(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})?.[0]?.[0] ||
        "Échec de l'inscription.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950 px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl"
        >
          <div className="grid place-items-center h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto mb-5">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Inscription enregistrée
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Ton compte doit être{" "}
            <strong>validé par ton chef de département</strong>. Une fois validé,
            connecte-toi avec l'email et le mot de passe choisis ici.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="mt-6 w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold"
          >
            Aller à la connexion <ArrowRight size={16} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary mb-6"
        >
          <ArrowLeft size={16} /> Retour à la connexion
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="grid place-items-center h-11 w-11 rounded-2xl bg-primary/10 text-primary">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Inscription Professeur
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ton compte sera activé après validation du chef de département.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Prénom</Label>
              <Input
                className="h-11 rounded-xl"
                value={form.prenom}
                onChange={set("prenom")}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nom</Label>
              <Input
                className="h-11 rounded-xl"
                value={form.nom}
                onChange={set("nom")}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Email</Label>
              <Input
                type="email"
                className="h-11 rounded-xl"
                value={form.email}
                onChange={set("email")}
                placeholder="prof@universite.edu"
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Département</Label>
              <select
                className={fieldClass}
                value={form.departement_id}
                onChange={set("departement_id")}
                required
              >
                <option value="" disabled>
                  — Choisir ton département —
                </option>
                {departements.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nom}
                    {d.code ? ` (${d.code})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Grade</Label>
              <select
                className={fieldClass}
                value={form.grade}
                onChange={set("grade")}
              >
                {GRADES.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Spécialité</Label>
              <Input
                className="h-11 rounded-xl"
                value={form.specialite}
                onChange={set("specialite")}
                placeholder="Mathématiques…"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Téléphone (optionnel)</Label>
              <Input
                className="h-11 rounded-xl"
                value={form.telephone}
                onChange={set("telephone")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mot de passe</Label>
              <Input
                type="password"
                className="h-11 rounded-xl"
                value={form.password}
                onChange={set("password")}
                placeholder="Min. 6 caractères"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirmer</Label>
              <Input
                type="password"
                className="h-11 rounded-xl"
                value={form.password_confirmation}
                onChange={set("password_confirmation")}
                required
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold"
              >
                {loading ? (
                  "Inscription…"
                ) : (
                  <>
                    Créer mon compte <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
