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
use App\Http\Controllers\Api\StudentAnalysisController;
use App\Http\Controllers\Api\GoogleAuthController;
use App\Http\Controllers\Api\PushSubscriptionController;
use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\EnseignantController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\CommunicationController;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {

        Route::post('admin/register', [AuthController::class, 'adminRegister'])->middleware(['auth:sanctum', 'super.admin']);
        Route::post('admin/login', [AuthController::class, 'adminLogin']);
        Route::post('admin/logout', [AuthController::class, 'adminLogout'])->middleware('auth:sanctum');

        Route::post('chef/login', [AuthController::class, 'chefLogin']);
        Route::post('chef/logout', [AuthController::class, 'chefLogout'])->middleware('auth:sanctum');

        Route::post('student/register', [AuthController::class, 'studentRegister'])->middleware('auth:sanctum');
        Route::post('student/login', [AuthController::class, 'studentLogin']);
        Route::post('student/activate', [AuthController::class, 'studentActivate']);
        Route::post('student/logout', [AuthController::class, 'studentLogout'])->middleware('auth:sanctum');

        // Professeur (compte Enseignant connectable)
        Route::post('professeur/login', [AuthController::class, 'professeurLogin']);
        Route::post('professeur/logout', [AuthController::class, 'professeurLogout'])->middleware('auth:sanctum');

        Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');

        // Google OAuth Routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('google/redirect', [GoogleAuthController::class, 'redirectToGoogle']);
            // Le code OAuth est envoyé en POST depuis le frontend callback page
            Route::post('google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
        });
    });

    Route::prefix('admin')->middleware(['auth:sanctum', 'super.admin'])->group(function () {

        Route::prefix('departements')->group(function () {
            Route::get('', [DepartementController::class, 'index']);
            Route::post('', [DepartementController::class, 'store']);
            Route::get('{id}', [DepartementController::class, 'show']);
            Route::put('{id}', [DepartementController::class, 'update']);
            Route::delete('{id}', [DepartementController::class, 'destroy']);
            Route::get('{id}/stats', [StatistiqueController::class, 'departement']);
        });

        Route::prefix('chefs-departement')->group(function () {
            Route::get('', [ChefDepartementController::class, 'index']);
            Route::post('', [ChefDepartementController::class, 'store']);
            Route::get('{id}', [ChefDepartementController::class, 'show']);
            Route::put('{id}', [ChefDepartementController::class, 'update']);
            Route::delete('{id}', [ChefDepartementController::class, 'destroy']);
            Route::post('{id}/toggle', [ChefDepartementController::class, 'toggle']);
        });

        Route::get('stats/global', [StatistiqueController::class, 'global']);
        Route::get('stats/dashboard', [StatistiqueController::class, 'dashboard']);

        Route::apiResource('matieres', MatiereController::class)->names([
            'index' => 'admin.matieres.index',
            'store' => 'admin.matieres.store',
            'show' => 'admin.matieres.show',
            'update' => 'admin.matieres.update',
            'destroy' => 'admin.matieres.destroy'
        ]);

        Route::get('emploi-temps/filieres/{id}', [EmploiTempsController::class, 'index']);
        Route::apiResource('notes', NoteController::class)->names([
            'index' => 'admin.notes.index',
            'store' => 'admin.notes.store',
            'show' => 'admin.notes.show',
            'update' => 'admin.notes.update',
            'destroy' => 'admin.notes.destroy'
        ]);
        Route::apiResource('emploi-temps', EmploiTempsController::class)->except(['index'])->names([
            'store' => 'admin.emploi-temps.store',
            'show' => 'admin.emploi-temps.show',
            'update' => 'admin.emploi-temps.update',
            'destroy' => 'admin.emploi-temps.destroy'
        ]);
    });

    Route::prefix('departement')->middleware(['auth:sanctum', 'admin', 'admin.departement.owner'])->group(function () {

        Route::apiResource('matieres', MatiereController::class)->names([
            'index' => 'departement.matieres.index',
            'store' => 'departement.matieres.store',
            'show' => 'departement.matieres.show',
            'update' => 'departement.matieres.update',
            'destroy' => 'departement.matieres.destroy'
        ]);

        Route::prefix('filieres')->group(function () {
            Route::get('', [FiliereController::class, 'index']);
            Route::post('', [FiliereController::class, 'store']);
            Route::get('{id}', [FiliereController::class, 'show']);
            Route::put('{id}', [FiliereController::class, 'update']);
            Route::delete('{id}', [FiliereController::class, 'destroy']);

            Route::post('{id}/matieres', [MatiereController::class, 'assignToFiliere']);
            Route::delete('{id}/matieres/{matiere_id}', [MatiereController::class, 'removeFromFiliere']);

            Route::get('{id}/etudiants', [FiliereController::class, 'etudiants']);
            Route::get('{id}/matieres', [FiliereController::class, 'matieres']);
            Route::get('{id}/stats', [StatistiqueController::class, 'filiere']);
            Route::get('{id}/emploi-temps', [EmploiTempsController::class, 'index']);
        });

        Route::get('etudiants', [StudentController::class, 'index']);
        Route::post('import/etudiants', [ImportController::class, 'importEtudiants']);
        Route::post('import/notes', [ImportController::class, 'importNotes']);
        Route::post('import/emploi-temps', [ImportController::class, 'importEmploiTemps']);
        Route::get('import/template/etudiants', [ImportController::class, 'templateEtudiants']);
        Route::get('import/template/notes', [ImportController::class, 'templateNotes']);
        Route::get('import/template/emploi-temps', [ImportController::class, 'templateEmploiTemps']);
        Route::get('import/history', [ImportController::class, 'history']);
        Route::get('import/history/{id}/download', [\App\Http\Controllers\Api\DownloadImportLogController::class, 'download']);

        Route::apiResource('notes', NoteController::class)->names([
            'index' => 'departement.notes.index',
            'store' => 'departement.notes.store',
            'show' => 'departement.notes.show',
            'update' => 'departement.notes.update',
            'destroy' => 'departement.notes.destroy'
        ]);
        Route::apiResource('emploi-temps', EmploiTempsController::class)->except(['index'])->names([
            'store' => 'departement.emploi-temps.store',
            'show' => 'departement.emploi-temps.show',
            'update' => 'departement.emploi-temps.update',
            'destroy' => 'departement.emploi-temps.destroy'
        ]);

        // ---------- Absences (suivi + alertes automatiques) ----------
        Route::get('absences/stats', [AbsenceController::class, 'stats']);
        Route::apiResource('absences', AbsenceController::class)->except(['show'])->names([
            'index' => 'departement.absences.index',
            'store' => 'departement.absences.store',
            'update' => 'departement.absences.update',
            'destroy' => 'departement.absences.destroy',
        ]);

        // ---------- Enseignants (CRUD + affectation aux matières) ----------
        Route::post('enseignants/{id}/matieres', [EnseignantController::class, 'assignMatiere']);
        Route::delete('enseignants/{id}/matieres/{matiere_id}', [EnseignantController::class, 'removeMatiere']);
        Route::apiResource('enseignants', EnseignantController::class)->names([
            'index' => 'departement.enseignants.index',
            'store' => 'departement.enseignants.store',
            'show' => 'departement.enseignants.show',
            'update' => 'departement.enseignants.update',
            'destroy' => 'departement.enseignants.destroy',
        ]);

        // ---------- Salles & réservations (disponibilité + réservation) ----------
        Route::get('salles/disponibilite', [SalleController::class, 'disponibilite']);
        Route::post('salles/{id}/reservations', [SalleController::class, 'reserver']);
        Route::delete('salles/reservations/{reservation_id}', [SalleController::class, 'annulerReservation']);
        Route::apiResource('salles', SalleController::class)->names([
            'index' => 'departement.salles.index',
            'store' => 'departement.salles.store',
            'show' => 'departement.salles.show',
            'update' => 'departement.salles.update',
            'destroy' => 'departement.salles.destroy',
        ]);

        // ---------- Validation des notes (workflow brouillon -> validée) ----------
        Route::post('notes/valider-lot', [NoteController::class, 'validerLot']);
        Route::post('notes/{id}/valider', [NoteController::class, 'valider']);
        Route::post('notes/{id}/invalider', [NoteController::class, 'invalider']);

        // ---------- Communications (transmission d'infos + supports) ----------
        Route::get('communications', [CommunicationController::class, 'index']);
        Route::post('communications', [CommunicationController::class, 'store']);
        Route::delete('communications/{id}', [CommunicationController::class, 'destroy']);

        // ---------- Responsable de classe (badge validé par le chef) ----------
        Route::post('etudiants/{id}/responsable', [StudentController::class, 'toggleResponsable']);

        // ---------- Historique des actions (traçabilité) ----------
        Route::get('audit-logs', [AuditLogController::class, 'index']);

        Route::get('dashboard', [StatistiqueController::class, 'dashboard']);
    });

    // ============ PROFESSEUR (compte Enseignant connectable) ============
    Route::prefix('professeur')->middleware(['auth:sanctum', 'professeur'])->group(function () {
        Route::get('communications', [CommunicationController::class, 'index']);
        Route::post('communications', [CommunicationController::class, 'store']);
        Route::delete('communications/{id}', [CommunicationController::class, 'destroy']);
    });

    // ============ RESPONSABLE DE CLASSE (étudiant avec badge validé) ============
    Route::prefix('responsable')->middleware(['auth:sanctum', 'responsable'])->group(function () {
        // Présences / absences de sa classe
        Route::get('absences/stats', [AbsenceController::class, 'stats']);
        Route::get('absences', [AbsenceController::class, 'index']);
        Route::post('absences', [AbsenceController::class, 'store']);
        Route::put('absences/{id}', [AbsenceController::class, 'update']);
        Route::delete('absences/{id}', [AbsenceController::class, 'destroy']);
        // Transmission d'infos + supports de cours
        Route::get('communications', [CommunicationController::class, 'index']);
        Route::post('communications', [CommunicationController::class, 'store']);
        Route::delete('communications/{id}', [CommunicationController::class, 'destroy']);
        // Ses camarades de classe (pour la saisie des présences)
        Route::get('etudiants', [StudentController::class, 'mesCamarades']);
    });

    Route::prefix('student')->middleware(['auth:sanctum', 'student'])->group(function () {
        Route::get('profil', [StudentController::class, 'profil']);
        Route::put('profil', [StudentController::class, 'updateProfil']);
        Route::get('moyennes', [StudentController::class, 'moyennes']);
        Route::get('notes', [StudentController::class, 'notes']);
        Route::get('emploi-temps', [StudentController::class, 'emploiTemps']);

        Route::patch('taches/{id}/complete', [TacheController::class, 'complete']);
        Route::apiResource('taches', TacheController::class);

        Route::get('alertes', [AlerteController::class, 'index']);
        Route::patch('alertes/{id}/read', [AlerteController::class, 'markAsRead']);

        // IA Analysis Routes
        Route::match(['get', 'post'], 'analysis', [StudentAnalysisController::class, 'analyze']);
        Route::get('analysis/history', [StudentAnalysisController::class, 'history']);
        Route::post('analysis/mark-sent/{id}', [StudentAnalysisController::class, 'markAsSent']);

        // Push Notifications Routes (rate-limited: 6 requêtes/minute)
        Route::middleware('throttle:6,1')->group(function () {
            Route::post('push/subscribe', [PushSubscriptionController::class, 'store']);
            Route::delete('push/subscribe', [PushSubscriptionController::class, 'destroy']);
        });

        // Profil update (POST nécessaire pour gérer les fichiers/avatars plus facilement)
        Route::post('profil-update', [StudentController::class, 'updateProfil']);

        // Google Calendar Routes
        Route::get('google/status', [GoogleAuthController::class, 'googleStatus']);
        Route::delete('google/disconnect', [GoogleAuthController::class, 'googleDisconnect']);
        Route::post('google/sync', [GoogleAuthController::class, 'googleSync']);

        // Communications de la classe (lecture par l'étudiant)
        Route::get('communications', [CommunicationController::class, 'index']);
    });
});
