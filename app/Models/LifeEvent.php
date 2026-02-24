<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LifeEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'person_id', 'type', 'title', 'description',
        'event_date', 'event_place', 'latitude', 'longitude', 'sort_order',
    ];

    protected $casts = [
        'event_date' => 'date',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }

    public static function getEventTypes(): array
    {
        return [
            'birth' => 'Birth',
            'death' => 'Death',
            'marriage' => 'Marriage',
            'divorce' => 'Divorce',
            'engagement' => 'Engagement',
            'graduation' => 'Graduation',
            'immigration' => 'Immigration',
            'emigration' => 'Emigration',
            'military_service' => 'Military Service',
            'retirement' => 'Retirement',
            'baptism' => 'Baptism',
            'bar_mitzvah' => 'Bar/Bat Mitzvah',
            'confirmation' => 'Confirmation',
            'ordination' => 'Ordination',
            'naturalization' => 'Naturalization',
            'census' => 'Census',
            'residence' => 'Residence',
            'occupation' => 'Occupation',
            'education' => 'Education',
            'medical' => 'Medical Event',
            'other' => 'Other',
        ];
    }
}
