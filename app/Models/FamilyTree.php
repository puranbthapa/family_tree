<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FamilyTree extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'privacy',
        'cover_image',
    ];

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

    public function hasAccess(User $user, string $minRole = 'viewer'): bool
    {
        if ($this->owner_id === $user->id) return true;

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
