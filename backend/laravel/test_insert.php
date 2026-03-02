<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\EmploiTempsFiliere;
use App\Services\GoogleApiService;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Carbon\Carbon;

$email = 'mourchidolawale@gmail.com';
$user = User::where('email', $email)->first();

$googleService = app(GoogleApiService::class);
$googleService->setAccessTokenForUser($user);

$reflection = new ReflectionClass($googleService);
$property = $reflection->getProperty('client');
$property->setAccessible(true);
$client = $property->getValue($googleService);

$service = new Calendar($client);
$calendarId = $user->google_calendar_id;

echo "Synchronisation manuelle d'un événement unique...\n";

$event = new Event([
    'summary' => 'TEST FINAL ACADEMIX',
    'location' => 'Amphi A',
    'description' => 'Test de synchronisation forcée',
    'start' => [
        'dateTime' => Carbon::now()->addHour()->toRfc3339String(),
        'timeZone' => 'Africa/Porto-Novo',
    ],
    'end' => [
        'dateTime' => Carbon::now()->addHours(2)->toRfc3339String(),
        'timeZone' => 'Africa/Porto-Novo',
    ],
]);

try {
    $createdEvent = $service->events->insert($calendarId, $event);
    echo "✅ Événement créé avec ID : " . $createdEvent->getId() . "\n";
    
    echo "\n--- Liste des événements actuels ---\n";
    $events = $service->events->listEvents($calendarId);
    foreach ($events->getItems() as $e) {
        echo "- " . $e->getSummary() . " (" . $e->getStart()->getDateTime() . ")\n";
    }
} catch (\Exception $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
}
