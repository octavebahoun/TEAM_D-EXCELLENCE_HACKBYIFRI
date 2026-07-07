<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->string('admin_type')->nullable();     // super_admin / chef_departement
            $table->string('admin_nom')->nullable();
            $table->unsignedBigInteger('departement_id')->nullable();
            $table->string('action', 100);                // ex: note.validee, absence.creee
            $table->string('auditable_type')->nullable();
            $table->unsignedBigInteger('auditable_id')->nullable();
            $table->string('description')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index('departement_id');
            $table->index(['action', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
