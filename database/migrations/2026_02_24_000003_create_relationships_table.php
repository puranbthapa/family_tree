<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('relationships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_tree_id')->constrained()->cascadeOnDelete();
            $table->foreignId('person1_id')->constrained('persons')->cascadeOnDelete();
            $table->foreignId('person2_id')->constrained('persons')->cascadeOnDelete();
            $table->enum('type', [
                'parent_child',      // person1 is parent of person2
                'spouse',            // married
                'ex_spouse',         // divorced
                'partner',           // unmarried partner
                'sibling',           // full sibling
                'half_sibling',      // half sibling
                'step_parent_child', // step-parent relationship
                'adoptive_parent_child', // adoption
                'guardian',          // legal guardian
            ]);
            $table->date('start_date')->nullable(); // e.g., marriage date
            $table->date('end_date')->nullable();    // e.g., divorce date
            $table->string('start_place')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['person1_id', 'person2_id', 'type']);
            $table->index('family_tree_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relationships');
    }
};
