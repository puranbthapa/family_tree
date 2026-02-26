<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'municipality',
        'district',
        'province',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['role_names'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
        ];
    }

    // ── Role Relationships & Helpers ───────────────────────────

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    public function getRoleNamesAttribute(): array
    {
        return $this->roles->pluck('name')->toArray();
    }

    public function hasRole(string ...$roles): bool
    {
        return $this->roles->whereIn('name', $roles)->isNotEmpty();
    }

    public function hasAnyRole(array $roles): bool
    {
        return $this->roles->whereIn('name', $roles)->isNotEmpty();
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isModerator(): bool
    {
        return $this->hasRole('admin', 'moderator');
    }

    public function assignRole(string ...$roles): void
    {
        $roleModels = Role::whereIn('name', $roles)->get();
        $this->roles()->syncWithoutDetaching($roleModels);
    }

    public function removeRole(string ...$roles): void
    {
        $roleModels = Role::whereIn('name', $roles)->get();
        $this->roles()->detach($roleModels);
    }

    public function syncRoles(array $roles): void
    {
        $roleModels = Role::whereIn('name', $roles)->get();
        $this->roles()->sync($roleModels);
    }

    // ── Tree Relationships ─────────────────────────────────────

    public function ownedTrees(): HasMany
    {
        return $this->hasMany(FamilyTree::class, 'owner_id');
    }

    public function collaboratedTrees(): BelongsToMany
    {
        return $this->belongsToMany(FamilyTree::class, 'tree_collaborators')
            ->withPivot('role', 'invited_at', 'accepted_at')
            ->withTimestamps();
    }

    public function allAccessibleTrees()
    {
        $ownedIds = $this->ownedTrees()->pluck('id');
        $collabIds = $this->collaboratedTrees()
            ->wherePivotNotNull('accepted_at')
            ->pluck('family_trees.id');

        // Include public trees from other users
        $publicIds = FamilyTree::where('privacy', 'public')
            ->pluck('id');

        return FamilyTree::whereIn('id', $ownedIds->merge($collabIds)->merge($publicIds)->unique());
    }
}
