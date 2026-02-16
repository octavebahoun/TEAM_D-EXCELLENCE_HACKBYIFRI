<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ressources_partagees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type_ressource', ['fiche', 'epreuve', 'resume', 'mindmap', 'autre']);
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('fichier_url');
            $table->json('tags')->nullable();
            $table->decimal('note_moyenne', 2, 1)->default(0.0);
            $table->integer('nb_telechargements')->default(0);
            $table->integer('nb_votes')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ressources_partagees');
    }
};
