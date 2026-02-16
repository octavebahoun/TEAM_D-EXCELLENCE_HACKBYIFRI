<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('statistiques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->integer('temps_etude_minutes')->default(0);
            $table->integer('nb_taches_completees')->default(0);
            $table->integer('nb_quiz_faits')->default(0);
            $table->integer('nb_sessions_participees')->default(0);
            $table->decimal('moyenne_generale', 5, 2)->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('statistiques');
    }
};
