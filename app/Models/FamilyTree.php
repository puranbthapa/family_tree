<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class FamilyTree extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'owner_id',
        'privacy',
        'cover_image',
    ];

    /**
     * Use slug for route model binding.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Auto-generate unique slug when creating/updating.
     */
    protected static function booted(): void
    {
        static::creating(function (FamilyTree $tree) {
            if (empty($tree->slug)) {
                $tree->slug = static::generateUniqueSlug($tree->name);
            }
        });

        static::updating(function (FamilyTree $tree) {
            if ($tree->isDirty('name') && !$tree->isDirty('slug')) {
                $tree->slug = static::generateUniqueSlug($tree->name, $tree->id);
            }
        });
    }

    /**
     * Generate a unique slug from a name.
     */
    public static function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $baseSlug = Str::slug($name);
        if (empty($baseSlug)) {
            $baseSlug = 'family-tree';
        }

        $slug = $baseSlug;
        $counter = 1;

        $query = static::withTrashed()->where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
            $query = static::withTrashed()->where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }

    // ── Relationships ─────────────────────────────────────

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function persons(): HasMany
    {
        return $this->hasMany(Person::class);
    }

    public function relationships(): HasMany
    {
        return $this->hasMany(Relationship::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }

    public function collaborators(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'tree_collaborators')
            ->withPivot('role', 'invited_at', 'accepted_at')
            ->withTimestamps();
    }

    public function treeCollaborators(): HasMany
    {
        return $this->hasMany(TreeCollaborator::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    // ── Privacy & Access Control ──────────────────────────

    /**
     * Check if a tree is publicly viewable.
     */
    public function isPublic(): bool
    {
        return $this->privacy === 'public';
    }

    /**
     * Check if a tree is shared (collaborators only).
     */
    public function isShared(): bool
    {
        return $this->privacy === 'shared';
    }

    /**
     * Check if a tree is private (owner only).
     */
    public function isPrivate(): bool
    {
        return $this->privacy === 'private';
    }

    /**
     * Check if a user has access to this tree.
     * - Public trees: any authenticated user can view
     * - Shared trees: owner + accepted collaborators
     * - Private trees: owner only (+ admin collaborators)
     */
    public function hasAccess(?User $user, string $minRole = 'viewer'): bool
    {
        // Public trees allow viewing for any authenticated user
        if ($this->isPublic() && $minRole === 'viewer' && $user) {
            return true;
        }

        // Must have a user for non-public access
        if (!$user) return false;

        // Owner always has full access
        if ($this->owner_id === $user->id) return true;

        // Check collaborator role
        $roles = ['viewer' => 1, 'editor' => 2, 'admin' => 3];
        $collaborator = $this->treeCollaborators()
            ->where('user_id', $user->id)
            ->whereNotNull('accepted_at')
            ->first();

        if (!$collaborator) return false;

        return ($roles[$collaborator->role] ?? 0) >= ($roles[$minRole] ?? 0);
    }

    public function canEdit(User $user): bool
    {
        return $this->hasAccess($user, 'editor');
    }

    public function isAdmin(User $user): bool
    {
        return $this->owner_id === $user->id || $this->hasAccess($user, 'admin');
    }
}
