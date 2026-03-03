<?php

/**
 * Générateur de CSV massifs pour AcademiX.
 *
 * Usage : php artisan tinker --execute="require 'generate_csv.php';"
 *    ou : php generate_csv.php  (depuis le dossier backend/laravel)
 *
 * Génère dans csv_templates/ :
 *   - etudiants_{code_filiere}.csv    → Import CSV d'étudiants
 *   - notes_{code_filiere}.csv        → Import CSV de notes
 *   - emploi_temps_{code_filiere}.csv → Import CSV d'emploi du temps
 */

// ── Si lancé hors artisan, bootstrap Laravel manuellement ──
if (!function_exists('app')) {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
}

use App\Models\Filiere;
use App\Models\User;
use App\Models\Note;
use App\Models\EmploiTempsFiliere;
use App\Models\Matiere;

$outputDir = realpath(__DIR__ . '/../../csv_templates') ?: __DIR__ . '/../../csv_templates';
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
}

// Vider les anciens CSV
foreach (glob("{$outputDir}/*.csv") as $old) {
    unlink($old);
}

$filieres = Filiere::with('departement')->get();

echo "\n╔══════════════════════════════════════════════════════╗\n";
echo "║   📄 GÉNÉRATION DES CSV POUR CHAQUE FILIÈRE         ║\n";
echo "╚══════════════════════════════════════════════════════╝\n\n";

foreach ($filieres as $fil) {
    $code = strtolower($fil->code);
    $codeUpper = $fil->code;
    $dept = $fil->departement;

    // ─── 1. CSV Étudiants ────────────────────────────────────────────────
    $students = User::where('filiere_id', $fil->id)->orderBy('id')->get();
    if ($students->isNotEmpty()) {
        $fp = fopen("{$outputDir}/etudiants_{$code}.csv", 'w');
        fputcsv($fp, ['matricule', 'nom', 'prenom', 'filiere_code', 'annee_admission']);
        foreach ($students as $s) {
            fputcsv($fp, [$s->matricule, $s->nom, $s->prenom, $codeUpper, $s->annee_admission ?? '2025']);
        }
        fclose($fp);
    }

    // ─── 2. CSV Notes ────────────────────────────────────────────────────
    $notes = Note::whereIn('user_id', $students->pluck('id'))
        ->with(['user', 'matiere'])
        ->orderBy('user_id')
        ->orderBy('date_evaluation')
        ->get();

    if ($notes->isNotEmpty()) {
        $fp = fopen("{$outputDir}/notes_{$code}.csv", 'w');
        fputcsv($fp, ['matricule', 'nom', 'prenom', 'filiere_code', 'matiere_code', 'note', 'note_max', 'type_evaluation', 'coefficient', 'date_evaluation', 'semestre', 'annee_academique']);
        foreach ($notes as $n) {
            fputcsv($fp, [
                $n->user->matricule,
                $n->user->nom,
                $n->user->prenom,
                $codeUpper,
                $n->matiere->code ?? '',
                $n->note,
                $n->note_max,
                $n->type_evaluation,
                $n->coefficient,
                $n->date_evaluation->format('Y-m-d'),
                $n->semestre,
                $n->annee_academique,
            ]);
        }
        fclose($fp);
    }

    // ─── 3. CSV Emploi du temps ──────────────────────────────────────────
    $emplois = EmploiTempsFiliere::where('filiere_id', $fil->id)
        ->with('matiere')
        ->orderByRaw("FIELD(jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi')")
        ->orderBy('heure_debut')
        ->get();

    if ($emplois->isNotEmpty()) {
        $fp = fopen("{$outputDir}/emploi_temps_{$code}.csv", 'w');
        fputcsv($fp, ['filiere_code', 'matiere_code', 'jour', 'heure_debut', 'heure_fin', 'salle', 'type_cours', 'enseignant', 'semestre']);
        foreach ($emplois as $e) {
            fputcsv($fp, [
                $codeUpper,
                $e->matiere->code ?? '',
                $e->jour,
                is_string($e->heure_debut) ? $e->heure_debut : $e->heure_debut->format('H:i'),
                is_string($e->heure_fin) ? $e->heure_fin : $e->heure_fin->format('H:i'),
                $e->salle,
                $e->type_cours,
                $e->enseignant,
                $e->semestre,
            ]);
        }
        fclose($fp);
    }

    $nbEtu = $students->count();
    $nbNotes = $notes->count();
    $nbEmploi = $emplois->count();
    echo "  ✓ {$codeUpper} : {$nbEtu} étudiants, {$nbNotes} notes, {$nbEmploi} créneaux\n";
}

$totalCsv = count(glob("{$outputDir}/*.csv"));
echo "\n  📁 {$totalCsv} fichiers CSV générés dans {$outputDir}/\n\n";
