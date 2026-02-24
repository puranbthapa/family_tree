<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_id')->nullable()->constrained('persons')->cascadeOnDelete();
            $table->foreignId('family_tree_id')->constrained()->cascadeOnDelete();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->string('type'); // photo, document, video, audio
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size');
            $table->string('thumbnail_path')->nullable();
            $table->date('media_date')->nullable();
            $table->timestamps();

            $table->index(['person_id']);
            $table->index(['family_tree_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
