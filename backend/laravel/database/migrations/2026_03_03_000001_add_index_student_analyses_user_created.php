<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Ajoute un index composite (user_id, created_at) pour accélérer
     * la requête anti-spam : WHERE user_id = ? AND created_at >= ?
     */
    public function up(): void
    {
        Schema::table('student_analyses', function (Blueprint $table) {
            $table->index(['user_id', 'created_at'], 'idx_sa_user_created');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_analyses', function (Blueprint $table) {
            $table->dropIndex('idx_sa_user_created');
        });
    }
};
