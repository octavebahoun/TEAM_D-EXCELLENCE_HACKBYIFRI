<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    protected $fillable = [
        'user_id',
        'matiere_id',
        'emploi_temps_id',
        'date_absence',
        'type',
        'justifiee',
        'motif',
        'duree_minutes',
        'created_by_admin_id',
    ];

    protected $casts = [
        'date_absence' => 'date',
        'justifiee' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
    }
}
