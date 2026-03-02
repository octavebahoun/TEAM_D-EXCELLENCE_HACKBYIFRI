<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Tache;
use App\Services\GoogleApiService;

$email = 'mourchidolawale@gmail.com';
$user = User::where('email', $email)->first();

if (!$user) {
    // Créer un utilisateur de test si inexistant
    $user = User::create([
        'nom' => 'Mourchid',
        'prenom' => 'Olawale',
        'email' => $email,
        'password' => bcrypt('password'),
        'matricule' => 'TEST' . rand(1000, 9999),
        'filiere_id' => 1, // On suppose qu'une filière existe
    ]);
    echo "Utilisateur créé : $email\n";
} else {
    echo "Utilisateur existant : $email\n";
}

if (!$user->google_access_token) {
    echo "ERREUR : L'utilisateur n'est pas connecté à Google. Le test de synchronisation est impossible sans jeton OAuth.\n";
    echo "ACTION : Connectez-vous d'abord via l'URL : http://localhost:8000/api/v1/auth/google/redirect\n";
    exit;
}

$googleService = app(GoogleApiService::class);

echo "--- Test Google Calendar (Emploi du temps) ---\n";
try {
    $googleService->syncEmploiTemps($user);
    echo "✅ Emploi du temps synchronisé avec succès.\n";
} catch (\Exception $e) {
    echo "❌ Erreur Calendar : " . $e->getMessage() . "\n";
}

echo "\n--- Test Google Tasks ---\n";
try {
    $tache = Tache::create([
        'user_id' => $user->id,
        'titre' => 'Tâche de test AcademiX ' . date('H:i'),
        'description' => 'Ceci est une tâche test générée automatiquement.',
        'date_limite' => now()->addDays(2),
        'statut' => 'a_faire',
    ]);
    echo "✅ Tâche créée et synchronisée (via Observer).\n";
    echo "ID Google Task : " . $tache->google_task_id . "\n";
} catch (\Exception $e) {
    echo "❌ Erreur Tasks : " . $e->getMessage() . "\n";
}
