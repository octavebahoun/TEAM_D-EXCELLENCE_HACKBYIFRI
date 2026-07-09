<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Communication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfesseurController extends Controller
{
    /**
     * Statistiques d'en-tête du tableau de bord professeur (données réelles).
     * L'utilisateur authentifié est un Enseignant (middleware `professeur`).
     */
    public function stats(Request $request)
    {
        $prof = $request->user();

        // Matières assignées au professeur (pivot enseignant_matiere).
        $matiereIds = $prof->matieres()->pluck('matieres.id');

        // Filières qui partagent au moins une de ces matières (pivot filiere_matieres).
        $filiereIds = $matiereIds->isEmpty()
            ? collect()
            : DB::table('filiere_matieres')
                ->whereIn('matiere_id', $matiereIds)
                ->pluck('filiere_id')
                ->unique();

        // Étudiants actifs inscrits dans ces filières.
        $nbEtudiants = $filiereIds->isEmpty()
            ? 0
            : User::whereIn('filiere_id', $filiereIds)->where('is_active', true)->count();

        // Communications publiées par ce professeur.
        $nbCommunications = Communication::where('auteur_type', 'professeur')
            ->where('auteur_id', $prof->id)
            ->count();

        return response()->json([
            'matieres'       => $matiereIds->count(),
            'etudiants'      => $nbEtudiants,
            'communications' => $nbCommunications,
        ]);
    }
}
