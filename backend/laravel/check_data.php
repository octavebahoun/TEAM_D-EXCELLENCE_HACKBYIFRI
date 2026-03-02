<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\EmploiTempsFiliere;

$user = User::where('email', 'mourchidolawale@gmail.com')->first();
if ($user) {
    echo "USER_ID: " . $user->id . "\n";
    echo "USER_FILIERE_ID: " . $user->filiere_id . "\n";
    
    $count = EmploiTempsFiliere::where('filiere_id', $user->filiere_id)->count();
    echo "NB_COURS_FILIERE_" . $user->filiere_id . ": " . $count . "\n";
    
    $cours = EmploiTempsFiliere::with('matiere')->where('filiere_id', $user->filiere_id)->get();
    foreach ($cours as $c) {
        echo "COURSE: " . ($c->matiere->nom ?? 'N/A') . " | " . $c->jour . " | " . $c->heure_debut . " - " . $c->heure_fin . " | " . $c->salle . "\n";
    }
    
    if ($count == 0) {
        echo "Tentative de creation de cours pour la filiere " . $user->filiere_id . "...\n";
        $matiereId = \App\Models\Matiere::first()->id ?? 1;
        EmploiTempsFiliere::create([
            'filiere_id' => $user->filiere_id,
            'matiere_id' => $matiereId,
            'jour' => 'Lundi',
            'heure_debut' => '08:00',
            'heure_fin' => '10:00',
            'salle' => 'Amphi A',
            'type_cours' => 'CM',
            'semestre' => 'S1'
        ]);
        echo "Cours cree avec succes.\n";
    }
} else {
    echo "USER_NOT_FOUND\n";
}
