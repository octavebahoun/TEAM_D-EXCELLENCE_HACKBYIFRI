<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('enseignants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('departement_id')->constrained('departements')->onDelete('cascade');
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('email')->nullable()->unique();
            $table->string('telephone', 20)->nullable();
            $table->string('specialite', 150)->nullable();
            $table->enum('grade', ['vacataire', 'assistant', 'maitre_assistant', 'maitre_conference', 'professeur'])->nullable();
            $table->json('disponibilites')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enseignants');
    }
};
