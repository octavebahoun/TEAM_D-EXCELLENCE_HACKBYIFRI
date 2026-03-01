<?php

namespace App\Observers;

use App\Models\Alerte;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AlerteObserver
{
    /**
     * Appelé juste après la création d'une alerte dans MySQL.
     * Envoie un webhook HTTP au serveur Node.js pour qu'il crée
     * la notification MongoDB et l'émette en temps réel via Socket.io.
     */
    public function created(Alerte $alerte): void
    {
        $nodeUrl = config('services.node.url');
        $secret = config('services.node.webhook_secret');

        // Si l'URL Node n'est pas configurée, on skip silencieusement
        if (empty($nodeUrl)) {
            Log::warning('AlerteObserver : NODE_BACKEND_URL non configuré, webhook ignoré.');
            return;
        }

        try {
            Http::withHeaders([
                'Content-Type' => 'application/json',
                'x-webhook-secret' => $secret ?? '',
            ])
                ->timeout(5)          // 5 secondes max — on ne bloque pas la requête principale
                ->post("{$nodeUrl}/api/webhook/alerte", [
                    'user_id' => $alerte->user_id,
                    'type_alerte' => $alerte->type_alerte,
                    'niveau_severite' => $alerte->niveau_severite,
                    'titre' => $alerte->titre,
                    'message' => $alerte->message,
                    'alerte_id' => $alerte->id,
                    'actions_suggerees' => $alerte->actions_suggerees ?? [],
                ]);

            Log::info("AlerteObserver : webhook envoyé → user_id={$alerte->user_id}, type={$alerte->type_alerte}");
        } catch (\Throwable $e) {
            // On log l'erreur mais on ne la propage pas :
            // un webhook raté ne doit jamais faire échouer la création d'alerte
            Log::warning("AlerteObserver : échec du webhook Socket.io — {$e->getMessage()}");
        }
    }
}
