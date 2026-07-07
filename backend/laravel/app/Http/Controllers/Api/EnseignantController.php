<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enseignant;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class EnseignantController extends Controller
{
    /** departement_id du chef connecté (null si super admin). */
    private function chefDeptId($admin)
    {
        $isChef = method_exists($admin, 'isChefDepartement') && $admin->isChefDepartement();
        return $isChef ? $admin->departement_id : null;
    }

    private function canAccess($admin, Enseignant $enseignant): bool
    {
        $deptId = $this->chefDeptId($admin);
        return $deptId === null || $enseignant->departement_id === (int) $deptId;
    }

    public function index(Request $request)
    {
        $deptId = $this->chefDeptId($request->user());

        $enseignants = Enseignant::with('matieres:id,nom,code')
            ->when($deptId, fn($q) => $q->where('departement_id', $deptId))
            ->when(!$deptId && $request->departement_id, fn($q, $v) => $q->where('departement_id', $v))
            ->when($request->search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('nom', 'like', "%{$search}%")
                        ->orWhere('prenom', 'like', "%{$search}%")
                        ->orWhere('specialite', 'like', "%{$search}%");
                });
            })
            ->when($request->has('is_active'), fn($q) => $q->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN)))
            ->orderBy('nom')
            ->paginate(20);

        return response()->json($enseignants);
    }

    public function store(Request $request)
    {
        $admin = $request->user();
        $deptId = $this->chefDeptId($admin);

        $validated = $request->validate([
            'departement_id' => $deptId ? 'nullable' : 'required|integer|exists:departements,id',
            'nom'            => 'required|string|max:100',
            'prenom'         => 'required|string|max:100',
            'email'          => 'nullable|email|unique:enseignants,email',
            'password'       => 'nullable|string|min:6',
            'telephone'      => 'nullable|string|max:20',
            'specialite'     => 'nullable|string|max:150',
            'grade'          => 'nullable|in:vacataire,assistant,maitre_assistant,maitre_conference,professeur',
            'disponibilites' => 'nullable|array',
            'is_active'      => 'sometimes|boolean',
        ]);

        // Un chef ne peut créer un enseignant que dans SON département.
        $validated['departement_id'] = $deptId ?: $validated['departement_id'];

        // Mot de passe (optionnel) : donne au professeur un accès connectable.
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $enseignant = Enseignant::create($validated);
        AuditLog::record($admin, 'enseignant.cree', "Enseignant {$enseignant->prenom} {$enseignant->nom} créé", [], $enseignant);

        return response()->json($enseignant, 201);
    }

    public function show(Request $request, $id)
    {
        $enseignant = Enseignant::with(['matieres:id,nom,code', 'departement:id,nom,code'])->findOrFail($id);
        if (!$this->canAccess($request->user(), $enseignant)) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        return response()->json($enseignant);
    }

    public function update(Request $request, $id)
    {
        $enseignant = Enseignant::findOrFail($id);
        $admin = $request->user();
        if (!$this->canAccess($admin, $enseignant)) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'nom'            => 'sometimes|string|max:100',
            'prenom'         => 'sometimes|string|max:100',
            'email'          => ['nullable', 'email', Rule::unique('enseignants', 'email')->ignore($id)],
            'password'       => 'nullable|string|min:6',
            'telephone'      => 'nullable|string|max:20',
            'specialite'     => 'nullable|string|max:150',
            'grade'          => 'nullable|in:vacataire,assistant,maitre_assistant,maitre_conference,professeur',
            'disponibilites' => 'nullable|array',
            'is_active'      => 'sometimes|boolean',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $enseignant->update($validated);

        $logMeta = $validated;
        unset($logMeta['password']);
        AuditLog::record($admin, 'enseignant.modifie', "Enseignant #{$enseignant->id} modifié", $logMeta, $enseignant);

        return response()->json($enseignant->fresh()->load('matieres:id,nom'));
    }

    public function destroy(Request $request, $id)
    {
        $enseignant = Enseignant::findOrFail($id);
        $admin = $request->user();
        if (!$this->canAccess($admin, $enseignant)) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $enseignant->matieres()->detach();
        $enseignant->delete();
        AuditLog::record($admin, 'enseignant.supprime', "Enseignant #{$id} supprimé", [], null);

        return response()->noContent();
    }

    /** Le chef valide un compte professeur en attente (is_active = true → il peut se connecter). */
    public function valider(Request $request, $id)
    {
        $enseignant = Enseignant::findOrFail($id);
        $admin = $request->user();
        if (!$this->canAccess($admin, $enseignant)) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $enseignant->update(['is_active' => true]);
        AuditLog::record($admin, 'enseignant.valide', "Compte professeur #{$enseignant->id} validé", [], $enseignant);

        return response()->json($enseignant->fresh()->load('matieres:id,nom'));
    }

    /** Affecter une matière (cours) à un enseignant. */
    public function assignMatiere(Request $request, $id)
    {
        $enseignant = Enseignant::findOrFail($id);
        $admin = $request->user();
        if (!$this->canAccess($admin, $enseignant)) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'matiere_id' => 'required|integer|exists:matieres,id',
        ]);

        if ($enseignant->matieres()->where('matiere_id', $validated['matiere_id'])->exists()) {
            return response()->json(['message' => 'Matière déjà affectée à cet enseignant.'], 409);
        }

        $enseignant->matieres()->attach($validated['matiere_id']);
        AuditLog::record($admin, 'enseignant.affectation', "Matière #{$validated['matiere_id']} affectée à l'enseignant #{$id}", $validated, $enseignant);

        return response()->json(['message' => 'Matière affectée avec succès.'], 201);
    }

    public function removeMatiere(Request $request, $id, $matiereId)
    {
        $enseignant = Enseignant::findOrFail($id);
        $admin = $request->user();
        if (!$this->canAccess($admin, $enseignant)) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $enseignant->matieres()->detach($matiereId);
        AuditLog::record($admin, 'enseignant.desaffectation', "Matière #{$matiereId} retirée de l'enseignant #{$id}", [], $enseignant);

        return response()->noContent();
    }
}
