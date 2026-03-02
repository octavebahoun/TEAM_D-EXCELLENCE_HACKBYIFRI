<?php

namespace App\Services;

use App\Models\PushSubscription;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Illuminate\Support\Facades\Log;
class WebPushService
{
    private WebPush $webPush;

    public function __construct()
    {
        $auth = [
            'VAPID' => [
                'subject' => config('app.vapid_subject', 'mailto:contact@academix.app'),
                'publicKey' => config('app.vapid_public_key'),
                'privateKey' => config('app.vapid_private_key'),
            ],
        ];

        $this->webPush = new WebPush($auth);

        // En développement, on accepte les erreurs SSL
        if (app()->environment('local')) {
            $this->webPush->setDefaultOptions([
                'TTL' => 86400, // 24h de durée de vie du message
                'curl' => [CURLOPT_SSL_VERIFYPEER => false],
            ]);
        }
    }


    public function sendToUser(int $userId, array $payload): void
    {
        $subscriptions = PushSubscription::where('user_id', $userId)->get();

        foreach ($subscriptions as $sub) {
            $this->sendToSubscription($sub, $payload);
        }
    }


    public function sendToSubscription(PushSubscription $subscription, array $payload): void
    {
        try {
            $webPushSub = Subscription::create([
                'endpoint' => $subscription->endpoint,
                'publicKey' => $subscription->public_key,
                'authToken' => $subscription->auth_token,
                'contentEncoding' => 'aesgcm',
            ]);

            $jsonPayload = json_encode(array_merge([
                'title' => 'AcademiX',
                'icon' => '/icons/icon-192x192.png',
                'badge' => '/icons/icon-72x72.png',
                'url' => '/dashboard',
            ], $payload));

            $report = $this->webPush->sendOneNotification($webPushSub, $jsonPayload);

            // Traiter le résultat
            if (!$report->isSuccess()) {
                $reason = $report->getReason();
                // 410 Gone = navigateur a révoqué l'abonnement → on le supprime
                if (in_array($report->getResponse()?->getStatusCode(), [404, 410])) {
                    Log::info("[Push] Abonnement expiré (user #{$subscription->user_id}), suppression.");
                    $subscription->delete();
                } else {
                    Log::warning("[Push] Échec envoi (user #{$subscription->user_id}): {$reason}");
                }
            }
        } catch (\Throwable $e) {
            Log::error('[Push] Exception lors de l\'envoi: ' . $e->getMessage());
        }
    }
}
