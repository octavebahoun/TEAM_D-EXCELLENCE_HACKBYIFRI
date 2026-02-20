<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
// ChefDepartement hérite de Authenticatable pour pouvoir se connecter et générer des tokens
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChefDepartement extends Authenticatable
{
    // Permet à ce modèle d'utiliser les tokens Sanctum (comme les Super Admins et les étudiants)
    use HasApiTokens;

    // Nom de la table dans la base de données
    protected $table = 'chefs_departement';

    // Champs autorisés à être remplis en masse via ::create()
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'photo',
        'departement_id',      // Le département auquel ce chef appartient
        'created_by_admin',    // ID du Super Admin qui a créé ce chef (traçabilité)
        'is_active',
        'last_login',
    ];

    // Conversion automatique des types de données
    protected $casts = [
        'is_active' => 'boolean',
        'last_login' => 'datetime',
        'departement_id' => 'integer',
    ];

    // Champs masqués lors de la conversion en JSON (ne jamais exposer le mot de passe)
    protected $hidden = [
        'password',
    ];

    /**
     * RELATION : Un Chef appartient à un Département.
     * Permet de faire $chef->departement pour récupérer les infos du département.
     */
    public function departement(): BelongsTo
    {
        return $this->belongsTo(Departement::class, 'departement_id');
    }

    /**
     * RELATION : Référence au Super Admin qui a créé ce chef.
     * Permet la traçabilité : on sait quel admin a créé quel chef.
     */
    public function createdByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by_admin');
    }

    /**
     * SÉCURITÉ : Un Chef de Département n'est jamais un Super Admin.
     */
    public function isSuperAdmin(): bool
    {
        return false;
    }

    /**
     * SÉCURITÉ : Confirme que cet utilisateur est bien un Chef de Département.
     */
    public function isChefDepartement(): bool
    {
        return true;
    }
}
