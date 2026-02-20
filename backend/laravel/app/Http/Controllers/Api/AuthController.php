<?php

namespace App\Http\Controllers\Api;

// AuthController : responsable UNIQUEMENT de l'authentification
// ✅ Admin Login / Logout
// ✅ Chef de Département Login / Logout
// ✅ Étudiant Register / Login / Logout
// ✅ Me (profil de l'utilisateur connecté)
// ❌ PAS de création de département (→ DepartementController)
// ❌ PAS de création de chef (→ ChefDepartementController)

use App\Models\User;
use App\Models\Admin;
use App\Models\ChefDepartement;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ---------------------------------------------------------------
    // CONNEXION SUPER ADMIN
    // POST /api/v1/auth/admin/login
    // Accès : public (non protégé)
    // ---------------------------------------------------------------
    public function adminLogin(Request $request)
    {
        // 1. Valider que l'email et le mot de passe sont fournis
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // 2. Chercher le Super Admin par son email dans la table super_admins
        $admin = Admin::where('email', $request->email)->first();

        // 3. Vérifier que l'admin existe ET que le mot de passe correspond
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        // 4. Vérifier que le compte n'est pas désactivé
        if (!$admin->is_active) {
            return response()->json(['message' => 'Compte désactivé. Contactez le responsable.'], 403);
        }

        // 5. Mettre à jour la date de dernière connexion
        $admin->update([
            'last_login'  => now(),
            'is_connect'  => true,
        ]);

        // 6. Générer le token Sanctum pour les prochaines requêtes
        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token'      => $token,
            'token_type' => 'Bearer',
            'admin'      => $admin,
            'role'       => 'super_admin',
        ]);
    }

    // ---------------------------------------------------------------
    // DÉCONNEXION SUPER ADMIN
    // POST /api/v1/auth/admin/logout
    // Accès : super_admin authentifié (Bearer Token requis)
    // ---------------------------------------------------------------
    public function adminLogout(Request $request)
    {
        // Révoquer uniquement le token courant (pas tous les tokens)
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    // ---------------------------------------------------------------
    // CONNEXION CHEF DE DÉPARTEMENT
    // POST /api/v1/auth/chef/login
    // Accès : public (non protégé)
    // ---------------------------------------------------------------
    public function chefLogin(Request $request)
    {
        // 1. Valider les identifiants
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // 2. Chercher le Chef dans la table chefs_departement
        $chef = ChefDepartement::where('email', $request->email)->first();

        // 3. Vérifier les credentials
        if (!$chef || !Hash::check($request->password, $chef->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        // 4. Vérifier que le compte est actif
        if (!$chef->is_active) {
            return response()->json(['message' => 'Compte désactivé. Contactez le Super Administrateur.'], 403);
        }

        // 5. Mettre à jour la date de connexion
        $chef->update(['last_login' => now()]);

        // 6. Générer le token Sanctum
        $token = $chef->createToken('chef-token')->plainTextToken;

        return response()->json([
            'token'      => $token,
            'token_type' => 'Bearer',
            'chef'       => $chef,
            'role'       => 'chef_departement',
        ]);
    }

    // ---------------------------------------------------------------
    // DÉCONNEXION CHEF DE DÉPARTEMENT
    // POST /api/v1/auth/chef/logout
    // Accès : chef_departement authentifié (Bearer Token requis)
    // ---------------------------------------------------------------
    public function chefLogout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    // ---------------------------------------------------------------
    // INSCRIPTION ÉTUDIANT (via matricule pré-existant)
    // POST /api/v1/auth/student/register
    // Accès : public (non protégé)
    //
    // WORKFLOW :
    //   1. Le Super Admin importe les étudiants via CSV (matricule + nom + filière)
    //   2. L'étudiant complète son compte ici avec email + password
    // ---------------------------------------------------------------
    public function studentRegister(Request $request)
    {
        // 1. Valider les données
        $request->validate([
            'matricule'             => 'required|string|exists:users,matricule',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:8|confirmed',
            'telephone'             => 'nullable|string|max:20',
        ]);

        // 2. Trouver l'étudiant par son matricule (créé lors de l'import CSV)
        $user = User::where('matricule', $request->matricule)->firstOrFail();

        // 3. Vérifier que le compte n'est pas déjà activé
        if (!empty($user->email)) {
            return response()->json(['message' => 'Ce compte est déjà activé.'], 409);
        }

        // 4. Activer le compte en renseignant email + password hashé
        $user->update([
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'telephone' => $request->telephone,
            'is_active' => true,
        ]);

        // 5. Créer le token et retourner
        $token = $user->createToken('student-token')->plainTextToken;

        return response()->json([
            'token'      => $token,
            'token_type' => 'Bearer',
            'user'       => $user->load('filiere'),
        ], 201);
    }

    // ---------------------------------------------------------------
    // CONNEXION ÉTUDIANT
    // POST /api/v1/auth/student/login
    // Accès : public (non protégé)
    // ---------------------------------------------------------------
    public function studentLogin(Request $request)
    {
        // 1. Valider les identifiants
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // 2. Chercher l'étudiant par email avec sa filière chargée
        $user = User::with('filiere.departement')
            ->where('email', $request->email)
            ->first();

        // 3. Vérifier les credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        // 4. Vérifier que le compte est actif
        if (!$user->is_active) {
            return response()->json(['message' => 'Compte désactivé.'], 403);
        }

        // 5. Mettre à jour la date de dernière connexion
        $user->update(['last_login' => now()]);

        // 6. Générer le token Sanctum
        $token = $user->createToken('student-token')->plainTextToken;

        return response()->json([
            'token'      => $token,
            'token_type' => 'Bearer',
            'user'       => $user,
            'role'       => 'student',
        ]);
    }

    // ---------------------------------------------------------------
    // DÉCONNEXION ÉTUDIANT
    // POST /api/v1/auth/student/logout
    // Accès : étudiant authentifié (Bearer Token requis)
    // ---------------------------------------------------------------
    public function studentLogout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    // ---------------------------------------------------------------
    // INSCRIPTION SUPER ADMIN (en général utilisée une seule fois pour le setup)
    // POST /api/v1/auth/admin/register
    // ⚠️ À PROTÉGER EN PRODUCTION avec un middleware ou la supprimer
    // ---------------------------------------------------------------
    public function adminRegister(Request $request)
    {
        $validated = $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:super_admins,email',
            'password'  => 'required|string|min:8|confirmed',
            'telephone' => 'nullable|string|max:20',
            'photo'     => 'nullable|string|max:255',
        ]);

        // Hasher le password avant de l'enregistrer
        $validated['password'] = Hash::make($validated['password']);

        $admin = Admin::create($validated);

        return response()->json([
            'message' => 'Super Administrateur créé avec succès.',
            'admin'   => $admin,
        ], 201);
    }

    // ---------------------------------------------------------------
    // PROFIL DE L'UTILISATEUR CONNECTÉ
    // GET /api/v1/auth/me
    // Accès : tout utilisateur authentifié (admin, chef ou étudiant)
    // ---------------------------------------------------------------
    public function me(Request $request)
    {
        $user = $request->user();

        // Détecter le type d'utilisateur pour charger les bonnes relations
        if ($user instanceof Admin) {
            return response()->json([
                'type'   => 'super_admin',
                'profil' => $user,
            ]);
        }

        if ($user instanceof ChefDepartement) {
            return response()->json([
                'type'   => 'chef_departement',
                'profil' => $user->load('departement'),
            ]);
        }

        // Sinon c'est un étudiant (User)
        return response()->json([
            'type'   => 'student',
            'profil' => $user->load('filiere.departement'),
        ]);
    }
}
