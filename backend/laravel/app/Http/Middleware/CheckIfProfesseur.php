<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIfProfesseur
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !($user instanceof \App\Models\Enseignant)) {
            return response()->json([
                'message' => 'Non authentifié. Accès réservé aux professeurs.'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Votre compte est désactivé.'
            ], 403);
        }

        return $next($request);
    }
}
