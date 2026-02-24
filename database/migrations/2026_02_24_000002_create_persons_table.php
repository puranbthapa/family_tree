<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('persons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_tree_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('maiden_name')->nullable();
            $table->string('nickname')->nullable();
            $table->string('aliases')->nullable();
            $table->enum('gender', ['male', 'female', 'other', 'unknown'])->default('unknown');
            $table->date('date_of_birth')->nullable();
            $table->string('birth_place')->nullable();
            $table->decimal('birth_latitude', 10, 7)->nullable();
            $table->decimal('birth_longitude', 10, 7)->nullable();
            $table->date('date_of_death')->nullable();
            $table->string('death_place')->nullable();
            $table->decimal('death_latitude', 10, 7)->nullable();
            $table->decimal('death_longitude', 10, 7)->nullable();
            $table->boolean('is_living')->default(true);
            $table->string('occupation')->nullable();
            $table->string('religion')->nullable();
            $table->string('nationality')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->text('notes')->nullable();
            $table->string('profile_photo')->nullable();
            $table->json('custom_fields')->nullable();
            // Position for drag-and-drop tree editor
            $table->decimal('tree_position_x', 10, 2)->nullable();
            $table->decimal('tree_position_y', 10, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['family_tree_id', 'last_name']);
            $table->index(['family_tree_id', 'first_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('persons');
    }
};
