<?php

namespace App\Jobs;

use App\Models\Alerte;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateAlerteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;

    /**
     * Create a new job instance.
     *
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $referenceId = $this->data['reference_id'] ?? null;

            
            if ($referenceId) {
                $exists = Alerte::where('reference_id', $referenceId)
                    ->whereDate('created_at', now()->toDateString())
                    ->exists();
                if ($exists) {
                    return; // On ne spamme pas l'utilisateur pour le même événement le même jour
                }
            }

            Alerte::create([
                'user_id' => $this->data['user_id'],
                'reference_id' => $referenceId,
                'type_alerte' => $this->data['type_alerte'],
                'niveau_severite' => $this->data['niveau_severite'],
                'titre' => $this->data['titre'],
                'message' => $this->data['message'],
                'actions_suggerees' => $this->data['actions_suggerees'] ?? null,
                'est_lue' => false,
            ]);            
        } catch (\Exception $e) {
            Log::error("Erreur lors de la génération de l'alerte : " . $e->getMessage());
        }
    }
}
