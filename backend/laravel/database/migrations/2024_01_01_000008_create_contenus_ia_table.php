<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contenus_ia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type_contenu', ['fiche', 'quiz', 'podcast', 'exercices']);
            $table->string('titre');
            $table->longText('contenu_json');
            $table->string('source_doc')->nullable();
            $table->string('fichier_genere')->nullable();
            $table->enum('statut', ['en_cours', 'termine', 'erreur'])->default('en_cours');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contenus_ia');
    }
};
