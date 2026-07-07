<?php

namespace App\Observers;

use App\Models\Note;
use App\Jobs\GenerateAlerteJob;

class NoteObserver
{
    /**
     * Handle the Note "created" event.
     */
    public function created(Note $note): void
    {
        // On n'alerte l'étudiant que pour une note déjà validée.
        if ($note->statut === 'validee') {
            $this->handleNotePerformance($note);
        }
    }

    /**
     * Handle the Note "updated" event.
     */
    public function updated(Note $note): void
    {
        // Alerte quand la note vient d'être validée, ou quand une note déjà
        // validée voit sa valeur changer.
        $vientDEtreValidee = $note->isDirty('statut') && $note->statut === 'validee';
        $noteModifieeEtValidee = $note->isDirty('note') && $note->statut === 'validee';

        if ($vientDEtreValidee || $noteModifieeEtValidee) {
            $this->handleNotePerformance($note);
        }
    }

    /**
     * Logique de détection de performance basée sur le seuil de 12/20.
     */
    protected function handleNotePerformance(Note $note): void
    {
        $noteValue = (float) $note->note;
        $noteMax = (float) ($note->note_max ?? 20);
        
        // Conversion sur 20 pour le test de seuil
        $normalizedNote = ($noteValue / $noteMax) * 20;

        if ($normalizedNote < 12) {
            $this->generateLowPerformanceAlerte($note, $normalizedNote);
        } elseif ($normalizedNote >= 16) {
            $this->generateHighPerformanceAlerte($note, $normalizedNote);
        }
    }

    protected function generateLowPerformanceAlerte(Note $note, float $normalizedNote): void
    {
        // On utilise l'ID de la matière pour créer une référence unique par jour/note
        // Ça évite de spammer l'étudiant s'il y a plusieurs updates dans la même journée
        $referenceId = "note_{$note->id}_low";
        
        // On récupère le nom de la matière si chargée, sinon ID (le Job pourra l'enrichir si besoin)
        $matiereNom = $note->relationLoaded('matiere') ? $note->matiere->nom : "Matière ID: {$note->matiere_id}";

        GenerateAlerteJob::dispatch([
            'user_id' => $note->user_id,
            'reference_id' => $referenceId,
            'type_alerte' => 'note_faible',
            'niveau_severite' => $normalizedNote < 8 ? 'eleve' : 'moyen',
            'titre' => "Alerte de performance : $matiereNom",
            'message' => "Ta note de {$note->note}/{$note->note_max} est en dessous du seuil d'excellence de 12/20. Ne te décourage pas, identifie tes lacunes !",
            'actions_suggerees' => [
                ['type' => 'link', 'label' => 'Réviser le cours', 'url' => "/student/matieres/{$note->matiere_id}"],
                ['type' => 'link', 'label' => 'Contacter un tuteur', 'url' => "/student/tutorat"]
            ]
        ]);
    }

    protected function generateHighPerformanceAlerte(Note $note, float $normalizedNote): void
    {
        $referenceId = "note_{$note->id}_high";
        $matiereNom = $note->relationLoaded('matiere') ? $note->matiere->nom : "Matière ID: {$note->matiere_id}";

        GenerateAlerteJob::dispatch([
            'user_id' => $note->user_id,
            'reference_id' => $referenceId,
            'type_alerte' => 'felicitation', 
            'niveau_severite' => 'faible',
            'titre' => "Félicitations !  - $matiereNom",
            'message' => "Excellente performance avec un {$note->note}/{$note->note_max}. Continue sur cette lancée vers l'excellence !",
            'actions_suggerees' => [
                ['type' => 'share', 'label' => 'Partager ma réussite', 'url' => "#"]
            ]
        ]);
    }
}
