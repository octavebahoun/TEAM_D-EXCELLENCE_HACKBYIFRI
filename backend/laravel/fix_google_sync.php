<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Services\GoogleApiService;
use Google\Service\Calendar;

$email = 'mourchidolawale@gmail.com';
$user = User::where('email', $email)->first();

if (!$user || !$user->google_access_token) {
    echo "Utilisateur non connecté.\n";
    exit;
}

$googleService = app(GoogleApiService::class);
if (!$googleService->setAccessTokenForUser($user)) {
    echo "Impossible de rafraîchir le jeton Google.\n";
    exit;
}

// Récupération du client configuré à l'intérieur du service
$reflection = new ReflectionClass($googleService);
$property = $reflection->getProperty('client');
$property->setAccessible(true);
$client = $property->getValue($googleService);

$service = new Calendar($client);

try {
    echo "--- Vérification des Agendas Google ---\n";
    $calendarList = $service->calendarList->listCalendarList();
    foreach ($calendarList->getItems() as $calendarListEntry) {
        echo "- " . $calendarListEntry->getSummary() . " (ID: " . $calendarListEntry->getId() . ")\n";
    }

    echo "\nSynchronisation forcée de l'emploi du temps...\n";
    $googleService->syncEmploiTemps($user);
    echo "✅ Synchronisation terminée avec succès.\n";

} catch (\Exception $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
}
