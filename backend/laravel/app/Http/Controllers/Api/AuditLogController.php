<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /** Historique des actions administratives (traçabilité). */
    public function index(Request $request)
    {
        $admin = $request->user();
        $isChef = method_exists($admin, 'isChefDepartement') && $admin->isChefDepartement();

        $logs = AuditLog::query()
            ->when($isChef, fn($q) => $q->where('departement_id', $admin->departement_id))
            ->when($request->action, fn($q, $v) => $q->where('action', 'like', "%{$v}%"))
            ->when($request->date_debut, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($request->date_fin, fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->orderByDesc('created_at')
            ->paginate(30);

        return response()->json($logs);
    }
}
