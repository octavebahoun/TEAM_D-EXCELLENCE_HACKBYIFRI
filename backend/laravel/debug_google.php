<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\EmploiTempsFiliere;
use App\Services\GoogleApiService;
use Google\Service\Calendar;

$email = 'mourchidolawale@gmail.com';
$user = User::where('email', $email)->first();

if (!$user) {
    die("Utilisateur non trouvé : $email\n");
}

echo "EMAIL: " . $user->email . "\n";
echo "FILIERE ID: " . $user->filiere_id . "\n";

$edt = EmploiTempsFiliere::where('filiere_id', $user->filiere_id)->with('matiere')->get();
echo "NB COURS LOCAUX: " . $edt->count() . "\n";
foreach($edt as $c) {
    echo "- " . $c->jour . " " . $c->heure_debut . " -> " . $c->heure_fin . " (" . ($c->matiere->nom ?? 'Inconnue') . ")\n";
}

if ($user->google_access_token && $user->google_calendar_id) {
    $googleService = app(GoogleApiService::class);
    $googleService->setAccessTokenForUser($user);
    
    $reflection = new ReflectionClass($googleService);
    $property = $reflection->getProperty('client');
    $property->setAccessible(true);
    $client = $property->getValue($googleService);
    
    $service = new Calendar($client);
    
    try {
        echo "\n--- ÉVÉNEMENTS GOOGLE ---\n";
        $events = $service->events->listEvents($user->google_calendar_id);
        foreach ($events->getItems() as $event) {
            echo "Summary: " . $event->getSummary() . "\n";
            echo "Start: " . ($event->getStart()->getDateTime() ?: $event->getStart()->getDate()) . "\n";
            if ($event->getRecurrence()) {
                echo "Recurrence: " . implode(', ', $event->getRecurrence()) . "\n";
            }
            echo "--------------------------\n";
        }
    } catch (\Exception $e) {
        echo "Erreur Google: " . $e->getMessage() . "\n";
    }
} else {
    echo "Pas de jeton ou d'ID calendrier Google.\n";
}
