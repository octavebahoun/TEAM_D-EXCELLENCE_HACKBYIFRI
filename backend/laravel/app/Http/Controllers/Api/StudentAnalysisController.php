<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentAnalysis;
use App\Services\PythonAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentAnalysisController extends Controller
{
    public function __construct(protected PythonAIService $aiService)
    {
    }

    /**
     * Lancer une nouvelle analyse IA complète pour un étudiant.
     *
     * @param int|null $id
     * @return JsonResponse
     */
    public function analyze(Request $request, ?int $id = null): JsonResponse
    {
        // Si aucun ID n'est fourni, on analyse l'utilisateur connecté
        $targetId = $id ?? $request->user()?->id;

        if (!$targetId) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non identifié.'
            ], 401);
        }

        // 1. On vérifie l'existence de l'utilisateur
        $student = User::find($targetId);
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Étudiant non trouvé.'
            ], 404);
        }

        // 2. Anti-spam : 1 analyse maximum toutes les 24h
        $lastAnalysis = StudentAnalysis::where('user_id', $targetId)
            ->where('created_at', '>=', now()->subHours(24))
            ->latest()
            ->first();

        if ($lastAnalysis) {
            return response()->json([
                'success' => false,
                'message' => "Une analyse a déjà été effectuée il y a moins de 24h pour cet étudiant.",
                'data' => $lastAnalysis
            ], 429);
        }

        // 3. Appel du service Python
        $result = $this->aiService->analyzeStudent($targetId);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => "L'IA n'a pas pu traiter la demande : " . ($result['error'] ?? 'Erreur inconnue')
            ], 500);
        }

        $analysisData = $result['data']['analysis']; // JSON généré par l'IA
        $contextData = $result['data']['context'];  // Données de contexte calculées par Python

        // 4. Enregistrement en base de données
        try {
            $analysis = StudentAnalysis::create([
                'user_id' => $targetId,
                'moyenne_generale' => $contextData['moyenne_generale'],
                'niveau_alerte' => $analysisData['niveau_alerte'] ?? 'info',
                'message_principal' => $analysisData['message_principal'],
                'conseils' => $analysisData['conseils'] ?? [],
                'matieres_prioritaires' => $analysisData['matieres_prioritaires'] ?? [],
                'point_positif' => $analysisData['point_positif'] ?? null,
                'contexte_raw' => $contextData,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Analyse IA générée et sauvegardée avec succès.',
                'data' => $analysis
            ]);
        } catch (\Exception $e) {
            Log::error("Erreur sauvegarde analyse IA: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la sauvegarde de l\'analyse.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer l'historique des analyses d'un étudiant.
     *
     * @param int|null $id
     * @return JsonResponse
     */
    public function history(Request $request, ?int $id = null): JsonResponse
    {
        $targetId = $id ?? $request->user()?->id;

        $analyses = StudentAnalysis::where('user_id', $targetId)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $analyses
        ]);
    }

    /**
     * Marquer une analyse comme ayant été envoyée par mail/notif.
     * Si l'ID est celui d'un utilisateur, on prend sa dernière analyse.
     * Sinon on cherche par ID d'analyse.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function markAsSent(int $id): JsonResponse
    {
        // On cherche d'abord si c'est un ID d'analyse
        $analysis = StudentAnalysis::find($id);

        if (!$analysis) {
            // Sinon on cherche la dernière analyse de l'utilisateur avec cet ID
            $analysis = StudentAnalysis::where('user_id', $id)->latest()->first();
        }

        if (!$analysis) {
            return response()->json(['success' => false, 'message' => 'Analyse non trouvée.'], 404);
        }

        $analysis->update(['sent_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'L\'envoi du bilan a été marqué comme effectué.',
            'sent_at' => $analysis->sent_at
        ]);
    }
}
