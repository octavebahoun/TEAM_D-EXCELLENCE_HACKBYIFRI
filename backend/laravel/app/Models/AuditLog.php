<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class AuditLog extends Model
{
    protected $fillable = [
        'admin_id',
        'admin_type',
        'admin_nom',
        'departement_id',
        'action',
        'auditable_type',
        'auditable_id',
        'description',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /**
     * Journalise une action administrative. Ne lève jamais d'exception
     * (l'audit ne doit jamais casser l'action métier réelle).
     *
     * @param  mixed  $admin      L'utilisateur authentifié (Admin ou ChefDepartement)
     * @param  string $action     Code court de l'action (ex: "absence.creee")
     * @param  ?string $description
     * @param  array  $meta
     * @param  ?Model $auditable  L'entité concernée (optionnel)
     */
    public static function record($admin, string $action, ?string $description = null, array $meta = [], ?Model $auditable = null): void
    {
        try {
            $isChef = $admin && method_exists($admin, 'isChefDepartement') && $admin->isChefDepartement();

            static::create([
                'admin_id'       => $admin->id ?? null,
                'admin_type'     => $isChef ? 'chef_departement' : 'super_admin',
                'admin_nom'      => $admin ? trim(($admin->prenom ?? '') . ' ' . ($admin->nom ?? '')) : null,
                'departement_id' => $admin->departement_id ?? null,
                'action'         => $action,
                'auditable_type' => $auditable ? get_class($auditable) : null,
                'auditable_id'   => $auditable->id ?? null,
                'description'    => $description,
                'meta'           => $meta ?: null,
            ]);
        } catch (\Throwable $e) {
            Log::warning('AuditLog::record a échoué : ' . $e->getMessage());
        }
    }
}
