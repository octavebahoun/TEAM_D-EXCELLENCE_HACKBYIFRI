<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\EmploiTempsFiliere;
use Illuminate\Support\Facades\Log;

$email = 'mourchidolawale@gmail.com';
$user = User::where('email', $email)->first();

if (!$user) {
    echo "Utilisateur $email non trouvé.\n";
    exit;
}

echo "--- Test de l'Observer EmploiTempsFiliere ---\n";
echo "Utilisateur : {$user->nom} {$user->prenom} (Filière ID : {$user->filiere_id})\n";

// Trouver un cours existant pour cette filière ou en créer un temporaire
$cours = EmploiTempsFiliere::where('filiere_id', $user->filiere_id)->first();

if (!$cours) {
    echo "Aucun cours trouvé pour la filière {$user->filiere_id}. Création d'un cours de test...\n";
    $matiereId = \App\Models\Matiere::first()->id ?? 1;
    $cours = EmploiTempsFiliere::create([
        'filiere_id' => $user->filiere_id,
        'matiere_id' => $matiereId,
        'jour' => 'Mardi',
        'heure_debut' => '10:00',
        'heure_fin' => '12:00',
        'salle' => 'Salle E-101',
        'type_cours' => 'TD',
        'semestre' => 'S1'
    ]);
    echo "✅ Cours créé. L'observer devrait avoir déclenché la synchro.\n";
} else {
    echo "Modification du cours ID {$cours->id}...\n";
    $ancienTitre = $cours->type_cours;
    $nouveauTitre = ($ancienTitre === 'CM') ? 'TD' : 'CM';
    
    $cours->update(['type_cours' => $nouveauTitre]);
    echo "✅ Cours mis à jour (Type: $nouveauTitre). L'observer devrait avoir déclenché la synchro.\n";
}

echo "\nVérifiez vos logs (storage/logs/laravel.log) ou l'agenda Google pour confirmer la mise à jour.\n";
