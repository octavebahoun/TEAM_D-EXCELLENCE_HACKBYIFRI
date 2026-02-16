<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contenu_ia_id')->constrained('contenus_ia')->onDelete('cascade');
            $table->text('question');
            $table->json('options');
            $table->integer('reponse_correcte');
            $table->text('explication')->nullable();
            $table->integer('ordre')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
