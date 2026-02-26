<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\FamilyTree;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('family_trees', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('name');
        });

        // Generate slugs for existing trees
        $trees = FamilyTree::withTrashed()->get();
        foreach ($trees as $tree) {
            $baseSlug = Str::slug($tree->name);
            $slug = $baseSlug;
            $counter = 1;
            while (FamilyTree::withTrashed()->where('slug', $slug)->where('id', '!=', $tree->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $tree->slug = $slug;
            $tree->save();
        }

        // Now make it non-nullable
        Schema::table('family_trees', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('family_trees', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
