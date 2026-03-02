<?php

namespace App\Notifications;

use App\Models\StudentAnalysis;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentAnalysisNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public StudentAnalysis $analysis)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusEmoji = match($this->analysis->niveau_alerte) {
            'danger' => '⚠️',
            'warning' => '📉',
            default => '📊',
        };

        return (new MailMessage)
            ->subject("{$statusEmoji} Ton bilan académique personnalisé — AcademiX")
            ->greeting("Bonjour {$notifiable->name} !")
            ->line($this->analysis->message_principal)
            ->line("**Matières à prioriser :** " . implode(', ', $this->analysis->matieres_prioritaires))
            ->line("💪 " . ($this->analysis->point_positif ?? "Continue tes efforts !"))
            ->action('Voir mon tableau de bord', url('/dashboard'))
            ->line('Ce message a été généré par notre IA pour t\'aider dans ta réussite.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type'              => 'student_analysis',
            'analysis_id'       => $this->analysis->id,
            'niveau_alerte'     => $this->analysis->niveau_alerte,
            'message_principal' => $this->analysis->message_principal,
            'matieres'          => $this->analysis->matieres_prioritaires,
        ];
    }
}
