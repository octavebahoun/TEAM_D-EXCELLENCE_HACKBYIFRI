<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->float('moyenne_generale');
            $table->string('niveau_alerte')->default('info'); // info | warning | danger
            $table->text('message_principal');
            $table->json('conseils');                  // tableau de conseils
            $table->json('matieres_prioritaires');     // matières à travailler
            $table->text('point_positif')->nullable();
            $table->json('contexte_raw')->nullable();  // contexte envoyé au LLM (debug)
            $table->timestamp('sent_at')->nullable();  // date d'envoi notification
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_analyses');
    }
};
