<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('communications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
            $table->string('auteur_type', 30);            // professeur / responsable / chef / admin
            $table->unsignedBigInteger('auteur_id')->nullable();
            $table->string('auteur_nom')->nullable();
            $table->enum('type', ['info', 'annulation', 'rattrapage', 'support', 'regle'])->default('info');
            $table->string('titre', 150);
            $table->text('message')->nullable();
            $table->dateTime('date_evenement')->nullable(); // date de rattrapage / séance
            $table->string('fichier_url')->nullable();       // support de cours
            $table->string('fichier_nom')->nullable();
            $table->boolean('notifie_admin')->default(false);
            $table->timestamps();

            $table->index(['filiere_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communications');
    }
};
