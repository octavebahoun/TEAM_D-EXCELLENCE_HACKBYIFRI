<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('roadmap_jobs', function (Blueprint $table) {
            $table->foreignId('student_id')
                ->nullable()
                ->after('uuid')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('roadmap_jobs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('student_id');
        });
    }
};
