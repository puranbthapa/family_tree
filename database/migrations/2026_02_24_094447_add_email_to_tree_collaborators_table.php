<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First add email column
        Schema::table('tree_collaborators', function (Blueprint $table) {
            $table->string('email')->nullable()->after('user_id');
        });

        // Disable FK checks, drop unique index, make user_id nullable, re-enable FK checks
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Schema::table('tree_collaborators', function (Blueprint $table) {
            $table->dropUnique(['family_tree_id', 'user_id']);
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    public function down(): void
    {
        Schema::table('tree_collaborators', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change();
            $table->unique(['family_tree_id', 'user_id']);
            $table->dropColumn('email');
        });
    }
};
