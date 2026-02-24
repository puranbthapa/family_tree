<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tree collaborators with role-based permissions
        Schema::create('tree_collaborators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_tree_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['viewer', 'editor', 'admin'])->default('viewer');
            $table->timestamp('invited_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->string('invite_token')->nullable();
            $table->timestamps();

            $table->unique(['family_tree_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tree_collaborators');
    }
};
