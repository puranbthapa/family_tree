<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('persons', function (Blueprint $table) {
            $table->string('province')->nullable()->after('nationality');
            $table->string('district')->nullable()->after('province');
            $table->string('municipality')->nullable()->after('district');
            $table->string('address')->nullable()->after('municipality');
        });
    }

    public function down(): void
    {
        Schema::table('persons', function (Blueprint $table) {
            $table->dropColumn(['province', 'district', 'municipality', 'address']);
        });
    }
};
