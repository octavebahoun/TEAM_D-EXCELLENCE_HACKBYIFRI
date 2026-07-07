<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservationSalle extends Model
{
    protected $fillable = [
        'salle_id',
        'date_reservation',
        'heure_debut',
        'heure_fin',
        'motif',
        'created_by_admin_id',
    ];

    protected $casts = [
        'date_reservation' => 'date',
    ];

    public function salle(): BelongsTo
    {
        return $this->belongsTo(Salle::class);
    }
}
