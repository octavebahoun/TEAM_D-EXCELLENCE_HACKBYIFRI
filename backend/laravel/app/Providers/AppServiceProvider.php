<?php

namespace App\Providers;

use App\Models\Alerte;
use App\Observers\AlerteObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    public function register(): void
    {

    }

    public function boot(): void
    {
        // Déclenche le webhook Socket.io dès qu'une alerte est créée dans MySQL
        \App\Models\Alerte::observe(\App\Observers\AlerteObserver::class);

        // Détecte les performances (seuil 12) dès qu'une note est saisie
        \App\Models\Note::observe(\App\Observers\NoteObserver::class);

        \App\Models\Tache::observe(\App\Observers\TacheObserver::class);
        \App\Models\EmploiTempsFiliere::observe(\App\Observers\EmploiTempsObserver::class);
    }
}
