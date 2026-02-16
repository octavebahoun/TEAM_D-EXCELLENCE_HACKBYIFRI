<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quiz_resultats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('contenu_ia_id')->constrained('contenus_ia')->onDelete('cascade');
            $table->integer('score');
            $table->integer('score_max');
            $table->integer('temps_passe')->nullable();
            $table->json('reponses_donnees')->nullable();
            $table->json('notions_faibles')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_resultats');
    }
};
