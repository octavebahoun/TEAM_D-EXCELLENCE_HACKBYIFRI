<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained()->onDelete('set null');
            $table->string('titre');
            $table->text('description')->nullable();
            $table->enum('type', ['devoir', 'revision', 'examen', 'projet', 'lecture', 'autre'])->default('devoir');
            $table->dateTime('date_limite')->nullable();
            $table->enum('priorite', ['basse', 'moyenne', 'haute'])->default('moyenne');
            $table->enum('statut', ['a_faire', 'en_cours', 'termine'])->default('a_faire');
            $table->integer('temps_estime')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taches');
    }
};
