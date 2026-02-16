<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alertes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('type_alerte', ['risque_echec', 'moyenne_basse', 'retard_devoirs', 'absence_revision']);
            $table->enum('niveau_severite', ['info', 'warning', 'danger'])->default('warning');
            $table->string('titre');
            $table->text('message');
            $table->json('actions_suggerees')->nullable();
            $table->boolean('is_read')->default(false);
            $table->boolean('is_dismissed')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alertes');
    }
};
