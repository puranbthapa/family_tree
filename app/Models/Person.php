<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Person extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'persons';

    protected $fillable = [
        'family_tree_id', 'first_name', 'middle_name', 'last_name',
        'maiden_name', 'nickname', 'aliases', 'gender',
        'date_of_birth', 'birth_place', 'birth_latitude', 'birth_longitude',
        'date_of_death', 'death_place', 'death_latitude', 'death_longitude',
        'is_living', 'occupation', 'religion', 'nationality',
        'email', 'phone', 'bio', 'notes', 'profile_photo',
        'custom_fields', 'tree_position_x', 'tree_position_y',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_of_death' => 'date',
        'is_living' => 'boolean',
        'custom_fields' => 'array',
        'birth_latitude' => 'decimal:7',
        'birth_longitude' => 'decimal:7',
        'death_latitude' => 'decimal:7',
        'death_longitude' => 'decimal:7',
        'tree_position_x' => 'decimal:2',
        'tree_position_y' => 'decimal:2',
    ];

    protected $appends = ['full_name', 'age'];

    public function familyTree(): BelongsTo
    {
        return $this->belongsTo(FamilyTree::class);
    }

    public function lifeEvents(): HasMany
    {
        return $this->hasMany(LifeEvent::class)->orderBy('event_date');
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Relationships where this person is person1
    public function relationshipsAsFirst(): HasMany
    {
        return $this->hasMany(Relationship::class, 'person1_id');
    }

    // Relationships where this person is person2
    public function relationshipsAsSecond(): HasMany
    {
        return $this->hasMany(Relationship::class, 'person2_id');
    }

    // Get all relationships for this person
    public function getAllRelationships()
    {
        return Relationship::where('person1_id', $this->id)
            ->orWhere('person2_id', $this->id)
            ->get();
    }

    // Get parents
    public function parents()
    {
        return Person::whereIn('id', function ($query) {
            $query->select('person1_id')
                ->from('relationships')
                ->where('person2_id', $this->id)
                ->whereIn('type', ['parent_child', 'step_parent_child', 'adoptive_parent_child']);
        })->get();
    }

    // Get children
    public function children()
    {
        return Person::whereIn('id', function ($query) {
            $query->select('person2_id')
                ->from('relationships')
                ->where('person1_id', $this->id)
                ->whereIn('type', ['parent_child', 'step_parent_child', 'adoptive_parent_child']);
        })->get();
    }

    // Get spouses
    public function spouses()
    {
        $spouseIds = Relationship::where(function ($q) {
                $q->where('person1_id', $this->id)->orWhere('person2_id', $this->id);
            })
            ->whereIn('type', ['spouse', 'partner'])
            ->get()
            ->map(fn ($r) => $r->person1_id === $this->id ? $r->person2_id : $r->person1_id);

        return Person::whereIn('id', $spouseIds)->get();
    }

    // Get siblings
    public function siblings()
    {
        $parentIds = Relationship::where('person2_id', $this->id)
            ->whereIn('type', ['parent_child'])
            ->pluck('person1_id');

        $siblingIds = Relationship::whereIn('person1_id', $parentIds)
            ->where('type', 'parent_child')
            ->where('person2_id', '!=', $this->id)
            ->pluck('person2_id')
            ->unique();

        return Person::whereIn('id', $siblingIds)->get();
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }

    public function getAgeAttribute(): ?int
    {
        if (!$this->date_of_birth) return null;

        $endDate = $this->is_living ? now() : ($this->date_of_death ?? now());
        return $this->date_of_birth->diffInYears($endDate);
    }
}
