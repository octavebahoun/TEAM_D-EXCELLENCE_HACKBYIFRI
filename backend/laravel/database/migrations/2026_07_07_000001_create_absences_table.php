<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained('matieres')->onDelete('set null');
            $table->unsignedBigInteger('emploi_temps_id')->nullable();
            $table->date('date_absence');
            $table->enum('type', ['cours', 'examen', 'tp', 'autre'])->default('cours');
            $table->boolean('justifiee')->default(false);
            $table->string('motif')->nullable();
            $table->unsignedInteger('duree_minutes')->nullable();
            $table->unsignedBigInteger('created_by_admin_id')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'date_absence']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
};
