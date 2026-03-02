<?php

namespace App\Observers;

use App\Models\EmploiTempsFiliere;
use App\Models\User;
use App\Services\GoogleApiService;
use Illuminate\Support\Facades\Log;

class EmploiTempsObserver
{
    public function __construct(protected GoogleApiService $googleService) {}

    /**
     * Handle the EmploiTempsFiliere "created" event.
     */
    public function created(EmploiTempsFiliere $emploiTempsFiliere): void
    {
        $this->syncForFiliere($emploiTempsFiliere->filiere_id);
    }

    /**
     * Handle the EmploiTempsFiliere "updated" event.
     */
    public function updated(EmploiTempsFiliere $emploiTempsFiliere): void
    {
        $this->syncForFiliere($emploiTempsFiliere->filiere_id);
    }

    /**
     * Handle the EmploiTempsFiliere "deleted" event.
     */
    public function deleted(EmploiTempsFiliere $emploiTempsFiliere): void
    {
        $this->syncForFiliere($emploiTempsFiliere->filiere_id);
    }

    /**
     * Synchronise le calendrier Google pour tous les étudiants de la filière.
     */
    protected function syncForFiliere(int $filiereId): void
    {
        // On récupère tous les utilisateurs de cette filière qui ont connecté leur compte Google
        $users = User::where('filiere_id', $filiereId)
            ->whereNotNull('google_access_token')
            ->get();

        foreach ($users as $user) {
            try {
                $this->googleService->syncEmploiTemps($user);
            } catch (\Exception $e) {
                Log::error("Erreur synchro globale Google Calendar (Filiere: $filiereId, User: {$user->id}): " . $e->getMessage());
            }
        }
    }
}
