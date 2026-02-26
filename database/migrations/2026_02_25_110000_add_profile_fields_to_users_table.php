<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('date_of_birth');
            $table->string('address')->nullable()->after('gender');           // e.g. Ward-5, Lakeside
            $table->string('municipality')->nullable()->after('address');     // e.g. Pokhara Metropolitan City
            $table->string('district')->nullable()->after('municipality');    // e.g. Kaski
            $table->string('province')->nullable()->after('district');        // e.g. Gandaki Province
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'date_of_birth', 'gender', 'address', 'municipality', 'district', 'province']);
        });
    }
};
