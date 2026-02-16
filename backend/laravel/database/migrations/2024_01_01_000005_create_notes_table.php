<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained()->onDelete('cascade');
            $table->string('intitule');
            $table->decimal('note_obtenue', 5, 2);
            $table->decimal('note_maximale', 5, 2)->default(20.00);
            $table->decimal('coefficient', 3, 1)->default(1.0);
            $table->date('date_evaluation');
            $table->enum('type_evaluation', ['devoir', 'controle', 'partiel', 'examen', 'projet'])->default('devoir');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
