<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LifeEvent;
use App\Models\FamilyTree;
use App\Models\Person;
use Illuminate\Http\Request;

class LifeEventController extends Controller
{
    public function index(Request $request, FamilyTree $familyTree, Person $person)
    {
        if (!$familyTree->hasAccess($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($person->lifeEvents);
    }

    public function store(Request $request, FamilyTree $familyTree, Person $person)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'nullable|date',
            'event_place' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'sort_order' => 'nullable|integer',
        ]);

        $event = $person->lifeEvents()->create($validated);

        return response()->json($event, 201);
    }

    public function update(Request $request, FamilyTree $familyTree, Person $person, LifeEvent $lifeEvent)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type' => 'sometimes|string|max:50',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'nullable|date',
            'event_place' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'sort_order' => 'nullable|integer',
        ]);

        $lifeEvent->update($validated);

        return response()->json($lifeEvent);
    }

    public function destroy(Request $request, FamilyTree $familyTree, Person $person, LifeEvent $lifeEvent)
    {
        if (!$familyTree->canEdit($request->user())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $lifeEvent->delete();

        return response()->json(['message' => 'Event deleted']);
    }

    public function types()
    {
        return response()->json(LifeEvent::getEventTypes());
    }
}
