<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_responsable')->default(false)->after('is_active');
            $table->timestamp('responsable_valide_at')->nullable()->after('is_responsable');
            $table->unsignedBigInteger('responsable_valide_par')->nullable()->after('responsable_valide_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_responsable', 'responsable_valide_at', 'responsable_valide_par']);
        });
    }
};
