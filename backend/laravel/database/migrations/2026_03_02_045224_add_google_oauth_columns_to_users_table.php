<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('google_access_token')->nullable()->after('last_login');
            $table->text('google_refresh_token')->nullable()->after('google_access_token');
            $table->string('google_id')->nullable()->unique()->after('google_refresh_token');
            $table->string('google_calendar_id')->nullable()->after('google_id');
            $table->string('google_task_list_id')->nullable()->after('google_calendar_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'google_access_token',
                'google_refresh_token',
                'google_id',
                'google_calendar_id',
                'google_task_list_id'
            ]);
        });
    }
};
