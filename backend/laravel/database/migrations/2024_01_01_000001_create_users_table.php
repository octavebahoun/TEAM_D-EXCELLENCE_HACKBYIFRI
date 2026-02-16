<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('universite')->nullable();
            $table->string('filiere')->nullable();
            $table->enum('niveau', ['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat'])->nullable();
            $table->decimal('objectif_moyenne', 4, 2)->nullable();
            $table->enum('style_apprentissage', ['visuel', 'auditif', 'kinesthésique'])->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->integer('xp_total')->default(0);
            $table->integer('niveau_gamification')->default(1);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
