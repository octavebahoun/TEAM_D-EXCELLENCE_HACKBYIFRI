<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Communication;
use App\Models\Filiere;
use App\Models\User;
use App\Models\Admin;
use App\Models\ChefDepartement;
use App\Models\Enseignant;
use App\Models\AuditLog;
use App\Jobs\GenerateAlerteJob;
use Illuminate\Http\Request;

class CommunicationController extends Controller
{
    /** [type, id] de l'auteur selon le profil authentifié. */
    private function author($user): array
    {
        if ($user instanceof Admin) return ['admin', $user->id];
        if ($user instanceof ChefDepartement) return ['chef', $user->id];
        if ($user instanceof Enseignant) return ['professeur', $user->id];
        return ['responsable', $user->id]; // User (étudiant) avec is_responsable
    }

    /** L'utilisateur a-t-il le droit de publier / lire dans cette filière ? */
    private function canAccessFiliere($user, Filiere $filiere): bool
    {
        if ($user instanceof Admin) return true;
        if ($user instanceof ChefDepartement) return $filiere->departement_id == $user->departement_id;
        if ($user instanceof Enseignant) return $filiere->departement_id == $user->departement_id;
        return $filiere->id == $user->filiere_id; // responsable / étudiant : sa propre classe
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Communication::with('filiere:id,nom,niveau')->orderByDesc('created_at');

        if ($user instanceof Admin) {
            $query->when($request->filiere_id, fn($q, $v) => $q->where('filiere_id', $v));
        } elseif ($user instanceof ChefDepartement || $user instanceof Enseignant) {
            $filiereIds = Filiere::where('departement_id', $user->departement_id)->pluck('id');
            $query->whereIn('filiere_id', $filiereIds)
                  ->when($request->filiere_id, fn($q, $v) => $q->where('filiere_id', $v));
        } else {
            // étudiant / responsable → sa filière
            $query->where('filiere_id', $user->filiere_id);
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'filiere_id'     => 'required|integer|exists:filieres,id',
            'type'           => 'nullable|in:info,annulation,rattrapage,support,regle',
            'titre'          => 'required|string|max:150',
            'message'        => 'nullable|string|max:5000',
            'date_evenement' => 'nullable|date',
            'notifie_admin'  => 'sometimes|boolean',
            'fichier'        => 'nullable|file|max:10240', // support de cours (10 Mo max)
        ]);

        $filiere = Filiere::findOrFail($validated['filiere_id']);
        if (!$this->canAccessFiliere($user, $filiere)) {
            return response()->json(['message' => "Vous ne pouvez pas publier dans cette classe."], 403);
        }

        [$auteurType, $auteurId] = $this->author($user);

        $fichierUrl = null;
        $fichierNom = null;
        if ($request->hasFile('fichier')) {
            $path = $request->file('fichier')->store('supports', 'public');
            $fichierUrl = asset('storage/' . $path);
            $fichierNom = $request->file('fichier')->getClientOriginalName();
        }

        $communication = Communication::create([
            'filiere_id'     => $filiere->id,
            'auteur_type'    => $auteurType,
            'auteur_id'      => $auteurId,
            'auteur_nom'     => trim(($user->prenom ?? '') . ' ' . ($user->nom ?? '')),
            'type'           => $validated['type'] ?? 'info',
            'titre'          => $validated['titre'],
            'message'        => $validated['message'] ?? null,
            'date_evenement' => $validated['date_evenement'] ?? null,
            'fichier_url'    => $fichierUrl,
            'fichier_nom'    => $fichierNom,
            'notifie_admin'  => (bool) ($validated['notifie_admin'] ?? false),
        ]);

        $this->notifierEtudiants($communication, $filiere);

        AuditLog::record($user, 'communication.creee', "Communication « {$communication->titre} » publiée (filière #{$filiere->id})", ['communication_id' => $communication->id]);

        return response()->json($communication->load('filiere:id,nom'), 201);
    }

    /** Notifie tous les étudiants de la filière (réutilise le pipeline d'alertes). */
    private function notifierEtudiants(Communication $communication, Filiere $filiere): void
    {
        $etudiantIds = User::where('filiere_id', $filiere->id)->where('is_active', true)->pluck('id');

        foreach ($etudiantIds as $uid) {
            GenerateAlerteJob::dispatch([
                'user_id'         => $uid,
                'reference_id'    => "comm_{$communication->id}_{$uid}",
                'type_alerte'     => 'communication',
                'niveau_severite' => $communication->type === 'annulation' ? 'eleve' : 'faible',
                'titre'           => $communication->titre,
                'message'         => $communication->message ?: 'Nouvelle information de votre classe.',
                'actions_suggerees' => [
                    ['type' => 'link', 'label' => 'Voir la communication', 'url' => '/student/communications'],
                ],
            ]);
        }
    }

    /** Filières que l'utilisateur peut cibler (pour le sélecteur de publication). */
    public function filieres(Request $request)
    {
        $user = $request->user();

        if ($user instanceof Enseignant || $user instanceof ChefDepartement) {
            return response()->json(
                Filiere::where('departement_id', $user->departement_id)->orderBy('nom')->get(['id', 'nom', 'niveau'])
            );
        }

        // responsable / étudiant : uniquement sa filière
        return response()->json(
            Filiere::where('id', $user->filiere_id)->get(['id', 'nom', 'niveau'])
        );
    }

    public function destroy(Request $request, $id)
    {
        $communication = Communication::findOrFail($id);
        $user = $request->user();
        [$auteurType, $auteurId] = $this->author($user);

        $estAuteur = $communication->auteur_type === $auteurType && $communication->auteur_id == $auteurId;
        $estAdminOuChef = ($user instanceof Admin) || ($user instanceof ChefDepartement);

        if (!$estAuteur && !$estAdminOuChef) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        // Un chef ne peut supprimer que dans son département.
        if ($user instanceof ChefDepartement) {
            $filiere = Filiere::find($communication->filiere_id);
            if (!$filiere || $filiere->departement_id != $user->departement_id) {
                return response()->json(['message' => 'Non autorisé.'], 403);
            }
        }

        $communication->delete();
        AuditLog::record($user, 'communication.supprimee', "Communication #{$id} supprimée", []);

        return response()->noContent();
    }
}
