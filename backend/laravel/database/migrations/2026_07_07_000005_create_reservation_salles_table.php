<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reservation_salles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salle_id')->constrained('salles')->onDelete('cascade');
            $table->date('date_reservation');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->string('motif')->nullable();
            $table->unsignedBigInteger('created_by_admin_id')->nullable();
            $table->timestamps();

            $table->index(['salle_id', 'date_reservation']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_salles');
    }
};
