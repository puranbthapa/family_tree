<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TreeCollaborator extends Model
{
    use HasFactory;

    protected $fillable = [
        'family_tree_id', 'user_id', 'email', 'role',
        'invited_at', 'accepted_at', 'invite_token',
    ];

    protected $casts = [
        'invited_at' => 'datetime',
        'accepted_at' => 'datetime',
    ];

    public function familyTree(): BelongsTo
    {
        return $this->belongsTo(FamilyTree::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
