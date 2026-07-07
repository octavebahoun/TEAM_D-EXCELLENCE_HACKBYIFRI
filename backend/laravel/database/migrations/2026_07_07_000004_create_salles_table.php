<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('salles', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 50)->unique();
            $table->unsignedInteger('capacite')->nullable();
            $table->enum('type', ['amphi', 'salle_td', 'labo', 'salle_info', 'autre'])->default('salle_td');
            $table->string('localisation', 150)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salles');
    }
};
