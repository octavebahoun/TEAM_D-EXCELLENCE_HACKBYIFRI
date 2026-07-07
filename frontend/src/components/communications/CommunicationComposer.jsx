import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, Paperclip, Send, CalendarClock, X } from "lucide-react";

const TYPES = [
  { value: "info", label: "Information" },
  { value: "annulation", label: "Cours annulé" },
  { value: "rattrapage", label: "Rattrapage" },
  { value: "support", label: "Support de cours" },
  { value: "regle", label: "Règle de classe" },
];

const fieldClass =
  "w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 px-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all";

export default function CommunicationComposer({ filieres = [], onPublish }) {
  const [filiereId, setFiliereId] = useState("");
  const [type, setType] = useState("info");
  const [titre, setTitre] = useState("");
  const [message, setMessage] = useState("");
  const [dateEvenement, setDateEvenement] = useState("");
  const [fichier, setFichier] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const needsDate = type === "rattrapage" || type === "annulation";

  // Auto-sélection quand l'utilisateur n'a qu'une seule classe (ex : responsable).
  useEffect(() => {
    if (filieres.length === 1) setFiliereId(String(filieres[0].id));
  }, [filieres]);

  const reset = () => {
    setType("info");
    setTitre("");
    setMessage("");
    setDateEvenement("");
    setFichier(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!filiereId || !titre.trim() || submitting) return;

    setSubmitting(true);
    const payload = {
      filiere_id: filiereId,
      type,
      titre: titre.trim(),
      message: message.trim(),
    };
    if (needsDate && dateEvenement) payload.date_evenement = dateEvenement;
    if (fichier) payload.fichier = fichier;

    const ok = await onPublish(payload);
    setSubmitting(false);
    if (ok) reset();
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-primary/10 text-primary">
            <Megaphone size={16} />
          </span>
          Publier une communication
        </CardTitle>
        <CardDescription>
          La classe ciblée sera notifiée automatiquement.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Filière */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700 dark:text-slate-300">
              Classe destinataire
            </Label>
            <select
              className={fieldClass}
              value={filiereId}
              onChange={(e) => setFiliereId(e.target.value)}
              required
            >
              <option value="" disabled>
                — Choisir une classe —
              </option>
              {filieres.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nom} {f.niveau ? `(${f.niveau})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700 dark:text-slate-300">
              Type
            </Label>
            <select
              className={fieldClass}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Titre */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700 dark:text-slate-300">
              Titre
            </Label>
            <Input
              className="h-11 rounded-xl"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex : Cours de Maths annulé demain"
              maxLength={150}
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700 dark:text-slate-300">
              Message
            </Label>
            <textarea
              className={`${fieldClass} h-24 py-2 resize-none`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Détails, consignes, nouvelle date…"
              maxLength={5000}
            />
          </div>

          {/* Date événement (rattrapage / annulation) */}
          {needsDate && (
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <CalendarClock size={14} /> Date / heure concernée
              </Label>
              <input
                type="datetime-local"
                className={fieldClass}
                value={dateEvenement}
                onChange={(e) => setDateEvenement(e.target.value)}
              />
            </div>
          )}

          {/* Fichier support */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-slate-700 dark:text-slate-300">
              Support de cours (optionnel)
            </Label>
            {fichier ? (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 truncate">
                  <Paperclip size={14} className="text-primary shrink-0" />
                  <span className="truncate">{fichier.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setFichier(null)}
                  className="text-slate-400 hover:text-destructive shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-500 hover:border-primary hover:text-primary transition-colors">
                <Paperclip size={16} />
                Joindre un fichier (PDF, image… 10 Mo max)
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFichier(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting || !filiereId || !titre.trim()}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            {submitting ? (
              "Publication…"
            ) : (
              <>
                <Send size={16} className="mr-2" /> Publier & notifier la classe
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
