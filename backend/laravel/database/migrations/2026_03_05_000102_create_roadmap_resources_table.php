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
        Schema::create('roadmap_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('roadmap_sections')->cascadeOnDelete();
            $table->string('resource_type');
            $table->string('title')->nullable();
            $table->string('url');
            $table->string('source')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->unsignedTinyInteger('score')->nullable();
            $table->string('level')->nullable();
            $table->text('summary')->nullable();
            $table->longText('transcript')->nullable();
            $table->string('status')->default('pending');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('roadmap_resources');
    }
};
