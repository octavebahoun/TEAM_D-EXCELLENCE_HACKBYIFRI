<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Models\User;
use App\Models\AuditLog;
use App\Jobs\GenerateAlerteJob;
use Illuminate\Http\Request;

class AbsenceController extends Controller
{
    /** Vérifie que l'acteur (chef OU responsable de classe) peut gérer cet étudiant. */
    private function ownsStudent($actor, User $student): bool
    {
        if ($actor instanceof \App\Models\User) {
            // Responsable de classe → uniquement les étudiants de SA filière
            return $student->filiere_id == $actor->filiere_id;
        }
        if (method_exists($actor, 'isChefDepartement') && $actor->isChefDepartement()) {
            $student->loadMissing('filiere');
            return $student->filiere && $student->filiere->departement_id == $actor->departement_id;
        }
        return true; // super admin
    }

    private function scopeToDepartement($query, $actor)
    {
        if ($actor instanceof \App\Models\User) {
            // Responsable → uniquement sa filière
            $query->whereHas('user', function ($q) use ($actor) {
                $q->where('filiere_id', $actor->filiere_id);
            });
        } elseif (method_exists($actor, 'isChefDepartement') && $actor->isChefDepartement()) {
            $query->whereHas('user.filiere', function ($q) use ($actor) {
                $q->where('departement_id', $actor->departement_id);
            });
        }
        return $query;
    }

    public function index(Request $request)
    {
        $admin = $request->user();

        $absences = Absence::with(['user:id,nom,prenom,matricule,filiere_id', 'matiere:id,nom,code'])
            ->tap(fn($q) => $this->scopeToDepartement($q, $admin))
            ->when($request->user_id, fn($q, $v) => $q->where('user_id', $v))
            ->when($request->matiere_id, fn($q, $v) => $q->where('matiere_id', $v))
            ->when($request->has('justifiee'), fn($q) => $q->where('justifiee', filter_var($request->justifiee, FILTER_VALIDATE_BOOLEAN)))
            ->when($request->date_debut, fn($q, $v) => $q->whereDate('date_absence', '>=', $v))
            ->when($request->date_fin, fn($q, $v) => $q->whereDate('date_absence', '<=', $v))
            ->orderByDesc('date_absence')
            ->paginate(20);

        return response()->json($absences);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'         => 'required|integer|exists:users,id',
            'matiere_id'      => 'nullable|integer|exists:matieres,id',
            'emploi_temps_id' => 'nullable|integer',
            'date_absence'    => 'required|date',
            'type'            => 'nullable|in:cours,examen,tp,autre',
            'justifiee'       => 'sometimes|boolean',
            'motif'           => 'nullable|string|max:255',
            'duree_minutes'   => 'nullable|integer|min:0',
        ]);

        $admin = $request->user();
        $user = User::with('filiere')->findOrFail($validated['user_id']);

        if (!$this->ownsStudent($admin, $user)) {
            return response()->json(['message' => "L'étudiant n'appartient pas à votre département."], 403);
        }

        $validated['created_by_admin_id'] = $admin->id;
        $absence = Absence::create($validated);

        // Notification automatique à l'étudiant (réutilise le pipeline d'alertes existant)
        if (!$absence->justifiee) {
            GenerateAlerteJob::dispatch([
                'user_id'         => $absence->user_id,
                'reference_id'    => "absence_{$absence->id}",
                'type_alerte'     => 'absence',
                'niveau_severite' => 'moyen',
                'titre'           => 'Nouvelle absence enregistrée',
                'message'         => "Une absence a été enregistrée le " . $absence->date_absence->format('d/m/Y') . ". En cas d'erreur ou si tu as un justificatif, rapproche-toi de ton département.",
                'actions_suggerees' => [
                    ['type' => 'link', 'label' => 'Voir mes absences', 'url' => '/student/absences'],
                ],
            ]);
        }

        AuditLog::record($admin, 'absence.creee', "Absence enregistrée pour l'étudiant #{$absence->user_id}", ['absence_id' => $absence->id], $absence);

        return response()->json($absence->load(['user:id,nom,prenom,matricule', 'matiere:id,nom']), 201);
    }

    public function update(Request $request, $id)
    {
        $absence = Absence::with('user.filiere')->findOrFail($id);
        $admin = $request->user();

        if (!$this->ownsStudent($admin, $absence->user)) {
            return response()->json(['message' => "L'étudiant n'appartient pas à votre département."], 403);
        }

        $validated = $request->validate([
            'justifiee'     => 'sometimes|boolean',
            'motif'         => 'nullable|string|max:255',
            'type'          => 'sometimes|in:cours,examen,tp,autre',
            'duree_minutes' => 'nullable|integer|min:0',
        ]);

        $absence->update($validated);
        AuditLog::record($admin, 'absence.modifiee', "Absence #{$absence->id} modifiée", $validated, $absence);

        return response()->json($absence->fresh()->load(['user:id,nom,prenom', 'matiere:id,nom']));
    }

    public function destroy(Request $request, $id)
    {
        $absence = Absence::with('user.filiere')->findOrFail($id);
        $admin = $request->user();

        if (!$this->ownsStudent($admin, $absence->user)) {
            return response()->json(['message' => "L'étudiant n'appartient pas à votre département."], 403);
        }

        $absence->delete();
        AuditLog::record($admin, 'absence.supprimee', "Absence #{$id} supprimée", [], null);

        return response()->noContent();
    }

    /** Récapitulatif des absences par étudiant (suivi). */
    public function stats(Request $request)
    {
        $admin = $request->user();

        $stats = Absence::selectRaw('user_id, COUNT(*) as total, SUM(CASE WHEN justifiee = 0 THEN 1 ELSE 0 END) as non_justifiees')
            ->tap(fn($q) => $this->scopeToDepartement($q, $admin))
            ->with('user:id,nom,prenom,matricule')
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->get();

        return response()->json($stats);
    }
}
