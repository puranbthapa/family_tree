<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Relationship extends Model
{
    use HasFactory;

    protected $fillable = [
        'family_tree_id', 'person1_id', 'person2_id',
        'type', 'start_date', 'end_date', 'start_place', 'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function familyTree(): BelongsTo
    {
        return $this->belongsTo(FamilyTree::class);
    }

    public function person1(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'person1_id');
    }

    public function person2(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'person2_id');
    }

    // Get the other person in the relationship
    public function getOtherPerson(int $personId): ?Person
    {
        if ($this->person1_id === $personId) {
            return $this->person2;
        }
        if ($this->person2_id === $personId) {
            return $this->person1;
        }
        return null;
    }

    public static function getTypeLabel(string $type): string
    {
        return match($type) {
            'parent_child' => 'Parent / Child',
            'spouse' => 'Spouse',
            'ex_spouse' => 'Ex-Spouse',
            'partner' => 'Partner',
            'sibling' => 'Sibling',
            'half_sibling' => 'Half-Sibling',
            'step_parent_child' => 'Step-Parent / Child',
            'adoptive_parent_child' => 'Adoptive Parent / Child',
            'guardian' => 'Guardian',
            default => ucfirst(str_replace('_', ' ', $type)),
        };
    }
}
