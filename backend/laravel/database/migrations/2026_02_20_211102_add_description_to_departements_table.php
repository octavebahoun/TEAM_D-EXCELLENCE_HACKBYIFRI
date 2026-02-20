<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('departements', function (Blueprint $table) {
            // Ajout de la description (nullable car elle n'existait pas avant)
            // Placée après 'code' pour un ordre logique
            $table->text('description')->nullable()->after('code');
        });
    }

    public function down(): void
    {
        Schema::table('departements', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
};
