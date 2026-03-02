<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('alertes', function (Blueprint $table) {
            $table->string('type_alerte')->change(); 
            $table->string('reference_id')->nullable()->after('user_id'); 
            $table->index(['reference_id']);
        });
    }

    
    public function down(): void
    {
        Schema::table('alertes', function (Blueprint $table) {
            $table->dropColumn('reference_id');
            
        });
    }
};
