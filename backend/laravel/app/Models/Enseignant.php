<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Sanctum\HasApiTokens;

class Enseignant extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'departement_id',
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'specialite',
        'grade',
        'disponibilites',
        'is_active',
        'last_login',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'disponibilites' => 'array',
        'is_active' => 'boolean',
        'departement_id' => 'integer',
        'last_login' => 'datetime',
    ];

    public function departement(): BelongsTo
    {
        return $this->belongsTo(Departement::class);
    }

    public function matieres(): BelongsToMany
    {
        return $this->belongsToMany(Matiere::class, 'enseignant_matiere')->withTimestamps();
    }

    public function isSuperAdmin(): bool
    {
        return false;
    }

    public function isChefDepartement(): bool
    {
        return false;
    }

    public function isProfesseur(): bool
    {
        return true;
    }
}
