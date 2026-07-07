<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            $table->enum('statut', ['brouillon', 'validee'])->default('brouillon')->after('annee_academique');
            $table->timestamp('validated_at')->nullable()->after('statut');
            $table->unsignedBigInteger('validated_by')->nullable()->after('validated_at');
        });

        // Les notes déjà existantes sont considérées comme validées
        // (pour ne pas casser les statistiques ni l'affichage étudiant).
        DB::table('notes')->update(['statut' => 'validee']);
    }

    public function down(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            $table->dropColumn(['statut', 'validated_at', 'validated_by']);
        });
    }
};
