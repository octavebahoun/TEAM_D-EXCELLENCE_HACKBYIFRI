<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Communication extends Model
{
    protected $fillable = [
        'filiere_id',
        'auteur_type',
        'auteur_id',
        'auteur_nom',
        'type',
        'titre',
        'message',
        'date_evenement',
        'fichier_url',
        'fichier_nom',
        'notifie_admin',
    ];

    protected $casts = [
        'date_evenement' => 'datetime',
        'notifie_admin' => 'boolean',
    ];

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }
}
