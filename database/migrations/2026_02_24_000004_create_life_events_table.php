<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('life_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_id')->constrained('persons')->cascadeOnDelete();
            $table->string('type'); // birth, death, marriage, divorce, graduation, immigration, etc.
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('event_date')->nullable();
            $table->string('event_place')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['person_id', 'event_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('life_events');
    }
};
