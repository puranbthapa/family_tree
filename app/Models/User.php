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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

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

        return FamilyTree::whereIn('id', $ownedIds->merge($collabIds)->unique());
    }
}
