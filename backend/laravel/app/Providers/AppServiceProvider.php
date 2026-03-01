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
        Alerte::observe(AlerteObserver::class);
    }
}
