<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Salle extends Model
{
    protected $fillable = [
        'nom',
        'capacite',
        'type',
        'localisation',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'capacite' => 'integer',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(ReservationSalle::class);
    }
}
