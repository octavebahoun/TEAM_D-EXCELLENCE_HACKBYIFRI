<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIfResponsable
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !($user instanceof \App\Models\User)) {
            return response()->json([
                'message' => 'Non authentifié. Accès réservé aux étudiants.'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Votre compte est désactivé.'
            ], 403);
        }

        if (!$user->is_responsable) {
            return response()->json([
                'message' => 'Accès réservé au responsable de classe.'
            ], 403);
        }

        return $next($request);
    }
}
