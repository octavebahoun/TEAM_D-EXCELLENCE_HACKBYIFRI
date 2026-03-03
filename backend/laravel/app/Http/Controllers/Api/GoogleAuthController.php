<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    public function __construct(protected GoogleApiService $googleService)
    {
    }

    /**
     * Redirige vers la page d'authentification Google.
     */
    public function redirectToGoogle()
    {
        return response()->json([
            'auth_url' => $this->googleService->getAuthUrl()
        ]);
    }

    /**
     * Gère le retour de l'authentification Google (Callback).
     * Reçoit le code via POST depuis la page callback du frontend SPA.
     */
    public function handleGoogleCallback(Request $request)
    {
        $code = $request->input('code'); // Reçu en POST body depuis le frontend

        if (!$code) {
            return response()->json(['error' => "Code d'autorisation manquant"], 400);
        }

        try {
            $token = $this->googleService->fetchAccessTokenWithAuthCode($code);

            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Utilisateur non authentifié. Veuillez vous connecter avant de lier votre compte Google.'], 401);
            }

            // Mise à jour de l'utilisateur avec les jetons Google
            $updateData = [
                'google_access_token' => json_encode($token),
            ];

            if (isset($token['refresh_token'])) {
                $updateData['google_refresh_token'] = $token['refresh_token'];
            }

            $user->update($updateData);

            // Déclenche une première synchronisation de l'emploi du temps
            try {
                $this->googleService->syncEmploiTemps($user);
            } catch (\Exception $e) {
                Log::warning("Impossible de faire la synchro initiale du calendrier: " . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Compte Google connecté avec succès !'
            ]);

        } catch (\Exception $e) {
            Log::error("Erreur Google Callback: " . $e->getMessage());
            return response()->json(['error' => "Impossible de connecter le compte Google : " . $e->getMessage()], 500);
        }
    }

    /**
     * Retourne le statut de connexion Google de l'étudiant connecté.
     */
    public function googleStatus(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'connected' => !empty($user->google_access_token),
            'calendar_id' => $user->google_calendar_id,
            'task_list_id' => $user->google_task_list_id,
        ]);
    }

    /**
     * Déconnecte le compte Google de l'étudiant (supprime les jetons).
     */
    public function googleDisconnect(Request $request)
    {
        $request->user()->update([
            'google_access_token' => null,
            'google_refresh_token' => null,
            'google_id' => null,
            'google_calendar_id' => null,
            'google_task_list_id' => null,
        ]);

        return response()->json(['success' => true, 'message' => 'Compte Google déconnecté avec succès.']);
    }

    /**
     * Déclenche manuellement la synchronisation de l'emploi du temps vers Google Calendar.
     */
    public function googleSync(Request $request)
    {
        $user = $request->user();

        if (empty($user->google_access_token)) {
            return response()->json(['error' => 'Compte Google non connecté.'], 400);
        }

        try {
            $this->googleService->syncEmploiTemps($user);
            return response()->json(['success' => true, 'message' => 'Emploi du temps synchronisé avec succès !']);
        } catch (\Exception $e) {
            Log::error("Erreur synchro manuelle Google: " . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la synchronisation : ' . $e->getMessage()], 500);
        }
    }
}
