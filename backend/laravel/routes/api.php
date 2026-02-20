<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\TacheController;
use App\Http\Controllers\Api\AlerteController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\FiliereController;
use App\Http\Controllers\Api\MatiereController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\DepartementController;
use App\Http\Controllers\Api\EmploiTempsController;
use App\Http\Controllers\Api\StatistiqueController;
use App\Http\Controllers\Api\ChefDepartementController;

/*
|--------------------------------------------------------------------------
| API Routes v1
|--------------------------------------------------------------------------
|
| Règle d'organisation :
|   - AuthController  ➜ uniquement Login / Logout / Register / Me
|   - DepartementController ➜ tout ce qui concerne les départements
|   - ChefDepartementController ➜ tout ce qui concerne les chefs
|
| Ordre logique de création (imposé par la BDD) :
|   1. Super Admin se crée  (POST /auth/admin/register)
|   2. Super Admin crée un Département (POST /admin/departements)
|   3. Super Admin crée un Chef pour ce Département (POST /admin/chefs-departement)
|
*/

Route::prefix('v1')->group(function () {

    // ============================================================
    // AUTHENTIFICATION (routes publiques et protégées)
    // ============================================================
    Route::prefix('auth')->group(function () {

        // --- SUPER ADMIN ---
        // ⚠️ Protéger /admin/register en production (ou le supprimer après le premier setup)
        Route::post('admin/register', [AuthController::class, 'adminRegister']);
        Route::post('admin/login', [AuthController::class, 'adminLogin']);
        Route::post('admin/logout', [AuthController::class, 'adminLogout'])->middleware('auth:sanctum');

        // --- CHEF DE DÉPARTEMENT ---
        // La connexion du chef utilise sa propre route dédiée
        Route::post('chef/login', [AuthController::class, 'chefLogin']);
        Route::post('chef/logout', [AuthController::class, 'chefLogout'])->middleware('auth:sanctum');

        // --- ÉTUDIANT ---
        Route::post('student/register', [AuthController::class, 'studentRegister']);
        Route::post('student/login', [AuthController::class, 'studentLogin']);
        Route::post('student/logout', [AuthController::class, 'studentLogout'])->middleware('auth:sanctum');

        // --- PROFIL DE L'UTILISATEUR CONNECTÉ (admin, chef, ou étudiant) ---
        Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    });

    // ============================================================
    // ROUTES SUPER ADMIN UNIQUEMENT
    // Middleware : auth:sanctum + super.admin
    // ============================================================
    Route::prefix('admin')->middleware(['auth:sanctum', 'super.admin'])->group(function () {

        // 📋 GESTION DES DÉPARTEMENTS
        // Ordre : créer un département AVANT de créer un chef
        Route::prefix('departements')->group(function () {
            Route::get('', [DepartementController::class, 'index']);   // Lister tous
            Route::post('', [DepartementController::class, 'store']);   // Créer un département
            Route::get('{id}', [DepartementController::class, 'show']);    // Voir un département
            Route::put('{id}', [DepartementController::class, 'update']);  // Modifier
            Route::delete('{id}', [DepartementController::class, 'destroy']); // Supprimer
            Route::get('{id}/stats', [DepartementController::class, 'stats']);   // Statistiques
        });

        // 👨‍💼 GESTION DES CHEFS DE DÉPARTEMENT
        // Ordre : le département doit exister AVANT de créer un chef
        Route::prefix('chefs-departement')->group(function () {
            Route::get('', [ChefDepartementController::class, 'index']);   // Lister
            Route::post('', [ChefDepartementController::class, 'store']);   // Créer (département requis)
            Route::get('{id}', [ChefDepartementController::class, 'show']);    // Voir un chef
            Route::put('{id}', [ChefDepartementController::class, 'update']);  // Modifier
            Route::delete('{id}', [ChefDepartementController::class, 'destroy']); // Supprimer
            Route::post('{id}/toggle', [ChefDepartementController::class, 'toggle']); // Activer/Désactiver
        });

        // 📊 STATISTIQUES GLOBALES
        Route::get('stats/global', [StatistiqueController::class, 'global']);
        Route::get('stats/dashboard', [StatistiqueController::class, 'dashboard']);
    });

    // ============================================================
    // ROUTES CHEF DE DÉPARTEMENT
    // Middleware : auth:sanctum + chef.departement + admin.departement.owner
    // ============================================================
    Route::prefix('departement')->middleware(['auth:sanctum', 'chef.departement', 'admin.departement.owner'])->group(function () {

        // 📚 GESTION DES FILIÈRES (dans son département uniquement)
        Route::prefix('filieres')->group(function () {
            Route::get('', [FiliereController::class, 'index']);
            Route::post('', [FiliereController::class, 'store']);
            Route::get('{id}', [FiliereController::class, 'show']);
            Route::put('{id}', [FiliereController::class, 'update']);
            Route::delete('{id}', [FiliereController::class, 'destroy']);
        });

        // 📝 GESTION DES ÉTUDIANTS & NOTES
        Route::get('etudiants', [StudentController::class, 'index']);
        Route::post('import/etudiants', [ImportController::class, 'importEtudiants']);
        Route::post('import/notes', [ImportController::class, 'importNotes']);

        // 📊 TABLEAU DE BORD DU DÉPARTEMENT
        Route::get('dashboard', [StatistiqueController::class, 'dashboard']);
    });

    // ============================================================
    // ROUTES ÉTUDIANT
    // Middleware : auth:sanctum + student
    // ============================================================
    Route::prefix('student')->middleware(['auth:sanctum', 'student'])->group(function () {
        Route::get('profil', [StudentController::class, 'profil']);
        Route::get('notes', [StudentController::class, 'notes']);
        Route::get('emploi-temps', [StudentController::class, 'emploiTemps']);

        // ✅ TÂCHES PERSONNELLES (CRUD complet)
        Route::apiResource('taches', TacheController::class);
    });
});