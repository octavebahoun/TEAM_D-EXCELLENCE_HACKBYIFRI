<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use App\Models\ImportLog;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasApiTokens;

    // Nom de la table dans la base de données
    protected $table = 'super_admins';

    // Champs que l'on peut remplir via Admin::create()
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'photo',
        'is_active',
        'last_login',
    ];

    // Conversion automatique des types de données
    protected $casts = [
        'is_active' => 'boolean',
        'last_login' => 'datetime',
    ];

    // Champs masqués lors de la conversion en JSON (sécurité)
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * RELATION : Un Super Admin peut avoir créé plusieurs imports.
     */
    public function importLogs(): HasMany
    {
        return $this->hasMany(ImportLog::class);
    }

    /**
     * SÉCURITÉ : Vérifie si c'est un Super Admin.
     * Étant donné que ce modèle pointe sur la table 'super_admins', 
     * il retournera toujours true.
     */
    public function isSuperAdmin(): bool
    {
        return true;
    }

    /**
     * SÉCURITÉ : Vérifie si c'est un Chef de Département.
     * Pour un admin de cette table, c'est toujours false.
     * Les chefs utilisent le modèle ChefDepartement.
     */
    public function isChefDepartement(): bool
    {
        return false;
    }
}
